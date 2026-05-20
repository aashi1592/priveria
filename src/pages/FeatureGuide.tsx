import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Search, Sparkles, Shield, Brain, Target, FileText, ScanText, MessageSquareText,
  Users, Calculator, LayoutDashboard, FolderKanban, Settings, Download, ArrowRight,
  CheckCircle2, Layers, Workflow, GitBranch, FileSignature, Share2, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

type Category = "core" | "threat" | "ai" | "collab" | "integrations";

interface Feature {
  id: string;
  title: string;
  category: Category;
  status: "Available" | "New" | "Enterprise";
  icon: typeof Shield;
  route?: string;
  summary: string;
  highlights: string[];
  details: string;
}

const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "core", label: "Core DPIA" },
  { id: "threat", label: "Threat Modeling" },
  { id: "ai", label: "AI Intelligence" },
  { id: "collab", label: "Collaboration & Reports" },
  { id: "integrations", label: "Integrations" },
];

const features: Feature[] = [
  {
    id: "dashboard",
    title: "Executive Dashboard",
    category: "core",
    status: "Available",
    icon: LayoutDashboard,
    route: "/",
    summary: "Real-time DPIA portfolio, risk distribution and recent assessment activity.",
    highlights: ["KPI stats", "Risk overview", "Recent activity", "Framework coverage"],
    details: "Single-pane view of total DPIAs, high-risk count, pending reviews and trend-lines across compliance frameworks.",
  },
  {
    id: "assessments",
    title: "DPIA Assessments",
    category: "core",
    status: "Available",
    icon: FolderKanban,
    route: "/assessments",
    summary: "Catalogue of all assessments with risk tiers, owners and multi-category selection.",
    highlights: ["Risk tiering", "Multi-category", "Owner & status", "Search & filter"],
    details: "Browse and manage every DPIA. Tiered risk levels (Low/Medium/High/Critical) drive downstream automation.",
  },
  {
    id: "wizard",
    title: "Multi-Step DPIA Wizard",
    category: "core",
    status: "Available",
    icon: Workflow,
    route: "/assessments",
    summary: "Seven-step guided assessment: scope, subjects, legal basis, risk, safeguards, summary, MAESTRO.",
    highlights: ["7 guided steps", "LINDDUN inline", "MAESTRO step", "Auto risk calc"],
    details: "Structured authoring with jurisdiction-aware legal basis, automatic risk scoring and conditional MAESTRO step for product/application processing.",
  },
  {
    id: "risk-calculator",
    title: "Risk Calculator",
    category: "core",
    status: "Available",
    icon: Calculator,
    route: "/risk-calculator",
    summary: "Standalone likelihood × impact calculator with configurable weights.",
    highlights: ["Quick scoring", "Weight tuning", "Tier output"],
    details: "Run ad-hoc risk math without opening a full DPIA — useful for triage and pre-assessment sizing.",
  },
  {
    id: "linddun",
    title: "LINDDUN Privacy Threats",
    category: "threat",
    status: "Available",
    icon: Shield,
    route: "/assessments",
    summary: "Seven-category privacy threat lens (Linkability → Non-compliance) wired into risk scoring.",
    highlights: ["7 categories", "Per-threat scoring", "Product & vendor DPIAs"],
    details: "KU Leuven framework. Threats contribute +1/+2/+4/+8 to risk score for Low/Medium/High/Critical findings.",
  },
  {
    id: "maestro",
    title: "MAESTRO Agentic AI Threats",
    category: "threat",
    status: "Enterprise",
    icon: Brain,
    route: "/assessments",
    summary: "CSA framework for multi-agent, autonomy, environment, security, transparency, reliability, outcomes.",
    highlights: ["7 components", "Agentic-specific", "Auto step in wizard"],
    details: "Triggered on Product/Application processing type to assess autonomous AI agent risk surface.",
  },
  {
    id: "stride",
    title: "STRIDE (ML-adapted)",
    category: "threat",
    status: "New",
    icon: Target,
    route: "/threat-modeling",
    summary: "STRIDE re-framed for ML pipelines — spoofing, tampering, repudiation, disclosure, DoS, elevation.",
    highlights: ["ML pipeline lens", "Per-threat controls", "Attach to register"],
    details: "Complements LINDDUN (privacy) and MAESTRO (agentic). Select threats to build a per-assessment threat register.",
  },
  {
    id: "atlas",
    title: "MITRE ATLAS",
    category: "threat",
    status: "New",
    icon: Layers,
    route: "/threat-modeling",
    summary: "12 adversarial ML tactics with technique tags for model threat-surface analysis.",
    highlights: ["12 tactics", "Technique tags", "Attach to register"],
    details: "Adversarial ML knowledge base. Pair tactics with STRIDE/LINDDUN findings for a holistic threat picture.",
  },
  {
    id: "threat-register",
    title: "Threat Register & Stakeholder Share",
    category: "threat",
    status: "New",
    icon: Share2,
    route: "/threat-modeling",
    summary: "Per-assessment register; export to Markdown, CSV or JSON for cross-functional review.",
    highlights: ["Copy MD", "CSV / JSON", "Stakeholder template"],
    details: "Builds a shareable report section for Privacy, Security, Engineering and Legal ahead of sign-off.",
  },
  {
    id: "document-analysis",
    title: "Document Analysis",
    category: "ai",
    status: "New",
    icon: ScanText,
    route: "/document-analysis",
    summary: "AI entity extraction from compliance documents (up to 10MB) using Lovable AI.",
    highlights: ["Entity extraction", "PDF / DOCX", "10MB limit"],
    details: "Drop a privacy policy, DPA or vendor questionnaire and surface data categories, recipients, retention and legal basis automatically.",
  },
  {
    id: "ai-module",
    title: "AI Module",
    category: "ai",
    status: "Available",
    icon: Brain,
    route: "/ai-module",
    summary: "Centralised AI controls: risk scoring, vendor recommendations, compliance monitoring.",
    highlights: ["AI risk scoring", "Vendor match", "Live monitoring"],
    details: "Toggle and configure the AI features that power assessments across the platform.",
  },
  {
    id: "team-comms",
    title: "Team Communication",
    category: "collab",
    status: "Available",
    icon: MessageSquareText,
    route: "/team-communication",
    summary: "Translate privacy concepts for engineering, legal and exec audiences with exports.",
    highlights: ["Audience-aware", "DPIA → policy", "Exports"],
    details: "Bridge privacy jargon and product language with audience-specific phrasing and shareable artifacts.",
  },
  {
    id: "review-panel",
    title: "Human-in-the-Loop Review",
    category: "collab",
    status: "New",
    icon: FileSignature,
    route: "/reports",
    summary: "Collaboration checkpoint before policy-as-code: Privacy + 1 other role must sign off.",
    highlights: ["Sign-offs", "Inline comments", "Gating logic"],
    details: "Inserted on the Reports page to enforce a holistic review across Privacy, Security, Engineering and Legal.",
  },
  {
    id: "exports",
    title: "Export Templates",
    category: "collab",
    status: "New",
    icon: FileText,
    route: "/reports",
    summary: "EDPB Regulator view, EU AI Act conformity, Board brief, Internal technical, Threat register share.",
    highlights: ["EDPB WP248", "EU AI Act", "Board / Internal", "Stakeholder share"],
    details: "Five built-in templates render Markdown straight from assessment + threat register data. Preview and download.",
  },
  {
    id: "policy",
    title: "DPIA → Policy-as-Code",
    category: "collab",
    status: "Available",
    icon: GitBranch,
    route: "/team-communication",
    summary: "Converts DPIA JSON to Rego or TypeScript policy with assessment import.",
    highlights: ["Rego / TS", "Import assessments", "Edge function"],
    details: "Bridges governance and engineering by emitting runtime-enforceable policy from a finalised DPIA.",
  },
  {
    id: "third-party",
    title: "Third-Party Risk",
    category: "integrations",
    status: "Available",
    icon: Users,
    route: "/third-party",
    summary: "Vendor portfolio, certification tracking, DPA storage and risk scoring.",
    highlights: ["Vendor DPIA", "Cert tracking", "DPA versions"],
    details: "Monitor ISO 27001, SOC 2 and GDPR certifications with automated expiry alerts.",
  },
  {
    id: "multi-grc",
    title: "Multi-GRC Sync",
    category: "integrations",
    status: "Enterprise",
    icon: Building2,
    route: "/settings",
    summary: "API connectors for ServiceNow and Centraleyes with field validation.",
    highlights: ["ServiceNow", "Centraleyes", "Field mapping"],
    details: "Bidirectional sync of assessment metadata and risk scores into your existing GRC tooling.",
  },
  {
    id: "settings",
    title: "Enterprise Settings",
    category: "integrations",
    status: "Available",
    icon: Settings,
    route: "/settings",
    summary: "Feature flags, framework toggles, license validation and connector config.",
    highlights: ["Feature flags", "License", "Connectors"],
    details: "Tune the platform to your maturity level — enable LINDDUN, MAESTRO, AI and GRC connectors independently.",
  },
];

