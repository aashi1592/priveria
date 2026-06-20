import { describe, it, expect, beforeEach } from "vitest";
import { FeatureManager, FEATURE_DEFINITIONS } from "../config/features";

// Reset singleton between tests
beforeEach(() => {
  // @ts-expect-error resetting singleton for test isolation
  FeatureManager.instance = undefined;
});

describe("FeatureManager", () => {
  it("initialises with all community features enabled", () => {
    const manager = FeatureManager.getInstance();
    const communityFeatures = Object.values(FEATURE_DEFINITIONS).filter(
      (f) => f.tier === "community"
    );
    communityFeatures.forEach((f) => {
      expect(manager.isFeatureEnabled(f.id)).toBe(true);
    });
  });

  it("initialises with all enterprise features disabled", () => {
    const manager = FeatureManager.getInstance();
    const enterpriseFeatures = Object.values(FEATURE_DEFINITIONS).filter(
      (f) => f.tier === "enterprise"
    );
    enterpriseFeatures.forEach((f) => {
      expect(manager.isFeatureEnabled(f.id)).toBe(false);
    });
  });

  it("enables a specific enterprise feature after setLicense", () => {
    const manager = FeatureManager.getInstance();
    manager.setLicense("enterprise", ["AI_RISK_SCORING"]);
    expect(manager.isFeatureEnabled("AI_RISK_SCORING")).toBe(true);
  });

  it("does not enable enterprise features not listed in setLicense", () => {
    const manager = FeatureManager.getInstance();
    manager.setLicense("enterprise", ["AI_RISK_SCORING"]);
    expect(manager.isFeatureEnabled("MULTI_GRC_SYNC")).toBe(false);
  });

  it("community features remain enabled after setLicense", () => {
    const manager = FeatureManager.getInstance();
    manager.setLicense("enterprise", ["AI_RISK_SCORING"]);
    expect(manager.isFeatureEnabled("CORE_DPIA")).toBe(true);
    expect(manager.isFeatureEnabled("BASIC_REPORTING")).toBe(true);
  });

  it("ignores unknown feature IDs in setLicense", () => {
    const manager = FeatureManager.getInstance();
    expect(() => manager.setLicense("enterprise", ["NONEXISTENT_FEATURE"])).not.toThrow();
    expect(manager.isFeatureEnabled("NONEXISTENT_FEATURE")).toBe(false);
  });

  it("getLicenseTier returns the current tier", () => {
    const manager = FeatureManager.getInstance();
    expect(manager.getLicenseTier()).toBe("community");
    manager.setLicense("enterprise", []);
    expect(manager.getLicenseTier()).toBe("enterprise");
  });
});
