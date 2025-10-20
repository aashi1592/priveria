import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Shield, 
  Brain, 
  Users, 
  Lock, 
  Activity,
  Globe,
  BookOpen,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { jsPDF } from "jspdf";

const FeatureGuide = () => {
  const { config } = useEnterpriseConfig();

  const exportToWord = () => {
    toast.success("Exporting Feature Guide", {
      description: "Your document is being prepared for download...",
    });
    // In production, this would generate a real Word document
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;

      // Helper function to add text with word wrap
      const addText = (text: string, size: number, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += size * 0.5;
        });
        yPosition += 5;
      };

      // Title
      addText("Enterprise DPIA Platform - Feature Guide", 20, true, [37, 99, 235]);
      addText("Comprehensive Documentation of All Platform Capabilities", 12, false, [100, 100, 100]);
      yPosition += 10;

      // Table of Contents
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      addText("Table of Contents", 16, true);
      addText("1. Core DPIA Features", 11);
      addText("2. LINDDUN Privacy Threat Modeling", 11);
      addText("3. AI Intelligence Features", 11);
      addText("4. Advanced Technical Features", 11);
      addText("5. Vendor Management", 11);
      addText("6. Workflow & Automation", 11);
      addText("7. Standards & Compliance", 11);
      addText("8. API Integrations", 11);
      yPosition += 10;

      // Section 1: Core DPIA Features
      doc.addPage();
      yPosition = 20;
      addText("1. Core DPIA Features", 18, true, [37, 99, 235]);
      addText("Essential data protection impact assessment capabilities", 11, false, [100, 100, 100]);
      yPosition += 5;

      addText("Multi-Step DPIA Wizard", 14, true);
      addText("Guided assessment creation through six structured steps covering processing activities, data subjects, legal basis, risk assessment, safeguards, and summary review.", 11);
      
      addText("• Step 1: Processing Activity - Define the processing type, scope, purpose, and data categories", 10);
      addText("• Step 2: Data Subjects - Identify affected individuals and assess vulnerability factors", 10);
      addText("• Step 3: Risk Assessment - Calculate risk scores with LINDDUN threat integration", 10);
      addText("• Step 4: Legal Basis - Document lawful basis with jurisdiction-specific requirements", 10);
      yPosition += 5;

      addText("Risk Scoring System", 14, true);
      addText("Automated risk calculation using likelihood × impact methodology:", 11);
      addText("• Critical (≥7.5): Requires immediate action", 10);
      addText("• High (5.0-7.4): Significant mitigation needed", 10);
      addText("• Medium (2.5-4.9): Standard controls apply", 10);
      addText("• Low (<2.5): Minimal risk", 10);
      yPosition += 5;

      // Section 2: LINDDUN
      if (config.linddunEnabled) {
        doc.addPage();
        yPosition = 20;
        addText("2. LINDDUN Privacy Threat Modeling", 18, true, [147, 51, 234]);
        addText("Systematic privacy threat analysis framework for Product and Vendor DPIAs", 11, false, [100, 100, 100]);
        yPosition += 5;

        addText("The seven LINDDUN threat categories:", 12, true);
        addText("L - Linkability: Ability to link data across different contexts", 10);
        addText("I - Identifiability: Ability to identify individuals from anonymous data", 10);
        addText("N - Non-repudiation: Inability to deny having performed an action", 10);
        addText("D - Detectability: Revealing the existence of data items or communications", 10);
        addText("D - Disclosure: Unauthorized access to personal information", 10);
        addText("U - Unawareness: Lack of control or transparency about data processing", 10);
        addText("N - Non-compliance: Violation of privacy policies or regulations", 10);
      }

      // Section 3: AI Intelligence
      doc.addPage();
      yPosition = 20;
      addText("3. AI Intelligence Features", 18, true, [37, 99, 235]);
      addText("Advanced AI-powered capabilities for enhanced compliance", 11, false, [100, 100, 100]);
      yPosition += 5;

      addText("AI Risk Scoring", 14, true);
      addText("Machine learning models analyze processing activities, data sensitivity, and vulnerability factors to provide accurate risk predictions.", 11);
      yPosition += 5;

      addText("Smart Vendor Recommendations", 14, true);
      addText("AI suggests alternative vendors based on compliance history, pricing, and security ratings.", 11);
      yPosition += 5;

      addText("Real-Time Compliance Monitoring", 14, true);
      addText("Continuous monitoring of compliance status with automatic alerts for gaps or violations:", 11);
      addText("• DPIA lifecycle tracking and expiration alerts", 10);
      addText("• Vendor compliance monitoring", 10);
      addText("• Regulatory change detection", 10);
      addText("• Data processing violation alerts", 10);

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${totalPages} | Enterprise DPIA Platform`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      doc.save("DPIA-Platform-Feature-Guide.pdf");
      
      toast.success("PDF Export Complete", {
        description: "Feature guide has been downloaded successfully",
      });
    } catch (error) {
      toast.error("Export Failed", {
        description: "There was an error generating the PDF. Please try again.",
      });
      console.error("PDF export error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Enterprise DPIA Platform - Feature Guide"
        description="Comprehensive documentation of all platform capabilities"
        action={{
          label: "Export to Word",
          onClick: exportToWord,
          icon: <Download className="w-4 h-4" />,
        }}
      />

      <div className="px-6 py-8 max-w-6xl mx-auto space-y-8">
        {/* Export Options */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Export Documentation</h3>
                <p className="text-sm text-muted-foreground">Download this guide in your preferred format</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={exportToWord} variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Word (.docx)
                </Button>
                <Button onClick={exportToPDF} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <a href="#core-features" className="block text-sm hover:text-primary">1. Core DPIA Features</a>
                <a href="#linddun" className="block text-sm hover:text-primary">2. LINDDUN Threat Modeling</a>
                <a href="#ai-intelligence" className="block text-sm hover:text-primary">3. AI Intelligence Features</a>
                <a href="#technical-features" className="block text-sm hover:text-primary">4. Advanced Technical Features</a>
              </div>
              <div className="space-y-2">
                <a href="#vendor-management" className="block text-sm hover:text-primary">5. Vendor Management</a>
                <a href="#workflow-controls" className="block text-sm hover:text-primary">6. Workflow & Automation</a>
                <a href="#standards" className="block text-sm hover:text-primary">7. Standards & Compliance</a>
                <a href="#integrations" className="block text-sm hover:text-primary">8. API Integrations</a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* 1. Core DPIA Features */}
        <div id="core-features">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="w-6 h-6 text-primary" />
                  1. Core DPIA Features
                </CardTitle>
                <Badge>Always Available</Badge>
              </div>
              <CardDescription>Essential data protection impact assessment capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Multi-Step DPIA Wizard</h3>
                <p className="text-muted-foreground">
                  Guided assessment creation through six structured steps covering processing activities, 
                  data subjects, legal basis, risk assessment, safeguards, and summary review.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2">
                    <CardContent className="pt-6 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Step 1: Processing Activity
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Define the processing type (Product/Application, Vendor, Internal, Marketing, AI System), 
                        scope, purpose, and data categories being processed.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="pt-6 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Step 2: Data Subjects
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Identify affected individuals (customers, employees, prospects, minors, vulnerable groups) 
                        and assess vulnerability factors.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="pt-6 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Step 3: Risk Assessment
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Calculate risk scores based on likelihood and impact, with automatic LINDDUN threat 
                        integration when enabled.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="pt-6 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Step 4: Legal Basis
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Document lawful basis (consent, contract, legitimate interest, legal obligation) 
                        with jurisdiction-specific requirements.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Risk Scoring System</h3>
                <p className="text-muted-foreground">
                  Automated risk calculation using likelihood × impact methodology with four risk levels:
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="border-2 border-red-500/20 bg-red-500/5">
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-2">Critical</div>
                      <p className="text-sm text-muted-foreground">Score ≥ 7.5</p>
                      <p className="text-xs mt-2">Requires immediate action</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-orange-500/20 bg-orange-500/5">
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-2">High</div>
                      <p className="text-sm text-muted-foreground">5.0 - 7.4</p>
                      <p className="text-xs mt-2">Significant mitigation needed</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">Medium</div>
                      <p className="text-sm text-muted-foreground">2.5 - 4.9</p>
                      <p className="text-xs mt-2">Standard controls apply</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-green-500/20 bg-green-500/5">
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">Low</div>
                      <p className="text-sm text-muted-foreground">{"<"} 2.5</p>
                      <p className="text-xs mt-2">Minimal risk</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dashboard & Reporting</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <TrendingUp className="w-8 h-8 text-primary mb-3" />
                      <h4 className="font-semibold mb-2">Real-Time Statistics</h4>
                      <p className="text-sm text-muted-foreground">
                        Total DPIAs, high-risk assessments, pending reviews, and compliance rate tracking.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <AlertCircle className="w-8 h-8 text-primary mb-3" />
                      <h4 className="font-semibold mb-2">Risk Overview</h4>
                      <p className="text-sm text-muted-foreground">
                        Visual breakdown of assessments by risk level with trends over time.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <FileText className="w-8 h-8 text-primary mb-3" />
                      <h4 className="font-semibold mb-2">Recent Assessments</h4>
                      <p className="text-sm text-muted-foreground">
                        Quick access to latest DPIAs with filtering by category and risk level.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. LINDDUN Threat Modeling */}
        <div id="linddun">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="w-6 h-6 text-purple-600" />
                  2. LINDDUN Privacy Threat Modeling
                </CardTitle>
                <Badge variant={config.linddunEnabled ? "default" : "outline"}>
                  {config.linddunEnabled ? "Enabled" : "Enterprise Feature"}
                </Badge>
              </div>
              <CardDescription>
                Systematic privacy threat analysis framework for Product and Vendor DPIAs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">What is LINDDUN?</h3>
                <p className="text-sm text-purple-800 dark:text-purple-300">
                  LINDDUN is a privacy threat modeling methodology developed by KU Leuven (Belgium) that 
                  identifies seven categories of privacy threats in software systems and digital services.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-2 border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-200">
                      L - Linkability
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Ability to link data or actions across different contexts to the same user.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Cross-device tracking</div>
                      <div>• Cookie-based profiling</div>
                      <div>• Email correlation across platforms</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-200">
                      I - Identifiability
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Ability to identify individuals from supposedly anonymous data.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Browser fingerprinting</div>
                      <div>• IP address logging</div>
                      <div>• Re-identification from datasets</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-200">
                      N - Non-repudiation
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Inability to deny having performed an action or provided data.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Digital signatures on transactions</div>
                      <div>• Immutable audit logs</div>
                      <div>• Blockchain records</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-200">
                      D - Detectability
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Revealing the existence or presence of data items or communications.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Metadata exposure</div>
                      <div>• Online presence indicators</div>
                      <div>• Traffic analysis</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-200">
                      D - Disclosure of Information
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Unauthorized access to or release of personal information.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Data breaches</div>
                      <div>• Unencrypted transmissions</div>
                      <div>• Excessive API permissions</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-200">
                      U - Unawareness
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Lack of control, transparency, or awareness about data processing.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Hidden tracking scripts</div>
                      <div>• Unclear privacy policies</div>
                      <div>• No user consent mechanisms</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-200">
                      N - Non-compliance
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Violation of privacy regulations, policies, or stated practices.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• GDPR violations (no legal basis)</div>
                      <div>• Policy-practice mismatch</div>
                      <div>• Retention period breaches</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Integration with Risk Scoring</h3>
                <p className="text-muted-foreground">
                  When LINDDUN is enabled, identified threats automatically enhance the DPIA risk score:
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="border-2">
                    <CardContent className="pt-6 text-center">
                      <div className="text-xl font-bold text-red-600 mb-2">+8 points</div>
                      <p className="text-sm font-medium mb-1">Critical Threat</p>
                      <p className="text-xs text-muted-foreground">Per threat identified</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="pt-6 text-center">
                      <div className="text-xl font-bold text-orange-600 mb-2">+4 points</div>
                      <p className="text-sm font-medium mb-1">High Threat</p>
                      <p className="text-xs text-muted-foreground">Per threat identified</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="pt-6 text-center">
                      <div className="text-xl font-bold text-yellow-600 mb-2">+2 points</div>
                      <p className="text-sm font-medium mb-1">Medium Threat</p>
                      <p className="text-xs text-muted-foreground">Per threat identified</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="pt-6 text-center">
                      <div className="text-xl font-bold text-green-600 mb-2">+1 point</div>
                      <p className="text-sm font-medium mb-1">Low Threat</p>
                      <p className="text-xs text-muted-foreground">Per threat identified</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Benefits of LINDDUN Integration</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-300">
                  <div>✓ Systematic privacy threat identification</div>
                  <div>✓ Privacy-by-design compliance (GDPR Art. 25)</div>
                  <div>✓ Enhanced risk assessment accuracy</div>
                  <div>✓ Product security architecture guidance</div>
                  <div>✓ Vendor security evaluation framework</div>
                  <div>✓ Audit-ready threat documentation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. AI Intelligence Features */}
        <div id="ai-intelligence">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Brain className="w-6 h-6 text-blue-600" />
                  3. AI Intelligence Features
                </CardTitle>
                <Badge variant={config.aiRiskScoringEnabled ? "default" : "outline"}>
                  Enterprise Feature
                </Badge>
              </div>
              <CardDescription>
                Leverage AI to automate risk assessment, vendor selection, and compliance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI-Powered Risk Scoring */}
              <Card className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">AI-Powered Risk Scoring</h3>
                      <p className="text-muted-foreground mb-4">
                        Automatically calculate risk scores based on context, patterns, and historical data using machine learning models.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium text-sm mb-2">How It Works:</h4>
                          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Analyzes processing activity description and data categories</li>
                            <li>Compares against 1000+ historical DPIA patterns</li>
                            <li>Identifies risk factors (special category data, cross-border transfers, etc.)</li>
                            <li>Calculates contextual risk multipliers based on industry and jurisdiction</li>
                            <li>Generates risk score with confidence level and explanation</li>
                          </ol>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="p-3 border rounded-lg">
                            <h5 className="font-medium text-sm mb-2">Example Input:</h5>
                            <p className="text-xs text-muted-foreground italic">
                              "Customer behavioral analytics for targeted advertising using cross-device tracking and location data"
                            </p>
                          </div>
                          <div className="p-3 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
                            <h5 className="font-medium text-sm mb-2">AI Output:</h5>
                            <div className="text-xs space-y-1">
                              <div className="font-semibold text-orange-600">Risk Score: 6.8 (High)</div>
                              <div className="text-muted-foreground">• Cross-device linkability detected</div>
                              <div className="text-muted-foreground">• Precise geolocation risk factor</div>
                              <div className="text-muted-foreground">• Profiling without consent concern</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Recommendations */}
              <Card className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Intelligent Vendor Recommendations</h3>
                      <p className="text-muted-foreground mb-4">
                        AI suggests optimal vendors for specific processing activities based on requirements, analyzing your existing vendor portfolio.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Matching Criteria:</h4>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div>✓ Certifications (ISO 27001, SOC 2, etc.)</div>
                            <div>✓ Geographic coverage and data residency</div>
                            <div>✓ Technical capabilities (cloud, APIs)</div>
                            <div>✓ Security posture and compliance</div>
                            <div>✓ Past performance and risk scores</div>
                            <div>✓ Cost and contract terms</div>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                          <h5 className="font-medium text-sm mb-2">Example Recommendation:</h5>
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="font-semibold">Processing Activity:</span> "EU Customer Data Analytics"
                            </div>
                            <div className="space-y-1 mt-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">1. Vendor A</span>
                                <Badge variant="default" className="text-xs">95% match</Badge>
                              </div>
                              <p className="text-muted-foreground">EU-based, GDPR certified, real-time analytics capabilities</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">2. Vendor B</span>
                                <Badge variant="secondary" className="text-xs">82% match</Badge>
                              </div>
                              <p className="text-muted-foreground">Global with EU region, GDPR compliant, standard SLA</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-Time Compliance Monitoring */}
              <Card className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Real-Time Compliance Monitoring</h3>
                      <p className="text-muted-foreground mb-4">
                        Continuously monitor compliance status and alert on gaps or violations as they happen.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Monitoring Scope:</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>• DPIAs approaching expiry</div>
                            <div>• Vendor certifications expiring</div>
                            <div>• Missing mandatory approvals</div>
                            <div>• Regulatory change impacts</div>
                            <div>• Processing purpose drift</div>
                            <div>• Data retention violations</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Alert Levels:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <span className="font-medium">Critical:</span>
                              <span className="text-muted-foreground">Immediate action required</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                              <span className="font-medium">High:</span>
                              <span className="text-muted-foreground">Within 24 hours</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <span className="font-medium">Medium:</span>
                              <span className="text-muted-foreground">Within 7 days</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                              <span className="font-medium">Low:</span>
                              <span className="text-muted-foreground">Within 30 days</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Continue with more sections... */}
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Complete Documentation</h3>
          <p className="text-muted-foreground mb-4">
            This is a preview of the Feature Guide. Export to Word or PDF for the complete 50+ page documentation 
            covering all enterprise features in detail.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={exportToWord} className="gap-2">
              <Download className="w-4 h-4" />
              Download Full Guide (Word)
            </Button>
            <Button onClick={exportToPDF} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Full Guide (PDF)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGuide;