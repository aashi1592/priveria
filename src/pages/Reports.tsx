import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText, TrendingUp, BarChart3, Shield } from "lucide-react";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { useAssessments } from "@/contexts/AssessmentsContext";
import { exportTemplates } from "@/lib/exportTemplates";
import { ExportTemplatePicker } from "@/components/reports/ExportTemplatePicker";
import { ReportReviewPanel } from "@/components/reports/ReportReviewPanel";
import { toast } from "sonner";

// Map report names to the export template most appropriate for that audience
const REPORT_TEMPLATE_MAP: Record<string, string> = {
  "Executive DPIA Summary": "board-brief",
  "Compliance Framework Report": "edpb-regulator",
  "AI System Audit Trail": "eu-ai-act-conformity",
  "Third-Party Risk Assessment": "internal-technical",
  "Risk Trend Analysis": "internal-technical",
  "DPA Consultation Readiness": "edpb-regulator",
  "LINDDUN Privacy Threat Analysis": "threat-register-share",
};

const Reports = () => {
  const { config } = useEnterpriseConfig();
  const { assessments } = useAssessments();
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  
  const baseReports = [
    {
      name: "Executive DPIA Summary",
      description: "Board-ready overview of all high-risk assessments",
      frequency: "Monthly",
      lastGenerated: "2025-01-15",
      status: "Available",
    },
    {
      name: "Compliance Framework Report",
      description: "Multi-framework compliance status (GDPR, CPRA, EU AI Act, ISOs)",
      frequency: "Quarterly",
      lastGenerated: "2025-01-01",
      status: "Available",
    },
    {
      name: "AI System Audit Trail",
      description: "Complete documentation of AI/ML assessment history",
      frequency: "On-Demand",
      lastGenerated: "2025-01-10",
      status: "Available",
    },
    {
      name: "Third-Party Risk Assessment",
      description: "Vendor compliance scores and risk distribution",
      frequency: "Quarterly",
      lastGenerated: "2025-01-05",
      status: "Available",
    },
    {
      name: "Risk Trend Analysis",
      description: "Historical risk scoring trends and patterns",
      frequency: "Monthly",
      lastGenerated: "2025-01-14",
      status: "Available",
    },
    {
      name: "DPA Consultation Readiness",
      description: "Documentation package for regulatory consultations",
      frequency: "On-Demand",
      lastGenerated: "2024-12-20",
      status: "Available",
    },
  ];

  // Add LINDDUN report when enabled
  const linddunReports = config.linddunEnabled ? [
    {
      name: "LINDDUN Privacy Threat Analysis",
      description: "Comprehensive privacy threat modeling report with validated threats and mitigation status",
      frequency: "Per-DPIA",
      lastGenerated: "2025-01-16",
      status: "Available",
    },
  ] : [];

  const reports = [...baseReports, ...linddunReports];

  const buildReportContent = (reportName: string): string => {
    const templateId = REPORT_TEMPLATE_MAP[reportName] ?? "board-brief";
    const tpl = exportTemplates.find((t) => t.id === templateId);
    if (!tpl || assessments.length === 0) {
      return `# ${reportName}\n\nNo assessment data available.\n`;
    }
    // Use the most recent (first) assessment as the representative context
    const assessment = assessments[0];
    try {
      const threats = JSON.parse(localStorage.getItem(`priveria.threatRegister.${assessment.id}`) ?? "[]");
      return tpl.render({ assessment, threats });
    } catch {
      return tpl.render({ assessment, threats: [] });
    }
  };

  const handleView = (reportName: string) => {
    setPreviewTitle(reportName);
    setPreviewContent(buildReportContent(reportName));
  };

  const handleDownload = (reportName: string) => {
    const content = buildReportContent(reportName);
    const slug = reportName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${reportName}`);
  };

  const handleBulkExport = () => {
    if (assessments.length === 0) {
      toast.error("No assessments available to export");
      return;
    }
    const lines: string[] = [];
    reports.forEach((report) => {
      lines.push(buildReportContent(report.name));
      lines.push("\n\n---\n\n");
    });
    const blob = new Blob([lines.join("")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-reports-bulk.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${reports.length} reports`);
  };

  const baseMetrics = [
    { label: "Reports Generated", value: "247", icon: FileText },
    { label: "Avg Compliance", value: "93.2%", icon: TrendingUp },
    { label: "Active Dashboards", value: "12", icon: BarChart3 },
  ];

  const linddunMetrics = config.linddunEnabled ? [
    { label: "Privacy Threats Identified", value: "127", icon: Shield },
  ] : [];

  const metrics = [...baseMetrics, ...linddunMetrics];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Reports & Analytics"
        description="Compliance reporting and data visualization"
      />

      <div className="px-6 py-8 space-y-6">
        <div className={`grid grid-cols-1 ${config.linddunEnabled ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6`}>
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{metric.value}</p>
                    </div>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Available Reports</CardTitle>
              <div className="flex gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2" onClick={handleBulkExport}>
                  <Download className="w-4 h-4" />
                  Bulk Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {report.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Frequency: </span>
                            <Badge variant="outline">{report.frequency}</Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Generated: </span>
                            <span className="font-medium text-foreground">
                              {new Date(report.lastGenerated).toLocaleDateString()}
                            </span>
                          </div>
                          <Badge variant="secondary">{report.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleView(report.name)}>
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownload(report.name)}>
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <ExportTemplatePicker />

        <ReportReviewPanel />

        <Card>
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dpia">DPIA Summary</SelectItem>
                    <SelectItem value="compliance">Compliance Status</SelectItem>
                    <SelectItem value="risk">Risk Analysis</SelectItem>
                    <SelectItem value="ai">AI Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button>Generate Report</Button>
              <Button variant="outline">Save Template</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={previewContent !== null} onOpenChange={(o) => !o && setPreviewContent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewTitle}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] rounded-md border border-border p-4 bg-muted/30">
            <pre className="text-xs whitespace-pre-wrap font-mono">{previewContent ?? ""}</pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
