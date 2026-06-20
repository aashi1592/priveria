import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { WizardStepProps } from "@/types/wizard";

export const WizardStep2 = ({ data, setData }: WizardStepProps) => {
  const dataCategories = [
    "Personal Identifiers (name, email, etc.)",
    "Financial Information",
    "Health Data",
    "Biometric Data",
    "Location Data",
    "Behavioral Data",
    "Children's Data",
    "Special Category Data (GDPR Art. 9)",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Data Categories Processed *</Label>
        <div className="grid grid-cols-2 gap-3">
          {dataCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} />
              <label
                htmlFor={category}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="legal-basis">Legal Basis (GDPR Art. 6) *</Label>
        <Select defaultValue={data.legalBasis}>
          <SelectTrigger>
            <SelectValue placeholder="Select legal basis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consent">Consent</SelectItem>
            <SelectItem value="contract">Contract Performance</SelectItem>
            <SelectItem value="legal-obligation">Legal Obligation</SelectItem>
            <SelectItem value="vital-interests">Vital Interests</SelectItem>
            <SelectItem value="public-task">Public Task</SelectItem>
            <SelectItem value="legitimate-interest">Legitimate Interests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Processing Purpose *</Label>
        <Textarea
          id="purpose"
          placeholder="Describe the primary purpose of data processing..."
          rows={4}
          defaultValue={data.purpose}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data-subjects">Data Subjects</Label>
        <Textarea
          id="data-subjects"
          placeholder="Describe the categories of data subjects (e.g., employees, customers, children)..."
          rows={3}
          defaultValue={data.dataSubjects}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="volume">Estimated Volume</Label>
          <Select defaultValue={data.volume}>
            <SelectTrigger>
              <SelectValue placeholder="Select volume" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<100">&lt;100 subjects</SelectItem>
              <SelectItem value="100-1000">100-1,000 subjects</SelectItem>
              <SelectItem value="1000-10000">1,000-10,000 subjects</SelectItem>
              <SelectItem value="10000-100000">10,000-100,000 subjects</SelectItem>
              <SelectItem value="100000+">100,000+ subjects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="retention">Data Retention Period</Label>
          <Select defaultValue={data.retention}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<1year">&lt;1 year</SelectItem>
              <SelectItem value="1-3years">1-3 years</SelectItem>
              <SelectItem value="3-7years">3-7 years</SelectItem>
              <SelectItem value="7+years">7+ years</SelectItem>
              <SelectItem value="indefinite">Indefinite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipients">Data Recipients & Third Parties</Label>
        <Textarea
          id="recipients"
          placeholder="List internal departments and external third parties who will access the data..."
          rows={3}
          defaultValue={data.recipients}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="cross-border" />
        <label htmlFor="cross-border" className="text-sm font-medium">
          Cross-border data transfers involved
        </label>
      </div>
    </div>
  );
};
