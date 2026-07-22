import { describe, it, expect, vi, beforeEach } from "vitest";

// Capture what the FeatureManager is told, and control the edge-function response.
const setLicense = vi.fn();
vi.mock("@/config/features", () => ({
  getFeatureManager: () => ({ setLicense }),
}));

const invoke = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabase: { functions: { invoke: (...args: unknown[]) => invoke(...args) } },
}));

import { validateLicense } from "@/lib/licenseService";

describe("validateLicense (fails closed to community)", () => {
  beforeEach(() => {
    setLicense.mockReset();
    invoke.mockReset();
    vi.unstubAllEnvs();
  });

  it("no license key → community, no server round-trip", async () => {
    vi.stubEnv("VITE_LICENSE_KEY", "");
    const r = await validateLicense();
    expect(r.tier).toBe("community");
    expect(invoke).not.toHaveBeenCalled();
    expect(setLicense).toHaveBeenCalledWith("community", []);
  });

  it("edge-function error → community", async () => {
    vi.stubEnv("VITE_LICENSE_KEY", "key-123");
    invoke.mockResolvedValue({ data: null, error: { message: "boom" } });
    const r = await validateLicense();
    expect(r.tier).toBe("community");
    expect(setLicense).toHaveBeenCalledWith("community", []);
  });

  it("server authorizes enterprise → enterprise + features", async () => {
    vi.stubEnv("VITE_LICENSE_KEY", "key-123");
    invoke.mockResolvedValue({
      data: { valid: true, tier: "enterprise", enabledFeatures: ["linddun_threats"] },
      error: null,
    });
    const r = await validateLicense();
    expect(r.tier).toBe("enterprise");
    expect(r.enabledFeatures).toEqual(["linddun_threats"]);
    expect(setLicense).toHaveBeenCalledWith("enterprise", ["linddun_threats"]);
  });

  it("server returns community tier → stays community", async () => {
    vi.stubEnv("VITE_LICENSE_KEY", "key-123");
    invoke.mockResolvedValue({ data: { valid: true, tier: "community", enabledFeatures: [] }, error: null });
    const r = await validateLicense();
    expect(r.tier).toBe("community");
    expect(setLicense).toHaveBeenCalledWith("community", []);
  });

  it("thrown/network error → community", async () => {
    vi.stubEnv("VITE_LICENSE_KEY", "key-123");
    invoke.mockRejectedValue(new Error("network down"));
    const r = await validateLicense();
    expect(r.tier).toBe("community");
    expect(setLicense).toHaveBeenCalledWith("community", []);
  });
});
