import { createContext, useContext, useState, ReactNode } from "react";

export interface Assessment {
  id: string;
  category: string;
  name: string;
  owner: string;
  date: string;
  status: "completed" | "in-review" | "pending" | "draft";
  riskLevel: "critical" | "high" | "medium" | "low" | "minimal";
  riskScore: number;
  tier: "tier-1" | "tier-2" | "tier-3";
  nextReview?: string;
  details?: Record<string, unknown>;
}

interface AssessmentsContextType {
  assessments: Assessment[];
  addAssessment: (assessment: Omit<Assessment, "id">) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  stats: {
    total: number;
    highRisk: number;
    pending: number;
    byRisk: { critical: number; high: number; medium: number; low: number; minimal: number };
  };
}

const mockAssessments: Assessment[] = [
  {
    id: "DPIA-2024-001",
    category: "Product/Application",
    name: "Customer Data Analytics Platform",
    owner: "Sarah Chen",
    date: "2024-03-15",
    status: "completed",
    riskLevel: "high",
    riskScore: 78,
    tier: "tier-1",
    nextReview: "2024-09-15",
    details: {
      processingType: "Product/Application",
      businessJustification: "Expand customer insights to tailor marketing campaigns.",
      legalBasis: "legitimate-interest",
      dataCategories: [
        "Personal Identifiers",
        "Behavioral Data",
      ],
      safeguards: "Encryption at rest, quarterly access reviews, DPO oversight.",
      oversight: "Human review on all model outputs above a set risk threshold.",
    },
  },
  {
    id: "DPIA-2024-002",
    category: "Vendor",
    name: "Cloud Storage Provider Assessment",
    owner: "Michael Torres",
    date: "2024-03-10",
    status: "in-review",
    riskLevel: "medium",
    riskScore: 56,
    tier: "tier-2",
    nextReview: "2024-09-10",
    details: {
      processingType: "Vendor",
      vendorName: "SkyVault Storage",
      dataRetention: "3-7years",
      crossBorderTransfers: true,
      mitigation: "Standard contractual clauses, encryption key escrow, quarterly audits.",
    },
  },
  {
    id: "DPIA-2024-003",
    category: "Internal Process",
    name: "Employee Performance Tracking",
    owner: "Jennifer Liu",
    date: "2024-03-08",
    status: "pending",
    riskLevel: "low",
    riskScore: 34,
    tier: "tier-3",
    details: {
      processingType: "Internal Process",
      employeeScope: "Global customer support teams",
      retention: "1-3years",
      dataSubjects: "Employees",
      notes: "Awaiting works council review before activation.",
    },
  },
  {
    id: "DPIA-2024-004",
    category: "Product/Application",
    name: "AI-Powered Chatbot System",
    owner: "David Kumar",
    date: "2024-03-05",
    status: "completed",
    riskLevel: "critical",
    riskScore: 89,
    tier: "tier-1",
    nextReview: "2024-06-05",
    details: {
      processingType: "Product/Application",
      aiClassification: "high-risk",
      autonomy: "human-review",
      explainability: "3",
      biasAnalysis: "Monthly fairness audits across languages.",
      humanOversight: "Escalation to live agents for unresolved queries.",
    },
  },
];

const AssessmentsContext = createContext<AssessmentsContextType | undefined>(undefined);

export const AssessmentsProvider = ({ children }: { children: ReactNode }) => {
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);

  const addAssessment = (assessment: Omit<Assessment, "id">) => {
    const newId = `DPIA-2024-${String(assessments.length + 1).padStart(3, "0")}`;
    const newAssessment: Assessment = {
      ...assessment,
      id: newId,
    };
    setAssessments((prev) => [newAssessment, ...prev]);
  };

  const updateAssessment = (id: string, updates: Partial<Assessment>) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === id ? { ...assessment, ...updates } : assessment
      )
    );
  };

  const deleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((assessment) => assessment.id !== id));
  };

  const stats = {
    total: assessments.length,
    highRisk: assessments.filter((a) => a.riskLevel === "critical" || a.riskLevel === "high").length,
    pending: assessments.filter((a) => a.status === "pending" || a.status === "in-review").length,
    byRisk: {
      critical: assessments.filter((a) => a.riskLevel === "critical").length,
      high: assessments.filter((a) => a.riskLevel === "high").length,
      medium: assessments.filter((a) => a.riskLevel === "medium").length,
      low: assessments.filter((a) => a.riskLevel === "low").length,
      minimal: assessments.filter((a) => a.riskLevel === "minimal").length,
    },
  };

  return (
    <AssessmentsContext.Provider
      value={{ assessments, addAssessment, updateAssessment, deleteAssessment, stats }}
    >
      {children}
    </AssessmentsContext.Provider>
  );
};

export const useAssessments = () => {
  const context = useContext(AssessmentsContext);
  if (!context) {
    throw new Error("useAssessments must be used within AssessmentsProvider");
  }
  return context;
};
