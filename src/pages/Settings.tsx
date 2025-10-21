import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { Save, Settings as SettingsIcon, Shield, Sparkles, Link2, ExternalLink, Workflow, Brain, GitBranch, Users, Database, Lock, BarChart3, FileCode2, Activity, BookOpen, Globe } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface APIConnector {
  name: string;
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
  description?: string;
  additionalConfig?: {
    organizationId?: string;
    region?: string;
    syncInterval?: string;
  };
}

const Settings = () => {
  const { config, updateConfig } = useEnterpriseConfig();
  const [formData, setFormData] = useState(config);
  const [apiConnectors, setApiConnectors] = useState<APIConnector[]>([
    { 
      name: "OneTrust", 
      enabled: false, 
      apiKey: "", 
      baseUrl: "https://api.onetrust.com",
      description: "Privacy management platform with DPIA workflows, risk registers, and vendor management",
      additionalConfig: { organizationId: "", region: "us", syncInterval: "hourly" }
    },
    { 
      name: "ServiceNow", 
      enabled: false, 
      apiKey: "", 
      baseUrl: "https://instance.service-now.com",
      description: "IT service management and GRC platform for risk and compliance workflow automation",
      additionalConfig: { organizationId: "", region: "", syncInterval: "daily" }
    },
    { 
      name: "Centraleyes", 
      enabled: false, 
      apiKey: "", 
      baseUrl: "https://api.centraleyes.com",
      description: "Cyber risk quantification and compliance management platform",
      additionalConfig: { organizationId: "", region: "", syncInterval: "daily" }
    },
    { 
      name: "Jira", 
      enabled: false, 
      apiKey: "", 
      baseUrl: "https://api.atlassian.com",
      description: "Issue tracking and project management for DPIA workflow automation"
    },
    { 
      name: "Transcend", 
      enabled: false, 
      apiKey: "", 
      baseUrl: "https://api.transcend.io",
      description: "Data privacy infrastructure for consent, DSRs, and data mapping"
    },
    { 
      name: "TrustArc", 
      enabled: false, 
      apiKey: "", 
      baseUrl: "https://api.trustarc.com",
      description: "Privacy compliance and risk management platform"
    },
    { 
      name: "AuditBoard", 
      enabled: false, 
      apiKey: "", 
      baseUrl: "https://api.auditboard.com",
      description: "GRC platform for audit, risk, and compliance management"
    },
  ]);

  const handleSave = () => {
    updateConfig(formData);
    toast.success("Settings saved successfully", {
      description: "Your configuration has been updated.",
    });
  };

  const handleConnectorToggle = (index: number) => {
    const updated = [...apiConnectors];
    updated[index].enabled = !updated[index].enabled;
    setApiConnectors(updated);
  };

  const handleConnectorUpdate = (index: number, field: keyof APIConnector, value: string) => {
    const updated = [...apiConnectors];
    updated[index] = { ...updated[index], [field]: value };
    setApiConnectors(updated);
  };

  const testConnection = (connector: APIConnector) => {
    toast.success(`Testing ${connector.name} connection...`, {
      description: "This is a mock test. In production, this would validate the API credentials.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Enterprise Settings"
        description="Customize your DPIA framework configuration"
        action={{
          label: "Save Changes",
          onClick: handleSave,
          icon: <Save className="w-4 h-4" />,
        }}
      />

      <div className="px-6 py-8 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Organization Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="totalDPIAs">Total DPIAs</Label>
                <Input
                  id="totalDPIAs"
                  type="number"
                  value={formData.totalDPIAs}
                  onChange={(e) => setFormData({ ...formData, totalDPIAs: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Current number of active DPIA assessments
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="highRisk">High Risk DPIAs</Label>
                <Input
                  id="highRisk"
                  type="number"
                  value={formData.highRiskDPIAs}
                  onChange={(e) => setFormData({ ...formData, highRiskDPIAs: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Number of high-risk assessments requiring attention
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pending">Pending Reviews</Label>
                <Input
                  id="pending"
                  type="number"
                  value={formData.pendingReviews}
                  onChange={(e) => setFormData({ ...formData, pendingReviews: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Assessments awaiting review or approval
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="compliance">Compliance Rate (%)</Label>
                <Input
                  id="compliance"
                  type="number"
                  step="0.1"
                  value={formData.complianceRate}
                  onChange={(e) => setFormData({ ...formData, complianceRate: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Overall compliance rate across all frameworks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Privacy Threat Modeling
            </CardTitle>
            <CardDescription>
              Enable LINDDUN framework for systematic privacy threat analysis in Product and Vendor DPIAs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="linddun-toggle" className="text-base font-medium">
                  Enable LINDDUN Threat Modeling
                </Label>
                <p className="text-sm text-muted-foreground">
                  AI-assisted privacy threat detection for products, applications, and vendors
                </p>
              </div>
              <Switch
                id="linddun-toggle"
                checked={formData.linddunEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, linddunEnabled: checked })
                }
              />
            </div>

            {formData.linddunEnabled && (
              <Alert className="border-purple-500/50 bg-purple-500/5">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-900 dark:text-purple-100">
                  <strong>LINDDUN enabled:</strong> Product/Application and Vendor DPIAs will include systematic 
                  privacy threat analysis across 7 categories (Linkability, Identifiability, 
                  Non-repudiation, Detectability, Disclosure, Unawareness, Non-compliance). 
                  <br/><br/>
                  <strong>🎯 Risk Score Integration:</strong> Identified threats automatically enhance risk scores 
                  (Critical +8, High +4, Medium +2, Low +1 per threat) for comprehensive risk assessment.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">✨ Enhanced DPIA Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Systematic threat identification methodology</li>
                  <li>✅ AI-accelerated analysis (8 hrs → 2 hrs)</li>
                  <li>✅ Comprehensive threat catalog with mitigations</li>
                  <li>✅ Privacy-by-design compliance (GDPR Art. 25)</li>
                  <li>✅ Human validation by Privacy Engineers & DPO</li>
                  <li>✅ Automatic risk score enrichment</li>
                  <li>✅ Enhanced reporting with threat heat maps</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">📊 Dashboard Enhancements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Privacy threat metrics tracking</li>
                  <li>✅ LINDDUN-specific reporting</li>
                  <li>✅ Threat validation status monitoring</li>
                  <li>✅ Executive summary generation</li>
                  <li>✅ Residual risk tracking</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800 rounded-lg">
              <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-200 mb-2">
                📋 Applicable To:
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                  <li><strong>Products & Applications:</strong></li>
                  <li>• Consumer-facing web/mobile apps</li>
                  <li>• SaaS products with user data</li>
                  <li>• IoT devices and smart products</li>
                  <li>• APIs processing personal data</li>
                </ul>
                <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                  <li><strong>Vendor Assessments:</strong></li>
                  <li>• Third-party data processors</li>
                  <li>• Cloud service providers</li>
                  <li>• API integrations & data flows</li>
                  <li>• Sub-processor relationships</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              AI Intelligence Features
            </CardTitle>
            <CardDescription>
              Leverage AI to automate risk assessment, vendor selection, and compliance monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">AI-Powered Risk Scoring</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically calculate risk scores based on context, patterns, and historical data
                </p>
              </div>
              <Switch
                checked={formData.aiRiskScoringEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, aiRiskScoringEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Vendor Recommendations</Label>
                <p className="text-sm text-muted-foreground">
                  AI suggests optimal vendors for specific processing activities based on requirements
                </p>
              </div>
              <Switch
                checked={formData.aiVendorRecommendationsEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, aiVendorRecommendationsEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Document Analysis</Label>
                <p className="text-sm text-muted-foreground">
                  Extract structured data from contracts, DPAs, and security documentation
                </p>
              </div>
              <Switch
                checked={formData.aiDocumentAnalysisEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, aiDocumentAnalysisEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Real-Time Compliance Monitoring</Label>
                <p className="text-sm text-muted-foreground">
                  Continuously monitor compliance status and alert on gaps or violations
                </p>
              </div>
              <Switch
                checked={formData.aiComplianceMonitoringEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, aiComplianceMonitoringEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="space-y-1">
                <Label className="text-base font-medium">Natural Language Query Interface</Label>
                <p className="text-sm text-muted-foreground">
                  Ask questions about your privacy posture in plain English
                </p>
              </div>
              <Switch
                checked={formData.aiNaturalLanguageQueryEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, aiNaturalLanguageQueryEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Advanced Technical Features
            </CardTitle>
            <CardDescription>
              Enterprise-grade security, audit, and compliance infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">CI/CD Policy Enforcement</Label>
                <p className="text-sm text-muted-foreground">
                  Block deployments that lack valid approved DPIAs ("No DPIA, No Deploy")
                </p>
              </div>
              <Switch
                checked={formData.cicdPolicyEnforcementEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, cicdPolicyEnforcementEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Cryptographic Audit Trail</Label>
                <p className="text-sm text-muted-foreground">
                  Hash-chain integrity using Merkle trees for tamper-proof audit logs
                </p>
              </div>
              <Switch
                checked={formData.cryptographicAuditTrailEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, cryptographicAuditTrailEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Multi-GRC Synchronization</Label>
                <p className="text-sm text-muted-foreground">
                  Sync with multiple GRC platforms (OneTrust, ServiceNow, Archer, etc.)
                </p>
              </div>
              <Switch
                checked={formData.multiGrcSyncEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, multiGrcSyncEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Governance Telemetry Dashboard</Label>
                <p className="text-sm text-muted-foreground">
                  Real-time metrics on DPIA health, velocity, and compliance posture
                </p>
              </div>
              <Switch
                checked={formData.governanceTelemetryEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, governanceTelemetryEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="space-y-1">
                <Label className="text-base font-medium">W3C DPV Ontology</Label>
                <p className="text-sm text-muted-foreground">
                  Canonical privacy vocabulary for interoperability with external systems
                </p>
              </div>
              <Switch
                checked={formData.w3cDpvOntologyEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, w3cDpvOntologyEnabled: checked })
                }
              />
            </div>

            {formData.w3cDpvOntologyEnabled && (
              <Alert className="border-green-500/50 bg-green-500/5">
                <Globe className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900 dark:text-green-100">
                  <strong>W3C DPV 2.0 enabled:</strong> All privacy concepts now use standardized W3C vocabulary for legal interoperability.
                  <br/><br/>
                  <strong>Benefits:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Vendor-agnostic schema for GRC system integration</li>
                    <li>Regulator-friendly standard terminology (GDPR, CPRA aligned)</li>
                    <li>Machine-readable privacy policies and notices</li>
                    <li>Automated compliance reporting with canonical data types</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              Standards & Compliance Frameworks
            </CardTitle>
            <CardDescription>
              Adopt international standards for privacy and data protection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">W3C DPV 2.0</h4>
                        <p className="text-xs text-muted-foreground">Data Privacy Vocabulary</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Standardized vocabulary for personal data categories, processing purposes, legal bases, and technical measures
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className={`text-xs font-medium ${formData.w3cDpvOntologyEnabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {formData.w3cDpvOntologyEnabled ? '✓ Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">LINDDUN</h4>
                        <p className="text-xs text-muted-foreground">Privacy Threat Modeling</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Systematic privacy threat analysis framework (Linkability, Identifiability, Non-repudiation, Detectability, Disclosure, Unawareness, Non-compliance)
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className={`text-xs font-medium ${formData.linddunEnabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {formData.linddunEnabled ? '✓ Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Additional Frameworks Supported:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>• ISO/IEC 27001 (Information Security)</div>
                <div>• ISO/IEC 27701 (Privacy Management)</div>
                <div>• ISO/IEC 42001 (AI Management)</div>
                <div>• ISO/IEC 42005 (AI Impact Assessment)</div>
                <div>• NIST Privacy Framework</div>
                <div>• NIST AI Risk Management</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              Vendor Management
            </CardTitle>
            <CardDescription>
              Advanced vendor lifecycle management and infrastructure tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Dynamic Vendor Management</Label>
                <p className="text-sm text-muted-foreground">
                  Update, deprecate, or archive vendors with automatic change detection
                </p>
              </div>
              <Switch
                checked={formData.dynamicVendorManagementEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, dynamicVendorManagementEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Vendor Risk Heatmaps</Label>
                <p className="text-sm text-muted-foreground">
                  Visual risk overlays on data flow diagrams for vendor assessments
                </p>
              </div>
              <Switch
                checked={formData.vendorRiskHeatmapsEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, vendorRiskHeatmapsEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="space-y-1">
                <Label className="text-base font-medium">Cloud Infrastructure Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Track AWS, Azure, GCP assets and link to processing activities
                </p>
              </div>
              <Switch
                checked={formData.cloudInfraTrackingEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, cloudInfraTrackingEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Workflow & Automation Controls
            </CardTitle>
            <CardDescription>
              Human-in-the-loop controls and automated change detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Human-in-the-Loop Approvals</Label>
                <p className="text-sm text-muted-foreground">
                  Require human review and approval for all AI-generated recommendations
                </p>
              </div>
              <Switch
                checked={formData.humanInTheLoopEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, humanInTheLoopEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1">
                <Label className="text-base font-medium">Change Detection Automation</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically detect changes to processing activities and trigger workflows
                </p>
              </div>
              <Switch
                checked={formData.changeDetectionEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, changeDetectionEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="space-y-1">
                <Label className="text-base font-medium">Auto Data Flow Diagrams</Label>
                <p className="text-sm text-muted-foreground">
                  Generate data flow diagrams automatically from activity descriptions using AI
                </p>
              </div>
              <Switch
                checked={formData.autoDataFlowDiagramsEnabled}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, autoDataFlowDiagramsEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              <CardTitle>API Integrations</CardTitle>
            </div>
            <CardDescription>
              Connect with third-party privacy and compliance platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {apiConnectors.map((connector, index) => (
              <Card key={connector.name} className="border-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Workflow className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{connector.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {connector.enabled ? "Connected" : "Not connected"}
                          </p>
                          {connector.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {connector.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={connector.enabled}
                        onCheckedChange={() => handleConnectorToggle(index)}
                      />
                    </div>

                    {connector.enabled && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label htmlFor={`${connector.name}-baseUrl`}>Base URL</Label>
                          <Input
                            id={`${connector.name}-baseUrl`}
                            value={connector.baseUrl}
                            onChange={(e) => handleConnectorUpdate(index, "baseUrl", e.target.value)}
                            placeholder="https://api.example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${connector.name}-apiKey`}>API Key / Access Token</Label>
                          <Textarea
                            id={`${connector.name}-apiKey`}
                            value={connector.apiKey}
                            onChange={(e) => handleConnectorUpdate(index, "apiKey", e.target.value)}
                            placeholder="Enter your API key or token"
                            className="font-mono text-sm"
                            rows={3}
                          />
                        </div>
                        
                        {connector.name === "OneTrust" && connector.additionalConfig && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor={`${connector.name}-orgId`}>Organization ID</Label>
                              <Input
                                id={`${connector.name}-orgId`}
                                value={connector.additionalConfig.organizationId}
                                onChange={(e) => {
                                  const updated = [...apiConnectors];
                                  if (updated[index].additionalConfig) {
                                    updated[index].additionalConfig!.organizationId = e.target.value;
                                    setApiConnectors(updated);
                                  }
                                }}
                                placeholder="Your OneTrust Organization ID"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`${connector.name}-region`}>Region</Label>
                                <Input
                                  id={`${connector.name}-region`}
                                  value={connector.additionalConfig.region}
                                  onChange={(e) => {
                                    const updated = [...apiConnectors];
                                    if (updated[index].additionalConfig) {
                                      updated[index].additionalConfig!.region = e.target.value;
                                      setApiConnectors(updated);
                                    }
                                  }}
                                  placeholder="us, eu, ap"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`${connector.name}-sync`}>Sync Interval</Label>
                                <Input
                                  id={`${connector.name}-sync`}
                                  value={connector.additionalConfig.syncInterval}
                                  onChange={(e) => {
                                    const updated = [...apiConnectors];
                                    if (updated[index].additionalConfig) {
                                      updated[index].additionalConfig!.syncInterval = e.target.value;
                                      setApiConnectors(updated);
                                    }
                                  }}
                                  placeholder="hourly, daily"
                                />
                              </div>
                            </div>
                            <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                              <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                                <strong>OneTrust Integration:</strong> Syncs DPIA assessments, risk registers, vendor profiles, and custom workflows.
                              </AlertDescription>
                            </Alert>
                          </>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testConnection(connector)}
                            className="gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Test Connection
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              setFormData(config);
              setApiConnectors(apiConnectors.map(c => ({ ...c, enabled: false, apiKey: "" })));
            }}
          >
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
