import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const WizardStep5 = ({ data, setData }: any) => {
  const technicalMeasures = [
    "End-to-end encryption",
    "Data pseudonymization/anonymization",
    "Multi-factor authentication",
    "Access control & role-based permissions",
    "Audit logging & monitoring",
    "Regular security testing",
    "Data backup & disaster recovery",
    "Secure data disposal procedures",
  ];

  const organizationalMeasures = [
    "Privacy by design principles",
    "Staff training programs",
    "Data protection policies",
    "Vendor management procedures",
    "Incident response plan",
    "Regular privacy audits",
    "Data breach notification procedures",
    "Privacy impact assessments",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Technical Safeguards Implemented</Label>
        <div className="grid grid-cols-2 gap-3">
          {technicalMeasures.map((measure) => (
            <div key={measure} className="flex items-center space-x-2">
              <Checkbox id={measure} />
              <label
                htmlFor={measure}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {measure}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Organizational Safeguards Implemented</Label>
        <div className="grid grid-cols-2 gap-3">
          {organizationalMeasures.map((measure) => (
            <div key={measure} className="flex items-center space-x-2">
              <Checkbox id={measure} />
              <label
                htmlFor={measure}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {measure}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional-safeguards">Additional Safeguards</Label>
        <Textarea
          id="additional-safeguards"
          placeholder="Describe any additional technical or organizational measures implemented..."
          rows={3}
          defaultValue={data.additionalSafeguards}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="residual-risk">Residual Risk Assessment</Label>
        <Textarea
          id="residual-risk"
          placeholder="After implementing safeguards, describe the remaining risks and why they are acceptable..."
          rows={4}
          defaultValue={data.residualRisk}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-frequency">Review Frequency *</Label>
        <Select defaultValue={data.reviewFrequency}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly (Critical Risk)</SelectItem>
            <SelectItem value="quarterly">Quarterly (High Risk)</SelectItem>
            <SelectItem value="semi-annual">Semi-Annual (Medium Risk)</SelectItem>
            <SelectItem value="annual">Annual (Low Risk)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="monitoring-plan">Monitoring & Performance Indicators</Label>
        <Textarea
          id="monitoring-plan"
          placeholder="Describe KPIs, monitoring mechanisms, and success criteria..."
          rows={3}
          defaultValue={data.monitoringPlan}
        />
      </div>

      <div className="space-y-3">
        <Label>Consultation Requirements</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="dpa-consultation" />
            <label htmlFor="dpa-consultation" className="text-sm font-medium">
              Data Protection Authority (DPA) consultation required (GDPR Art. 36)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="data-subject-consultation" />
            <label htmlFor="data-subject-consultation" className="text-sm font-medium">
              Data subject consultation completed
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ethics-review" />
            <label htmlFor="ethics-review" className="text-sm font-medium">
              Ethics committee review (for AI systems)
            </label>
          </div>
        </div>
      </div>

      <div className="p-4 bg-muted rounded-lg space-y-2">
        <h4 className="font-semibold text-foreground">Final Checklist</h4>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">✓ All mandatory fields completed</p>
          <p className="text-muted-foreground">✓ Risk assessment validated</p>
          <p className="text-muted-foreground">✓ Safeguards documented</p>
          <p className="text-muted-foreground">✓ Review schedule established</p>
          <p className="text-muted-foreground">✓ Approval workflow initiated</p>
        </div>
      </div>
    </div>
  );
};
