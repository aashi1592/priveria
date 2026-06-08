import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, TrendingUp, BarChart3, Shield } from "lucide-react";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { ExportTemplatePicker } from "@/components/reports/ExportTemplatePicker";
import { ReportReviewPanel } from "@/components/reports/ReportReviewPanel";

const Reports = () => {
  const { config } = useEnterpriseConfig();
  
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
                <Button variant="outline" className="gap-2">
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
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
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
    </div>
  );
};

export default Reports;
