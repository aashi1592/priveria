import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const WizardStep1 = ({ data, setData }: any) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="activity-name">Processing Activity Name *</Label>
        <Input
          id="activity-name"
          placeholder="e.g., AI-Powered Resume Screening System"
          defaultValue={data.activityName}
        />
      </div>

      <div className="space-y-2">
        <Label>DPIA Categories * (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-card">
          {[
            { value: "CAT-01", label: "CAT-01: AI/ML Processing" },
            { value: "CAT-02", label: "CAT-02: Biometric Data" },
            { value: "CAT-03", label: "CAT-03: Health & Medical" },
            { value: "CAT-04", label: "CAT-04: Systematic Monitoring" },
            { value: "CAT-05", label: "CAT-05: Children's Data" },
            { value: "CAT-06", label: "CAT-06: Employee Monitoring" },
            { value: "CAT-07", label: "CAT-07: Financial Data" },
            { value: "CAT-08", label: "CAT-08: Location Tracking" },
            { value: "CAT-09", label: "CAT-09: Employee Data" },
          ].map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={category.value}
                value={category.value}
                defaultChecked={data.categories?.includes(category.value)}
                onChange={(e) => {
                  const currentCategories = data.categories || [];
                  if (e.target.checked) {
                    setData({ ...data, categories: [...currentCategories, category.value] });
                  } else {
                    setData({ ...data, categories: currentCategories.filter((c: string) => c !== category.value) });
                  }
                }}
                className="rounded border-input"
              />
              <label htmlFor={category.value} className="text-sm cursor-pointer">
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="processing-type">Processing Type *</Label>
        <Select 
          defaultValue={data.processingType}
          onValueChange={(value) => setData({ ...data, processingType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Product">Product / Application</SelectItem>
            <SelectItem value="Service">Internal Service</SelectItem>
            <SelectItem value="Vendor">Vendor Integration</SelectItem>
            <SelectItem value="HR">HR System</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Product/Application types enable LINDDUN threat modeling if configured
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner">Data Owner *</Label>
          <Input id="owner" placeholder="Name of data owner" defaultValue={data.owner} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dpo">DPO Contact</Label>
          <Input id="dpo" placeholder="dpo@organization.com" defaultValue={data.dpo} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="business-justification">Business Justification *</Label>
        <Textarea
          id="business-justification"
          placeholder="Describe the business need and objectives for this processing activity..."
          rows={4}
          defaultValue={data.businessJustification}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="controller">Data Controller</Label>
        <Input id="controller" placeholder="Organization name" defaultValue={data.controller} />
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> All fields marked with * are required.
          This information will be used throughout the assessment process.
        </p>
      </div>
    </div>
  );
};
