/**
 * Client-side entry point for server-validated licensing.
 *
 * Enterprise features must never be unlocked on the client's say-so. This calls
 * the `validate-license` edge function (which authenticates the user's JWT and
 * checks the `enterprise_licenses` table with the service-role key) and returns
 * the tier + feature list the *server* authorized. Callers feed the result into
 * FeatureManager / EnterpriseConfig — a missing/invalid license always resolves
 * to the community tier.
 */
import { supabase } from "@/lib/supabase";
import { getFeatureManager, type FeatureTier } from "@/config/features";

export interface LicenseValidationResult {
  valid: boolean;
  tier: FeatureTier;
  enabledFeatures: string[];
  expiresAt?: string;
  message?: string;
}

const COMMUNITY_RESULT: LicenseValidationResult = {
  valid: true,
  tier: "community",
  enabledFeatures: [],
};

/**
 * Validate the configured license against the server. Falls back to community
 * tier on any error or when no license key is configured — never throws.
 */
export async function validateLicense(): Promise<LicenseValidationResult> {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY as string | undefined;

  // No license configured → community tier, no server round-trip needed.
  if (!licenseKey) {
    getFeatureManager().setLicense("community", []);
    return COMMUNITY_RESULT;
  }

  try {
    const { data, error } = await supabase.functions.invoke<LicenseValidationResult>(
      "validate-license",
      { body: { licenseKey } },
    );

    if (error || !data || !data.valid || data.tier !== "enterprise") {
      getFeatureManager().setLicense("community", []);
      return { ...COMMUNITY_RESULT, message: data?.message ?? error?.message };
    }

    getFeatureManager().setLicense("enterprise", data.enabledFeatures ?? []);
    return {
      valid: true,
      tier: "enterprise",
      enabledFeatures: data.enabledFeatures ?? [],
      expiresAt: data.expiresAt,
    };
  } catch {
    // Network/edge failure must fail closed to community tier.
    getFeatureManager().setLicense("community", []);
    return COMMUNITY_RESULT;
  }
}
