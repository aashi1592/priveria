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
  nextReview?: string;
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
    nextReview: "2024-09-15",
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
    nextReview: "2024-09-10",
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
    nextReview: "2024-06-05",
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
