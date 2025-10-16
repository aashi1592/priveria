import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WizardStep1 } from "@/components/wizard/WizardStep1";
import { WizardStep2 } from "@/components/wizard/WizardStep2";
import { WizardStep3 } from "@/components/wizard/WizardStep3";
import { WizardStep4 } from "@/components/wizard/WizardStep4";
import { WizardStep5 } from "@/components/wizard/WizardStep5";
import { WizardStep6 } from "@/components/wizard/WizardStep6";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";

const baseSteps = [
  { id: 1, title: "Processing Overview", component: WizardStep1 },
  { id: 2, title: "Scope & Context", component: WizardStep2 },
  { id: 3, title: "Risk Assessment", component: WizardStep3 },
  { id: 4, title: "AI Assessment", component: WizardStep4 },
  { id: 5, title: "Safeguards & Review", component: WizardStep5 },
];

const linddunStep = { 
  id: 6, 
  title: "LINDDUN Threat Modeling", 
  component: WizardStep6 
};

const DPIAWizard = () => {
  const navigate = useNavigate();
  const { config } = useEnterpriseConfig();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  // Conditionally include LINDDUN step for product-type DPIAs
  const isProductDPIA = formData.processingType === "Product" || formData.processingType === "Application";
  const shouldShowLinddun = config.linddunEnabled && isProductDPIA;
  const steps = shouldShowLinddun ? [...baseSteps, linddunStep] : baseSteps;

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    toast.success("DPIA Assessment Created", {
      description: "Your assessment has been saved and submitted for review.",
    });
    navigate("/assessments");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="New DPIA Assessment"
        description="Complete all sections to create a comprehensive impact assessment"
      />

      <div className="px-6 py-8 max-w-5xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Step {currentStep} of {steps.length}
                  </p>
                  <h2 className="text-2xl font-bold text-foreground">
                    {steps[currentStep - 1].title}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{Math.round(progress)}%</p>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex gap-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex-1 h-1 rounded-full ${
                      step.id <= currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent data={formData} setData={setFormData} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Save className="w-4 h-4" />
              Save Draft
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-2 bg-gradient-to-r from-primary to-accent">
                Submit Assessment
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DPIAWizard;
