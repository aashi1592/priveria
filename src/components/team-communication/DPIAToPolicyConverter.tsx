import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Code, FileJson, Copy, CheckCircle, Loader2, Download, AlertCircle, Import } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAssessments, Assessment } from "@/contexts/AssessmentsContext";

type PolicyFormat = "rego" | "typescript" | "yaml" | "json";

const formatInfo: Record<PolicyFormat, { label: string; description: string; extension: string }> = {
  rego: { label: "Rego (OPA)", description: "Open Policy Agent format", extension: "rego" },
  typescript: { label: "TypeScript", description: "Type-safe validation functions", extension: "ts" },
  yaml: { label: "YAML", description: "Declarative policy rules", extension: "yaml" },
  json: { label: "JSON Schema", description: "JSON Schema validation rules", extension: "json" },
};

const sampleDPIA = {
  assessmentName: "Customer Data Analytics Platform",
  processingPurpose: "Analyze customer behavior for personalized recommendations",
  dataCategories: ["name", "email", "purchase_history", "browsing_behavior"],
  dataSubjects: ["customers", "website_visitors"],
  legalBasis: "consent",
  retentionPeriod: "24 months",
  riskLevel: "medium",
  crossBorderTransfers: ["US", "EU"],
  securityMeasures: ["encryption_at_rest", "access_controls", "audit_logging"],
  mitigations: [
    { risk: "unauthorized_access", measure: "role_based_access_control" },
    { risk: "data_breach", measure: "encryption_and_monitoring" }
  ]
};

const convertAssessmentToJson = (assessment: Assessment) => {
  return {
    assessmentId: assessment.id,
    assessmentName: assessment.name,
    processingType: assessment.category,
    riskLevel: assessment.riskLevel,
    riskScore: assessment.riskScore,
    status: assessment.status,
    tier: assessment.tier,
    owner: assessment.owner,
    dateCreated: assessment.date,
    nextReview: assessment.nextReview,
    ...assessment.details,
  };
};

export function DPIAToPolicyConverter() {
  const { assessments } = useAssessments();
  const [dpiaInput, setDpiaInput] = useState("");
  const [outputFormat, setOutputFormat] = useState<PolicyFormat>("rego");
  const [policyCode, setPolicyCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSampleDPIA = () => {
    setDpiaInput(JSON.stringify(sampleDPIA, null, 2));
    toast.success("Sample DPIA loaded");
  };

  const importAssessment = (assessmentId: string) => {
    const assessment = assessments.find((a) => a.id === assessmentId);
    if (assessment) {
      const json = convertAssessmentToJson(assessment);
      setDpiaInput(JSON.stringify(json, null, 2));
      toast.success(`Imported "${assessment.name}"`);
    }
  };

  const convertToPolicy = async () => {
    if (!dpiaInput.trim()) {
      toast.error("Please enter DPIA JSON");
      return;
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(dpiaInput);
    } catch {
      toast.error("Invalid JSON format");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPolicyCode("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("dpia-to-policy", {
        body: { dpiaJson: parsedJson, outputFormat },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setPolicyCode(data.policyCode);
      toast.success("Policy code generated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate policy";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(policyCode);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const downloadPolicy = () => {
    const blob = new Blob([policyCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dpia-policy.${formatInfo[outputFormat].extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Policy file downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              DPIA JSON Input
            </CardTitle>
            <CardDescription>
              Paste your DPIA assessment JSON or use the sample
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as PolicyFormat)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(formatInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col">
                        <span>{info.label}</span>
                        <span className="text-xs text-muted-foreground">{info.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select onValueChange={importAssessment}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Import Assessment" />
                </SelectTrigger>
                <SelectContent>
                  {assessments.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No assessments available
                    </SelectItem>
                  ) : (
                    assessments.map((assessment) => (
                      <SelectItem key={assessment.id} value={assessment.id}>
                        <div className="flex flex-col">
                          <span className="truncate max-w-[160px]">{assessment.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {assessment.id} • {assessment.riskLevel} risk
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={loadSampleDPIA}>
                Load Sample
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  if (!dpiaInput.trim()) {
                    toast.error("No DPIA JSON to export");
                    return;
                  }
                  try {
                    JSON.parse(dpiaInput);
                    const blob = new Blob([dpiaInput], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "dpia-export.json";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    toast.success("DPIA JSON exported");
                  } catch {
                    toast.error("Invalid JSON - please fix before exporting");
                  }
                }}
                disabled={!dpiaInput.trim()}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
            
            <Textarea
              placeholder='{"assessmentName": "...", "dataCategories": [...], ...}'
              value={dpiaInput}
              onChange={(e) => setDpiaInput(e.target.value)}
              className="font-mono text-sm min-h-[300px]"
            />
            
            <Button 
              onClick={convertToPolicy} 
              disabled={isLoading || !dpiaInput.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Policy...
                </>
              ) : (
                <>
                  <Code className="h-4 w-4 mr-2" />
                  Convert to Policy-as-Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Generated Policy Code
                </CardTitle>
                <CardDescription>
                  {policyCode ? (
                    <Badge variant="outline" className="mt-1">
                      {formatInfo[outputFormat].label}
                    </Badge>
                  ) : (
                    "Policy code will appear here"
                  )}
                </CardDescription>
              </div>
              {policyCode && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadPolicy}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            ) : policyCode ? (
              <pre className="p-4 rounded-lg bg-muted overflow-auto max-h-[400px] text-sm font-mono whitespace-pre-wrap">
                {policyCode}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <Code className="h-12 w-12 mb-4 opacity-50" />
                <p>Enter DPIA JSON and click convert</p>
                <p className="text-sm">to generate policy code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>What is Policy-as-Code?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Automated Compliance</h4>
              <p className="text-sm text-muted-foreground">
                Transform DPIA requirements into executable rules that automatically enforce data protection policies.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Version Control</h4>
              <p className="text-sm text-muted-foreground">
                Policy code can be tracked in Git, reviewed, and deployed through your standard CI/CD pipeline.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Audit Trail</h4>
              <p className="text-sm text-muted-foreground">
                Demonstrate compliance with auditable, documented policy enforcement integrated into your systems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
