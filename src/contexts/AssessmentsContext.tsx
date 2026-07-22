/**
 * AssessmentsContext — Supabase-backed store for DPIA assessments.
 *
 * Records persist in the `public.assessments` table, owner-scoped by the
 * existing Row Level Security policies (a user only ever sees/mutates their own
 * rows). The human-readable "DPIA-<year>-<seq>" reference is kept as the row's
 * `display_id` and surfaced as `Assessment.id`; the UUID primary key stays
 * internal. Data is fetched when a user signs in and cleared on sign-out.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { applyRetrigger } from "@/lib/retrigger";
import type { Database } from "@/integrations/supabase/types";

type AssessmentRow = Database["public"]["Tables"]["assessments"]["Row"];
type AssessmentInsert = Database["public"]["Tables"]["assessments"]["Insert"];
type AssessmentUpdate = Database["public"]["Tables"]["assessments"]["Update"];

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
  loading: boolean;
  addAssessment: (assessment: Omit<Assessment, "id">) => Promise<void>;
  updateAssessment: (id: string, updates: Partial<Assessment>) => Promise<void>;
  deleteAssessment: (id: string) => Promise<void>;
  stats: {
    total: number;
    highRisk: number;
    pending: number;
    byRisk: { critical: number; high: number; medium: number; low: number; minimal: number };
  };
}

const AssessmentsContext = createContext<AssessmentsContextType | undefined>(undefined);

/** Map a database row to the client Assessment model. */
function rowToAssessment(row: AssessmentRow): Assessment {
  return {
    id: row.display_id ?? row.id,
    category: row.category,
    name: row.name,
    owner: row.owner ?? "",
    date: (row.created_at ?? "").split("T")[0],
    status: row.status as Assessment["status"],
    riskLevel: row.risk_level as Assessment["riskLevel"],
    riskScore: row.risk_score ?? 0,
    tier: (row.tier as Assessment["tier"]) ?? "tier-3",
    nextReview: row.next_review ?? undefined,
    details: (row.details as Record<string, unknown>) ?? {},
  };
}

/** Compute the next "DPIA-<year>-<seq>" reference from the existing set. */
function nextDisplayId(existing: Assessment[]): string {
  const maxNum = existing.reduce((max, a) => {
    const match = a.id.match(/DPIA-\d{4}-(\d+)/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  return `DPIA-${new Date().getFullYear()}-${String(maxNum + 1).padStart(3, "0")}`;
}

export const AssessmentsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setAssessments([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load assessments.");
      setAssessments([]);
    } else {
      setAssessments((data ?? []).map(rowToAssessment));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addAssessment = useCallback(
    async (assessment: Omit<Assessment, "id">) => {
      if (!user) {
        toast.error("You must be signed in to create an assessment.");
        return;
      }
      const insert: AssessmentInsert = {
        user_id: user.id,
        display_id: nextDisplayId(assessments),
        category: assessment.category,
        name: assessment.name,
        owner: assessment.owner,
        status: assessment.status,
        risk_level: assessment.riskLevel,
        risk_score: assessment.riskScore,
        tier: assessment.tier,
        next_review: assessment.nextReview ?? null,
        details: (assessment.details ?? {}) as AssessmentInsert["details"],
      };
      const { data, error } = await supabase
        .from("assessments")
        .insert(insert)
        .select("*")
        .single();
      if (error || !data) {
        toast.error("Failed to save assessment.");
        return;
      }
      setAssessments((prev) => [rowToAssessment(data), ...prev]);
    },
    [user, assessments]
  );

  const updateAssessment = useCallback(
    async (id: string, incoming: Partial<Assessment>) => {
      if (!user) return;

      // Re-trigger check (Level 2, change-based): if a watched attribute changed,
      // send the DPIA back into review and record why before persisting.
      const current = assessments.find((a) => a.id === id);
      const { updates, fired, reason } = current
        ? applyRetrigger(current, incoming, new Date().toISOString())
        : { updates: incoming, fired: false, reason: "" };
      if (fired) toast.info(reason);

      // Optimistic local update.
      setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));

      const patch: AssessmentUpdate = {};
      if (updates.category !== undefined) patch.category = updates.category;
      if (updates.name !== undefined) patch.name = updates.name;
      if (updates.owner !== undefined) patch.owner = updates.owner;
      if (updates.status !== undefined) patch.status = updates.status;
      if (updates.riskLevel !== undefined) patch.risk_level = updates.riskLevel;
      if (updates.riskScore !== undefined) patch.risk_score = updates.riskScore;
      if (updates.tier !== undefined) patch.tier = updates.tier;
      if (updates.nextReview !== undefined) patch.next_review = updates.nextReview ?? null;
      if (updates.details !== undefined) patch.details = updates.details as AssessmentUpdate["details"];

      const { error } = await supabase
        .from("assessments")
        .update(patch)
        .eq("user_id", user.id)
        .eq("display_id", id);
      if (error) {
        toast.error("Failed to update assessment.");
        void refresh();
      }
    },
    [user, refresh, assessments]
  );

  const deleteAssessment = useCallback(
    async (id: string) => {
      if (!user) return;
      const previous = assessments;
      setAssessments((prev) => prev.filter((a) => a.id !== id));
      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("user_id", user.id)
        .eq("display_id", id);
      if (error) {
        toast.error("Failed to delete assessment.");
        setAssessments(previous);
      }
    },
    [user, assessments]
  );

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
      value={{ assessments, loading, addAssessment, updateAssessment, deleteAssessment, stats }}
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
