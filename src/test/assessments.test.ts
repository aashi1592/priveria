import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { createElement } from "react";

// In-memory stand-in for the Supabase `assessments` table. RLS is simulated
// implicitly: the mock only ever holds the "current user's" rows.
const store: Record<string, unknown>[] = [];

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1" }, session: {}, loading: false }),
}));

vi.mock("@/lib/supabase", () => {
  const builder = () => {
    const filters: Record<string, unknown> = {};
    let insertRow: Record<string, unknown> | null = null;
    let patch: Record<string, unknown> | null = null;
    let op: "insert" | "update" | "delete" | null = null;

    const matches = (row: Record<string, unknown>) =>
      Object.entries(filters).every(([k, v]) => row[k] === v);

    const b: Record<string, unknown> = {
      select: () => b,
      order: () => Promise.resolve({ data: [...store], error: null }),
      insert: (row: Record<string, unknown>) => {
        op = "insert";
        insertRow = { created_at: "2026-01-01T00:00:00Z", ...row };
        return b;
      },
      single: () => {
        if (op === "insert" && insertRow) store.unshift(insertRow);
        return Promise.resolve({ data: insertRow, error: null });
      },
      update: (p: Record<string, unknown>) => {
        op = "update";
        patch = p;
        return b;
      },
      delete: () => {
        op = "delete";
        return b;
      },
      eq: (col: string, val: unknown) => {
        filters[col] = val;
        return b;
      },
      then: (resolve: (r: { error: null }) => void) => {
        if (op === "update" && patch) {
          store.forEach((row) => {
            if (matches(row)) Object.assign(row, patch);
          });
        } else if (op === "delete") {
          for (let i = store.length - 1; i >= 0; i--) {
            if (matches(store[i])) store.splice(i, 1);
          }
        }
        resolve({ error: null });
      },
    };
    return b;
  };

  return { supabase: { from: () => builder() } };
});

// Imported after the mocks are registered.
const { AssessmentsProvider, useAssessments } = await import(
  "../contexts/AssessmentsContext"
);

const wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(AssessmentsProvider, null, children);

function seed() {
  store.length = 0;
  store.push(
    {
      user_id: "user-1",
      display_id: "DPIA-2024-001",
      category: "Product/Application",
      name: "Customer Data Analytics Platform",
      status: "completed",
      risk_level: "high",
      risk_score: 28,
      tier: "tier-1",
      created_at: "2024-03-15T00:00:00Z",
      details: {},
    },
    {
      user_id: "user-1",
      display_id: "DPIA-2024-002",
      category: "Vendor",
      name: "Cloud Storage Provider Assessment",
      status: "in-review",
      risk_level: "medium",
      risk_score: 56,
      tier: "tier-2",
      created_at: "2024-03-10T00:00:00Z",
      details: {},
    }
  );
}

async function renderReady() {
  const hook = renderHook(() => useAssessments(), { wrapper });
  // Wait for the initial async fetch to populate state.
  await waitFor(() => expect(hook.result.current.assessments.length).toBeGreaterThan(0));
  return hook;
}

describe("AssessmentsContext (Supabase-backed)", () => {
  beforeEach(() => {
    seed();
  });

  describe("addAssessment", () => {
    it("increments the display ID from the current maximum, not array length", async () => {
      // Seed with a gap (001, 010) so array-length numbering (which would yield
      // 003) is clearly distinguishable from max-based numbering (yields 011).
      store.push({
        user_id: "user-1",
        display_id: "DPIA-2024-010",
        category: "Vendor",
        name: "Gap Assessment",
        status: "pending",
        risk_level: "low",
        risk_score: 3,
        tier: "tier-3",
        created_at: "2024-04-01T00:00:00Z",
        details: {},
      });
      const { result } = await renderReady();

      await act(async () => {
        await result.current.addAssessment({
          category: "Internal Process",
          name: "Test Assessment",
          owner: "Tester",
          date: "2026-01-01",
          status: "draft",
          riskLevel: "low",
          riskScore: 5,
          tier: "tier-3",
        });
      });

      const ids = result.current.assessments.map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
      // Max existing sequence is 010 → next is 011, not 004 (array length + 1).
      expect(ids[0]).toBe(`DPIA-${new Date().getFullYear()}-011`);
    });

    it("places the new assessment at the top of the list", async () => {
      const { result } = await renderReady();

      await act(async () => {
        await result.current.addAssessment({
          category: "Vendor",
          name: "New Vendor Assessment",
          owner: "Alice",
          date: "2026-01-01",
          status: "pending",
          riskLevel: "medium",
          riskScore: 15,
          tier: "tier-2",
        });
      });

      expect(result.current.assessments[0].name).toBe("New Vendor Assessment");
    });
  });

  describe("deleteAssessment", () => {
    it("removes the assessment with the given ID", async () => {
      const { result } = await renderReady();

      await act(async () => {
        await result.current.deleteAssessment("DPIA-2024-001");
      });

      expect(result.current.assessments.find((a) => a.id === "DPIA-2024-001")).toBeUndefined();
    });
  });

  describe("updateAssessment", () => {
    it("updates only the specified fields", async () => {
      const { result } = await renderReady();

      await act(async () => {
        await result.current.updateAssessment("DPIA-2024-001", { status: "completed" });
      });

      const updated = result.current.assessments.find((a) => a.id === "DPIA-2024-001");
      expect(updated?.status).toBe("completed");
      expect(updated?.name).toBe("Customer Data Analytics Platform");
    });
  });

  describe("stats", () => {
    it("counts high and critical assessments as highRisk", async () => {
      const { result } = await renderReady();
      const { stats, assessments } = result.current;
      const expected = assessments.filter(
        (a) => a.riskLevel === "critical" || a.riskLevel === "high"
      ).length;
      expect(stats.highRisk).toBe(expected);
    });

    it("counts pending and in-review as pending", async () => {
      const { result } = await renderReady();
      const { stats, assessments } = result.current;
      const expected = assessments.filter(
        (a) => a.status === "pending" || a.status === "in-review"
      ).length;
      expect(stats.pending).toBe(expected);
    });
  });
});
