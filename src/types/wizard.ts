export interface LinddunThreat {
  id: number;
  category: string;
  name: string;
  description: string;
  scenario: string;
  likelihood: string;
  impact: string;
  riskLevel: string;
  /**
   * Rule-match confidence (0–100) from the deterministic LINDDUN/MAESTRO rule
   * engine — NOT an AI/model output. Reflects how strongly the wizard inputs
   * matched the rule that produced this threat.
   */
  ruleConfidence: number;
  validated: boolean;
  affectedData: string[];
  mitigations: string[];
}

export interface MaestroThreat {
  id: number;
  category: string;
  name: string;
  description: string;
  scenario: string;
  likelihood: number;
  impact: number;
  riskLevel: string;
  /**
   * Rule-match confidence (0–100) from the deterministic LINDDUN/MAESTRO rule
   * engine — NOT an AI/model output. Reflects how strongly the wizard inputs
   * matched the rule that produced this threat.
   */
  ruleConfidence: number;
  validated: boolean;
  affectedSystems: string[];
  mitigations: string[];
}

export interface WizardFormData {
  // Step 1
  activityName?: string;
  categories?: string[];
  processingType?: string;
  owner?: string;
  dpo?: string;
  businessJustification?: string;
  controller?: string;
  // Step 2
  dataCategories?: string[];
  legalBasis?: string;
  purpose?: string;
  dataSubjects?: string;
  volume?: string;
  retention?: string;
  recipients?: string;
  crossBorder?: boolean;
  // Step 3
  likelihood?: number;
  impact?: number;
  risks?: unknown[];
  calculatedRiskScore?: number;
  calculatedRiskLevel?: string;
  riskJustification?: string;
  linddunThreats?: LinddunThreat[];
  maestroThreats?: MaestroThreat[];
  // Step 4
  aiInvolved?: boolean;
  aiClassification?: string;
  autonomy?: string;
  explainability?: string;
  trainingData?: string;
  biasAnalysis?: string;
  performanceMetrics?: string;
  humanOversight?: string;
  // Step 5
  additionalSafeguards?: string;
  residualRisk?: string;
  reviewFrequency?: string;
  monitoringPlan?: string;
  // Step 6
  threatSummary?: string;
  // Step 7
  maestroAssessment?: string;
  // Submission
  riskScore?: number;
  submittedAt?: string;
  [key: string]: unknown;
}

export interface WizardStepProps {
  data: WizardFormData;
  setData: React.Dispatch<React.SetStateAction<WizardFormData>>;
}
