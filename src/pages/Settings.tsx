import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

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