const statusVariant: Record<Feature["status"], "default" | "secondary" | "outline"> = {
  Available: "secondary",
  New: "default",
  Enterprise: "outline",
};

const FeatureGuide = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Category | "all">("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return features.filter((f) => {
      const matchTab = tab === "all" || f.category === tab;
      const matchQuery =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.summary.toLowerCase().includes(q) ||
        f.highlights.some((h) => h.toLowerCase().includes(q));
      return matchTab && matchQuery;
    });
  }, [query, tab]);

  const counts = useMemo(
    () => ({
      total: features.length,
      newCount: features.filter((f) => f.status === "New").length,
      enterprise: features.filter((f) => f.status === "Enterprise").length,
      categories: new Set(features.map((f) => f.category)).size,
    }),
    []
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const margin = 20;
    const w = doc.internal.pageSize.getWidth() - margin * 2;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Priveria — Feature Guide", margin, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${counts.total} features across ${counts.categories} categories`, margin, y);
    y += 10;

    features.forEach((f) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`${f.title}  [${f.status}]`, margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.splitTextToSize(f.summary, w).forEach((line: string) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, margin, y); y += 5;
      });
      f.highlights.forEach((h) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`  • ${h}`, margin, y); y += 5;
      });
      y += 4;
    });

    doc.save("priveria-feature-guide.pdf");
    toast.success("Feature guide downloaded");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Feature Guide"
        description="Every capability in Priveria — interactive, searchable, always up to date"
      />

      <div className="px-6 py-8 space-y-6">
        {/* Hero */}
        <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <CardContent className="p-8 animate-fade-in">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="space-y-3 max-w-2xl">
                <Badge variant="outline" className="gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Updated for the latest release
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight">
                  Explore Priveria end-to-end
                </h2>
                <p className="text-muted-foreground">
                  From DPIA authoring to threat modeling, regulator-ready exports and human-in-the-loop sign-off — search, filter and jump straight into any feature.
                </p>
              </div>
              <Button onClick={exportPDF} className="gap-2 hover-scale">
                <Download className="w-4 h-4" /> Export PDF
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {[
                { label: "Total features", value: counts.total },
                { label: "New this release", value: counts.newCount },
                { label: "Enterprise tier", value: counts.enterprise },
                { label: "Categories", value: counts.categories },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-background/60 backdrop-blur p-4">
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search + tabs */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search features, highlights or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as Category | "all")}>
            <TabsList className="flex-wrap h-auto">
              {categories.map((c) => (
                <TabsTrigger key={c.id} value={c.id} className="text-xs md:text-sm">
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Feature grid */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No features match "{query}".
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((f, idx) => {
              const Icon = f.icon;
              return (
                <Card
                  key={f.id}
                  className="group relative overflow-hidden border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${Math.min(idx * 40, 400)}ms` }}
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base leading-tight">{f.title}</CardTitle>
                          <CardDescription className="text-xs mt-0.5 capitalize">
                            {categories.find((c) => c.id === f.category)?.label}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={statusVariant[f.status]} className="shrink-0">
                        {f.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{f.summary}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {f.highlights.map((h) => (
                        <Badge key={h} variant="outline" className="text-xs font-normal">
                          {h}
                        </Badge>
                      ))}
                    </div>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="details" className="border-b-0">
                        <AccordionTrigger className="py-2 text-sm hover:no-underline">
                          How it works
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground space-y-2">
                          <p>{f.details}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-xs">Available in this workspace</span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {f.route && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between group/btn"
                      >
                        <NavLink to={f.route}>
                          Open feature
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </NavLink>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureGuide;
