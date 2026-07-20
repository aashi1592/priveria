import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { validateLicense } from "@/lib/licenseService";

interface EnterpriseConfig {
  totalDPIAs: number;
  highRiskDPIAs: number;
  pendingReviews: number;
  complianceRate: number;
  organizationName: string;
  linddunEnabled: boolean;
  maestroEnabled: boolean;
  // AI Intelligence Features
  aiRiskScoringEnabled: boolean;
  aiVendorRecommendationsEnabled: boolean;
  aiDocumentAnalysisEnabled: boolean;
  aiComplianceMonitoringEnabled: boolean;
  aiNaturalLanguageQueryEnabled: boolean;
  // Advanced Features
  cicdPolicyEnforcementEnabled: boolean;
  cryptographicAuditTrailEnabled: boolean;
  multiGrcSyncEnabled: boolean;
  governanceTelemetryEnabled: boolean;
  w3cDpvOntologyEnabled: boolean;
  // Vendor Management
  dynamicVendorManagementEnabled: boolean;
  vendorRiskHeatmapsEnabled: boolean;
  cloudInfraTrackingEnabled: boolean;
  // Workflow Controls
  humanInTheLoopEnabled: boolean;
  changeDetectionEnabled: boolean;
  autoDataFlowDiagramsEnabled: boolean;
}

interface EnterpriseConfigContextType {
  config: EnterpriseConfig;
  updateConfig: (updates: Partial<EnterpriseConfig>) => void;
  /** True only when the server validated an active enterprise license. */
  enterpriseLicensed: boolean;
}

/**
 * Config keys that are enterprise-gated. These may only be toggled on when the
 * server has validated an enterprise license — otherwise they are forced off,
 * regardless of what the client submits. Keep in sync with the enterprise-tier
 * entries in EnterpriseConfig above.
 */
const ENTERPRISE_FLAG_KEYS: ReadonlyArray<keyof EnterpriseConfig> = [
  "linddunEnabled",
  "maestroEnabled",
  "aiRiskScoringEnabled",
  "aiVendorRecommendationsEnabled",
  "aiDocumentAnalysisEnabled",
  "aiComplianceMonitoringEnabled",
  "aiNaturalLanguageQueryEnabled",
  "cicdPolicyEnforcementEnabled",
  "cryptographicAuditTrailEnabled",
  "multiGrcSyncEnabled",
  "governanceTelemetryEnabled",
  "w3cDpvOntologyEnabled",
  "dynamicVendorManagementEnabled",
  "vendorRiskHeatmapsEnabled",
  "cloudInfraTrackingEnabled",
  "humanInTheLoopEnabled",
  "changeDetectionEnabled",
  "autoDataFlowDiagramsEnabled",
];

const defaultConfig: EnterpriseConfig = {
  totalDPIAs: 247,
  highRiskDPIAs: 18,
  pendingReviews: 34,
  complianceRate: 94.2,
  organizationName: "Enterprise Organization",
  linddunEnabled: false,
  maestroEnabled: false,
  // AI Intelligence Features
  aiRiskScoringEnabled: false,
  aiVendorRecommendationsEnabled: false,
  aiDocumentAnalysisEnabled: false,
  aiComplianceMonitoringEnabled: false,
  aiNaturalLanguageQueryEnabled: false,
  // Advanced Features
  cicdPolicyEnforcementEnabled: false,
  cryptographicAuditTrailEnabled: false,
  multiGrcSyncEnabled: false,
  governanceTelemetryEnabled: false,
  w3cDpvOntologyEnabled: false,
  // Vendor Management
  dynamicVendorManagementEnabled: false,
  vendorRiskHeatmapsEnabled: false,
  cloudInfraTrackingEnabled: false,
  // Workflow Controls
  humanInTheLoopEnabled: false,
  changeDetectionEnabled: false,
  autoDataFlowDiagramsEnabled: false,
};

const EnterpriseConfigContext = createContext<EnterpriseConfigContextType | undefined>(undefined);

export const EnterpriseConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<EnterpriseConfig>(defaultConfig);
  const [enterpriseLicensed, setEnterpriseLicensed] = useState(false);

  // Ask the server whether an enterprise license is active. Until it confirms
  // (or if it never does), enterprise features stay locked.
  useEffect(() => {
    let cancelled = false;
    validateLicense().then((result) => {
      if (cancelled) return;
      const licensed = result.valid && result.tier === "enterprise";
      setEnterpriseLicensed(licensed);
      if (!licensed) {
        // Defensively clear any enterprise flags if the license lapsed.
        setConfig((prev) => stripEnterpriseFlags(prev));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateConfig = (updates: Partial<EnterpriseConfig>) => {
    // Enterprise flags can only be turned on with a validated license. Strip any
    // enterprise-gated keys from the update when unlicensed so a Settings toggle
    // (or forged client state) cannot unlock paid features.
    const safeUpdates = enterpriseLicensed ? updates : dropEnterpriseFlags(updates);
    setConfig((prev) => ({ ...prev, ...safeUpdates }));
  };

  return (
    <EnterpriseConfigContext.Provider value={{ config, updateConfig, enterpriseLicensed }}>
      {children}
    </EnterpriseConfigContext.Provider>
  );
};

/** Remove enterprise-gated keys from a partial update. */
function dropEnterpriseFlags(updates: Partial<EnterpriseConfig>): Partial<EnterpriseConfig> {
  const copy: Partial<EnterpriseConfig> = { ...updates };
  for (const key of ENTERPRISE_FLAG_KEYS) {
    delete copy[key];
  }
  return copy;
}

/** Force all enterprise-gated flags to false on an existing config. */
function stripEnterpriseFlags(cfg: EnterpriseConfig): EnterpriseConfig {
  const copy = { ...cfg };
  for (const key of ENTERPRISE_FLAG_KEYS) {
    (copy[key] as boolean) = false;
  }
  return copy;
}

export const useEnterpriseConfig = () => {
  const context = useContext(EnterpriseConfigContext);
  if (!context) {
    throw new Error("useEnterpriseConfig must be used within EnterpriseConfigProvider");
  }
  return context;
};
