import { createContext, useContext, useState, ReactNode } from "react";

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
}

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
  humanInTheLoopEnabled: true,
  changeDetectionEnabled: false,
  autoDataFlowDiagramsEnabled: false,
};

const EnterpriseConfigContext = createContext<EnterpriseConfigContextType | undefined>(undefined);

export const EnterpriseConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<EnterpriseConfig>(defaultConfig);

  const updateConfig = (updates: Partial<EnterpriseConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <EnterpriseConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </EnterpriseConfigContext.Provider>
  );
};

export const useEnterpriseConfig = () => {
  const context = useContext(EnterpriseConfigContext);
  if (!context) {
    throw new Error("useEnterpriseConfig must be used within EnterpriseConfigProvider");
  }
  return context;
};
