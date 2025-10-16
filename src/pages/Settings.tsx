import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { Save, Settings as SettingsIcon, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Settings = () => {
  const { config, updateConfig } = useEnterpriseConfig();
  const [formData, setFormData] = useState(config);

  const handleSave = () => {
    updateConfig(formData);
    toast.success("Settings saved successfully");
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
              <Shield className="w-5 h-5" />
              Privacy Threat Modeling
            </CardTitle>
            <CardDescription>
              Enable LINDDUN framework for systematic privacy threat analysis in product DPIAs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="linddun-toggle" className="text-base font-medium">
                  Enable LINDDUN Threat Modeling
                </Label>
                <p className="text-sm text-muted-foreground">
                  AI-assisted privacy threat detection for products and applications
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
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  <strong>LINDDUN enabled:</strong> Product-related DPIAs will include systematic 
                  privacy threat analysis across 7 categories (Linkability, Identifiability, 
                  Non-repudiation, Detectability, Disclosure, Unawareness, Non-compliance). 
                  This reduces threat modeling time from 8 hours to ~2 hours with AI assistance.
                </AlertDescription>
              </Alert>
            )}

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">What LINDDUN Provides:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Systematic privacy threat identification methodology</li>
                <li>✅ AI-accelerated threat detection and analysis</li>
                <li>✅ Comprehensive threat catalog with mitigation strategies</li>
                <li>✅ Privacy-by-design compliance (GDPR Art. 25)</li>
                <li>✅ Human-in-the-loop validation by Privacy Engineers and DPO</li>
              </ul>
            </div>

            <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 rounded-lg">
              <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-200 mb-2">
                Recommended For:
              </h4>
              <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                <li>• Consumer-facing applications (web, mobile, desktop)</li>
                <li>• SaaS products with user data</li>
                <li>• IoT devices and smart products</li>
                <li>• APIs processing personal data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setFormData(config)}>
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
