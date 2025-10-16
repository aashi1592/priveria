import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { Save, Settings as SettingsIcon, Shield, Sparkles, Link2, ExternalLink, Workflow } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface APIConnector {
  name: string;
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
}

const Settings = () => {
  const { config, updateConfig } = useEnterpriseConfig();
  const [formData, setFormData] = useState(config);
  const [apiConnectors, setApiConnectors] = useState<APIConnector[]>([
    { name: "OneTrust", enabled: false, apiKey: "", baseUrl: "https://api.onetrust.com" },
    { name: "Jira", enabled: false, apiKey: "", baseUrl: "https://api.atlassian.com" },
    { name: "Transcend", enabled: false, apiKey: "", baseUrl: "https://api.transcend.io" },
    { name: "TrustArc", enabled: false, apiKey: "", baseUrl: "https://api.trustarc.com" },
    { name: "AuditBoard", enabled: false, apiKey: "", baseUrl: "https://api.auditboard.com" },
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
                          <p className="text-sm text-muted-foreground">
                            {connector.enabled ? "Connected" : "Not connected"}
                          </p>
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
                          <Label htmlFor={`${connector.name}-apiKey`}>API Key</Label>
                          <Textarea
                            id={`${connector.name}-apiKey`}
                            value={connector.apiKey}
                            onChange={(e) => handleConnectorUpdate(index, "apiKey", e.target.value)}
                            placeholder="Enter your API key or token"
                            className="font-mono text-sm"
                          />
                        </div>
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
