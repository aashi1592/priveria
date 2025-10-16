import { createContext, useContext, useState, ReactNode } from "react";

interface EnterpriseConfig {
  totalDPIAs: number;
  highRiskDPIAs: number;
  pendingReviews: number;
  complianceRate: number;
  organizationName: string;
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
