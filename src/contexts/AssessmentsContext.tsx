/**
 * AssessmentsContext — localStorage-backed store for DPIA assessments.
 * IDs are auto-assigned as DPIA-<year>-<seq>, incrementing from the current max.
 * Mock data is seeded only on first visit (when localStorage is empty).
 * Replace with Supabase calls when auth/persistence is wired.
 */
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
    riskScore: 28,
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

const STORAGE_KEY = "priveria.assessments";

function loadFromStorage(): Assessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Assessment[];
  } catch {
    // corrupted data — fall back to mock seed
  }
  return mockAssessments;
}

function saveToStorage(assessments: Assessment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  } catch {
    // storage quota exceeded — silently continue
  }
}

const AssessmentsContext = createContext<AssessmentsContextType | undefined>(undefined);

export const AssessmentsProvider = ({ children }: { children: ReactNode }) => {
  const [assessments, setAssessments] = useState<Assessment[]>(loadFromStorage);

  const addAssessment = (assessment: Omit<Assessment, "id">) => {
    setAssessments((prev) => {
      const maxNum = prev.reduce((max, a) => {
        const match = a.id.match(/DPIA-\d{4}-(\d+)/);
        return match ? Math.max(max, parseInt(match[1], 10)) : max;
      }, 0);
      const newId = `DPIA-${new Date().getFullYear()}-${String(maxNum + 1).padStart(3, "0")}`;
      const next = [{ ...assessment, id: newId }, ...prev];
      saveToStorage(next);
      return next;
    });
  };

  const updateAssessment = (id: string, updates: Partial<Assessment>) => {
    setAssessments((prev) => {
      const next = prev.map((assessment) =>
        assessment.id === id ? { ...assessment, ...updates } : assessment
      );
      saveToStorage(next);
      return next;
    });
  };

  const deleteAssessment = (id: string) => {
    setAssessments((prev) => {
      const next = prev.filter((assessment) => assessment.id !== id);
      saveToStorage(next);
      return next;
    });
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

/** Access assessment CRUD operations and computed stats. Must be used inside AssessmentsProvider. */
export const useAssessments = () => {
  const context = useContext(AssessmentsContext);
  if (!context) {
    throw new Error("useAssessments must be used within AssessmentsProvider");
  }
  return context;
};
