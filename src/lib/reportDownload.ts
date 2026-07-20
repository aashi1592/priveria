/**
 * Renders an export template and downloads it as .md, .html, or .pdf.
 * HTML wraps the rendered markdown in a styled self-contained document.
 * PDF prints that HTML document via jsPDF + html2canvas.
 */
import { marked } from "marked";
import DOMPurify from "dompurify";
import jsPDF from "jspdf";
import type { Assessment } from "@/contexts/AssessmentsContext";
import type { ThreatRegisterEntry } from "@/lib/exportTemplates";
import { exportTemplates } from "@/lib/exportTemplates";

function loadThreats(assessmentId: string): ThreatRegisterEntry[] {
  try {
    return JSON.parse(localStorage.getItem(`priveria.threatRegister.${assessmentId}`) ?? "[]");
  } catch {
    return [];
  }
}

function buildMarkdown(assessment: Assessment, templateId: string): string {
  const tpl = exportTemplates.find((t) => t.id === templateId);
  if (!tpl) return "";
  return tpl.render({ assessment, threats: loadThreats(assessment.id) });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function markdownToHtml(markdown: string, title: string): string {
  // Report content is built from user-controlled assessment/threat data, so the
  // rendered markdown must be sanitized before it is injected into the HTML/PDF
  // document (marked does not sanitize as of v4+). The title is plain-text and
  // is HTML-escaped rather than parsed as markup.
  const rendered = marked.parse(markdown) as string;
  const body = DOMPurify.sanitize(rendered, { USE_PROFILES: { html: true } });
  const safeTitle = escapeHtml(title);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.7;
      color: #1a1a2e;
      background: #ffffff;
      max-width: 860px;
      margin: 0 auto;
      padding: 48px 40px;
    }
    h1 { font-size: 2rem; color: #0f172a; border-bottom: 3px solid #6366f1; padding-bottom: 10px; margin-bottom: 24px; }
    h2 { font-size: 1.3rem; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 36px; }
    h3 { font-size: 1.05rem; color: #334155; margin-top: 24px; }
    p  { margin: 8px 0; }
    a  { color: #6366f1; }
    code {
      background: #f1f5f9;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.85em;
      font-family: "SFMono-Regular", Consolas, monospace;
    }
    pre {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
    }
    pre code { background: none; padding: 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 0.9em;
    }
    th {
      background: #6366f1;
      color: #ffffff;
      padding: 10px 14px;
      text-align: left;
      font-weight: 600;
    }
    td { padding: 9px 14px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    ul, ol { padding-left: 20px; margin: 8px 0; }
    li { margin: 4px 0; }
    blockquote {
      border-left: 4px solid #6366f1;
      margin: 16px 0;
      padding: 8px 16px;
      background: #f5f3ff;
      color: #4c1d95;
      border-radius: 0 6px 6px 0;
    }
    strong { color: #0f172a; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }
    @media print {
      body { padding: 20px; }
      h1 { page-break-after: avoid; }
      h2 { page-break-after: avoid; }
      table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(assessment: Assessment, templateId: string) {
  const md = buildMarkdown(assessment, templateId);
  triggerDownload(new Blob([md], { type: "text/markdown" }), `${assessment.id}-${templateId}.md`);
}

export function downloadHtml(assessment: Assessment, templateId: string) {
  const tpl = exportTemplates.find((t) => t.id === templateId);
  const md = buildMarkdown(assessment, templateId);
  const html = markdownToHtml(md, tpl ? `${tpl.name} — ${assessment.name}` : assessment.name);
  triggerDownload(new Blob([html], { type: "text/html" }), `${assessment.id}-${templateId}.html`);
}

export async function downloadPdf(assessment: Assessment, templateId: string) {
  const tpl = exportTemplates.find((t) => t.id === templateId);
  const md = buildMarkdown(assessment, templateId);
  const html = markdownToHtml(md, tpl ? `${tpl.name} — ${assessment.name}` : assessment.name);

  // Render into a hidden iframe so existing page styles don't interfere
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:860px;height:1200px;border:none;";
  document.body.appendChild(iframe);

  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    iframe.srcdoc = html;
  });

  const canvas = await import("html2canvas").then((m) =>
    (m.default ?? m)(iframe.contentDocument!.body, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: 860,
    })
  );

  document.body.removeChild(iframe);

  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgW = canvas.width;
  const imgH = canvas.height;
  const ratio = pageW / imgW;
  const scaledH = imgH * ratio;
  const imgData = canvas.toDataURL("image/jpeg", 0.92);

  let yOffset = 0;
  while (yOffset < scaledH) {
    if (yOffset > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, -yOffset, pageW, scaledH);
    yOffset += pageH;
  }

  pdf.save(`${assessment.id}-${templateId}.pdf`);
}
