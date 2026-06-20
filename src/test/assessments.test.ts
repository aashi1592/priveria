import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { createElement } from "react";
import { AssessmentsProvider, useAssessments } from "../contexts/AssessmentsContext";

const wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(AssessmentsProvider, null, children);

describe("AssessmentsContext", () => {
  beforeEach(() => {
    // Each test gets the mock seed, not state left over from a prior test.
    localStorage.removeItem("priveria.assessments");
  });
  describe("addAssessment", () => {
    it("generates a unique ID based on max existing ID, not array length", () => {
      const { result } = renderHook(() => useAssessments(), { wrapper });

      act(() => {
        result.current.deleteAssessment("DPIA-2024-002");
      });

      act(() => {
        result.current.addAssessment({
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
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it("places the new assessment at the top of the list", () => {
      const { result } = renderHook(() => useAssessments(), { wrapper });

      act(() => {
        result.current.addAssessment({
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

    it("increments ID from the current maximum, not array length", () => {
      const { result } = renderHook(() => useAssessments(), { wrapper });

      const before = result.current.assessments.map((a) => a.id);
      const maxNum = Math.max(
        ...before.map((id) => {
          const m = id.match(/\d+$/);
          return m ? parseInt(m[0], 10) : 0;
        })
      );

      act(() => {
        result.current.addAssessment({
          category: "Vendor",
          name: "Another",
          owner: "Bob",
          date: "2026-01-01",
          status: "pending",
          riskLevel: "low",
          riskScore: 4,
          tier: "tier-3",
        });
      });

      const newId = result.current.assessments[0].id;
      const newNum = parseInt(newId.match(/\d+$/)![0], 10);
      expect(newNum).toBe(maxNum + 1);
    });
  });

  describe("deleteAssessment", () => {
    it("removes the assessment with the given ID", () => {
      const { result } = renderHook(() => useAssessments(), { wrapper });

      act(() => {
        result.current.deleteAssessment("DPIA-2024-001");
      });

      expect(result.current.assessments.find((a) => a.id === "DPIA-2024-001")).toBeUndefined();
    });
  });

  describe("updateAssessment", () => {
    it("updates only the specified fields", () => {
      const { result } = renderHook(() => useAssessments(), { wrapper });

      act(() => {
        result.current.updateAssessment("DPIA-2024-001", { status: "completed" });
      });

      const updated = result.current.assessments.find((a) => a.id === "DPIA-2024-001");
      expect(updated?.status).toBe("completed");
      expect(updated?.name).toBe("Customer Data Analytics Platform");
    });
  });

  describe("stats", () => {
    it("counts high and critical assessments as highRisk", () => {
      const { result } = renderHook(() => useAssessments(), { wrapper });
      const { stats, assessments } = result.current;
      const expected = assessments.filter(
        (a) => a.riskLevel === "critical" || a.riskLevel === "high"
      ).length;
      expect(stats.highRisk).toBe(expected);
    });

    it("counts pending and in-review as pending", () => {
      const { result } = renderHook(() => useAssessments(), { wrapper });
      const { stats, assessments } = result.current;
      const expected = assessments.filter(
        (a) => a.status === "pending" || a.status === "in-review"
      ).length;
      expect(stats.pending).toBe(expected);
    });
  });
});
