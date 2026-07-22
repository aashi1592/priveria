import { describe, it, expect } from "vitest";
import { applyRetrigger, detectRetrigger, getRetriggerConfig } from "@/lib/retrigger";
import type { Assessment } from "@/contexts/AssessmentsContext";

const base: Assessment = {
  id: "DPIA-2026-001",
  category: "Product/Application",
  name: "Recsys",
  owner: "Test Owner",
  date: "2026-07-01",
  status: "completed",
  riskLevel: "high",
  riskScore: 76,
  tier: "tier-1",
  details: { autonomy: "human-review", retrigger: { watch: ["riskScore", "autonomy"], timeBased: true } },
};

const NOW = "2026-07-22T00:00:00Z";

describe("retrigger", () => {
  it("does not fire when no watched attribute changes", () => {
    const r = detectRetrigger(base, { name: "Renamed" });
    expect(r.fired).toBe(false);
  });

  it("fires when a watched top-level attribute changes", () => {
    const r = detectRetrigger(base, { riskScore: 90 });
    expect(r.fired).toBe(true);
    expect(r.reason).toContain("Overall risk score");
  });

  it("fires when a watched details attribute changes", () => {
    const r = detectRetrigger(base, { details: { ...base.details, autonomy: "autonomous" } });
    expect(r.fired).toBe(true);
    expect(r.reason).toContain("Agent autonomy level");
  });

  it("does not fire for unwatched attributes", () => {
    const r = detectRetrigger(base, { tier: "tier-3" }); // tier not in watch list
    expect(r.fired).toBe(false);
  });

  it("ignores details attributes when the update omits details", () => {
    const r = detectRetrigger(base, { riskLevel: "critical" }); // riskLevel not watched, details untouched
    expect(r.fired).toBe(false);
  });

  it("applyRetrigger forces in-review and stamps lastFired when fired", () => {
    const { updates, fired } = applyRetrigger(base, { riskScore: 90 }, NOW);
    expect(fired).toBe(true);
    expect(updates.status).toBe("in-review");
    const cfg = getRetriggerConfig({ details: updates.details });
    expect(cfg.lastFired?.at).toBe(NOW);
    expect(cfg.lastFired?.reason).toContain("Overall risk score");
    // preserves existing config
    expect(cfg.watch).toEqual(["riskScore", "autonomy"]);
  });

  it("applyRetrigger returns updates unchanged when not fired", () => {
    const { updates, fired } = applyRetrigger(base, { name: "Renamed" }, NOW);
    expect(fired).toBe(false);
    expect(updates).toEqual({ name: "Renamed" });
  });

  it("no watch list means never fires", () => {
    const noWatch: Assessment = { ...base, details: {} };
    expect(detectRetrigger(noWatch, { riskScore: 5 }).fired).toBe(false);
  });
});
