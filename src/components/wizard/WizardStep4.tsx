import { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

const resetAIFields = {
  autonomy: undefined,
  explainability: undefined,
  trainingData: "",
  biasAnalysis: "",
  performanceMetrics: "",
  humanOversight: "",
};

export const WizardStep4 = ({ data, setData }: any) => {
  const aiInvolved = data.aiInvolved ?? false;
  const aiClassification = data.aiClassification ?? (aiInvolved ? "" : "not-applicable");
  const aiInputsDisabled = !aiInvolved || aiClassification === "not-applicable";
  const aiClassificationValue = aiClassification === "" ? undefined : aiClassification;

  const handleAIInvolvedChange = (checked: boolean | string) => {
    const isChecked = checked === true;
    if (isChecked) {
      setData({
        ...data,
        aiInvolved: true,
        aiClassification: data.aiClassification === "not-applicable" ? "" : data.aiClassification,
      });
    } else {
      setData({
        ...data,
        aiInvolved: false,
        aiClassification: "not-applicable",
        ...resetAIFields,
      });
    }
  };

  const handleClassificationChange = (value: string) => {
    if (value === "not-applicable") {
      setData({
        ...data,
        aiClassification: value,
        aiInvolved: false,
        ...resetAIFields,
      });
      return;
    }

    setData({
      ...data,
      aiClassification: value,
      aiInvolved: true,
    });
  };

  const handleSimpleSelectChange = (key: string) => (value: string) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleTextareaChange = (key: string) => (event: ChangeEvent<HTMLTextAreaElement>) => {
    setData({
      ...data,
      [key]: event.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-accent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">AI-Specific Assessment</h4>
              <p className="text-sm text-muted-foreground">
                Complete this section only if AI/ML automated decision-making is involved
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="ai-involved"
          checked={aiInvolved}
          onCheckedChange={handleAIInvolvedChange}
        />
        <label htmlFor="ai-involved" className="text-sm font-medium">
          This processing activity involves AI/ML or automated decision-making
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="eu-ai-classification">EU AI Act Classification *</Label>
        <Select
          value={aiClassificationValue}
          onValueChange={handleClassificationChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select classification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-applicable">
              Not Applicable
            </SelectItem>
            <SelectItem value="prohibited">
              Prohibited Practice
              <Badge variant="destructive" className="ml-2">Immediate Action</Badge>
            </SelectItem>
            <SelectItem value="high-risk">
              High-Risk AI System (Annex III)
            </SelectItem>
            <SelectItem value="limited-risk">
              Limited Risk (Transparency Required)
            </SelectItem>
            <SelectItem value="minimal-risk">
              Minimal Risk
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!aiInputsDisabled && (
        <p className="text-xs text-muted-foreground">
          Provide details for AI-specific controls. Selecting &ldquo;Not Applicable&rdquo; will skip this section.
        </p>
      )}
      {aiInputsDisabled && (
        <p className="text-xs text-muted-foreground italic">
          AI-specific questions are not required when the activity does not involve AI/ML or has been marked not applicable.
        </p>
      )}

      <div className={`grid grid-cols-2 gap-4 ${aiInputsDisabled ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="space-y-2">
          <Label htmlFor="autonomy">Autonomy Level</Label>
          <Select
            value={data.autonomy ?? undefined}
            onValueChange={handleSimpleSelectChange("autonomy")}
            disabled={aiInputsDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fully-automated">Fully Automated</SelectItem>
              <SelectItem value="human-review">Human Review Required</SelectItem>
              <SelectItem value="human-oversight">Continuous Human Oversight</SelectItem>
              <SelectItem value="human-decision">Human Final Decision</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="explainability">Explainability Score</Label>
          <Select
            value={data.explainability ?? undefined}
            onValueChange={handleSimpleSelectChange("explainability")}
            disabled={aiInputsDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Black Box (No explanation)</SelectItem>
              <SelectItem value="2">2 - Limited Explainability</SelectItem>
              <SelectItem value="3">3 - Moderate Explainability</SelectItem>
              <SelectItem value="4">4 - High Explainability</SelectItem>
              <SelectItem value="5">5 - Fully Transparent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="training-data">Training Data Provenance</Label>
        <Textarea
          id="training-data"
          placeholder="Describe the sources, quality, and characteristics of training data..."
          rows={3}
          value={data.trainingData || ""}
          onChange={handleTextareaChange("trainingData")}
          disabled={aiInputsDisabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bias-analysis">Bias & Fairness Analysis</Label>
        <Textarea
          id="bias-analysis"
          placeholder="Describe bias testing methodology, fairness metrics, and mitigation measures..."
          rows={4}
          value={data.biasAnalysis || ""}
          onChange={handleTextareaChange("biasAnalysis")}
          disabled={aiInputsDisabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="performance-metrics">Model Performance Metrics</Label>
        <Textarea
          id="performance-metrics"
          placeholder="List accuracy, precision, recall, F1 scores, and other relevant metrics..."
          rows={3}
          value={data.performanceMetrics || ""}
          onChange={handleTextareaChange("performanceMetrics")}
          disabled={aiInputsDisabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="human-oversight">Human Oversight Mechanisms</Label>
        <Textarea
          id="human-oversight"
          placeholder="Describe how humans can intervene, override decisions, or monitor system outputs..."
          rows={3}
          value={data.humanOversight || ""}
          onChange={handleTextareaChange("humanOversight")}
          disabled={aiInputsDisabled}
        />
      </div>

      <div className={`p-4 bg-muted rounded-lg space-y-2 ${aiInputsDisabled ? "opacity-50" : ""}`}>
        <h4 className="font-semibold text-foreground">ISO 42001 Requirements</h4>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">✓ AI system lifecycle management</p>
          <p className="text-muted-foreground">✓ Continuous monitoring and performance evaluation</p>
          <p className="text-muted-foreground">✓ Incident response procedures</p>
          <p className="text-muted-foreground">✓ Documentation and audit trail</p>
        </div>
      </div>
    </div>
  );
};
