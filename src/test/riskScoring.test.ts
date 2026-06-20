import { describe, it, expect } from "vitest";

// Mirror the exact risk classification logic from DPIAWizard and WizardStep3
function classifyRisk(score: number): "critical" | "high" | "medium" | "low" | "minimal" {
  if (score >= 36) return "critical";
  if (score >= 21) return "high";
  if (score >= 11) return "medium";
  if (score >= 6) return "low";
  return "minimal";
}

function calculateScore(
  likelihood: number,
  impact: number,
  regulatoryMultiplier = 5,
  volumeFactor = 1.2
): number {
  return Math.round(likelihood * impact * volumeFactor + regulatoryMultiplier);
}

describe("Risk scoring", () => {
  describe("classifyRisk", () => {
    it("classifies score >= 36 as critical", () => {
      expect(classifyRisk(36)).toBe("critical");
      expect(classifyRisk(89)).toBe("critical");
    });

    it("classifies score 21-35 as high", () => {
      expect(classifyRisk(21)).toBe("high");
      expect(classifyRisk(35)).toBe("high");
    });

    it("classifies score 11-20 as medium", () => {
      expect(classifyRisk(11)).toBe("medium");
      expect(classifyRisk(20)).toBe("medium");
    });

    it("classifies score 6-10 as low", () => {
      expect(classifyRisk(6)).toBe("low");
      expect(classifyRisk(10)).toBe("low");
    });

    it("classifies score < 6 as minimal", () => {
      expect(classifyRisk(0)).toBe("minimal");
      expect(classifyRisk(5)).toBe("minimal");
    });
  });

  describe("calculateScore", () => {
    it("minimum inputs produce a non-negative score", () => {
      expect(calculateScore(1, 1)).toBeGreaterThanOrEqual(0);
    });

    it("maximum base inputs (5x5) produce a high score (35 = just below critical threshold)", () => {
      const score = calculateScore(5, 5);
      expect(score).toBe(35);
      expect(classifyRisk(score)).toBe("high");
    });

    it("5x5 with register risks pushes score into critical", () => {
      const score = calculateScore(5, 5) + 8; // one critical risk in register
      expect(classifyRisk(score)).toBe("critical");
    });

    it("regulatory multiplier is always included", () => {
      const withReg = calculateScore(1, 1, 5);
      const withoutReg = calculateScore(1, 1, 0);
      expect(withReg - withoutReg).toBe(5);
    });

    it("mock data DPIA-2024-001 riskScore=28 correctly classifies as high", () => {
      expect(classifyRisk(28)).toBe("high");
    });

    it("mock data DPIA-2024-004 riskScore=89 correctly classifies as critical", () => {
      expect(classifyRisk(89)).toBe("critical");
    });
  });
});
