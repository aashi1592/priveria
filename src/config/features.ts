/**
 * Feature Flag System for Open Source & Enterprise Features
 * 
 * This system controls which features are available based on license tier.
 * - Community Edition: Core DPIA features (always free)
 * - Enterprise Edition: AI features, integrations, advanced capabilities
 */

export type FeatureTier = 'community' | 'enterprise';

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  tier: FeatureTier;
  enabled: boolean;
}

/**
 * Core feature definitions
 * These define what's available in each tier
 */
export const FEATURE_DEFINITIONS: Record<string, FeatureDefinition> = {
  // ✅ COMMUNITY EDITION (Always Free)
  CORE_DPIA: {
    id: 'CORE_DPIA',
    name: 'Core DPIA Assessment',
    description: 'Create and manage Data Protection Impact Assessments',
    tier: 'community',
    enabled: true,
  },
  BASIC_RISK_ASSESSMENT: {
    id: 'BASIC_RISK_ASSESSMENT',
    name: 'Basic Risk Assessment',
    description: 'Manual risk scoring and evaluation',
    tier: 'community',
    enabled: true,
  },
  MANUAL_VENDOR_ENTRY: {
    id: 'MANUAL_VENDOR_ENTRY',
    name: 'Manual Vendor Management',
    description: 'Add and track third-party vendors manually',
    tier: 'community',
    enabled: true,
  },
  BASIC_REPORTING: {
    id: 'BASIC_REPORTING',
    name: 'Basic Reporting',
    description: 'Generate standard DPIA reports',
    tier: 'community',
    enabled: true,
  },

  // 🔐 ENTERPRISE EDITION (License Required)
  LINDDUN_THREAT_MODELING: {
    id: 'LINDDUN_THREAT_MODELING',
    name: 'LINDDUN Threat Modeling',
    description: 'Advanced privacy threat modeling framework',
    tier: 'enterprise',
    enabled: false,
  },
  AI_RISK_SCORING: {
    id: 'AI_RISK_SCORING',
    name: 'AI-Powered Risk Scoring',
    description: 'Automated risk assessment using machine learning',
    tier: 'enterprise',
    enabled: false,
  },
  AI_VENDOR_RECOMMENDATIONS: {
    id: 'AI_VENDOR_RECOMMENDATIONS',
    name: 'AI Vendor Recommendations',
    description: 'Intelligent vendor risk analysis and suggestions',
    tier: 'enterprise',
    enabled: false,
  },
  AI_DOCUMENT_ANALYSIS: {
    id: 'AI_DOCUMENT_ANALYSIS',
    name: 'AI Document Analysis',
    description: 'Automated document scanning and risk detection',
    tier: 'enterprise',
    enabled: false,
  },
  AI_COMPLIANCE_MONITORING: {
    id: 'AI_COMPLIANCE_MONITORING',
    name: 'AI Compliance Monitoring',
    description: 'Real-time compliance status tracking',
    tier: 'enterprise',
    enabled: false,
  },
  AI_NATURAL_LANGUAGE_QUERY: {
    id: 'AI_NATURAL_LANGUAGE_QUERY',
    name: 'Natural Language Queries',
    description: 'Ask questions about your data in plain English',
    tier: 'enterprise',
    enabled: false,
  },
  CICD_POLICY_ENFORCEMENT: {
    id: 'CICD_POLICY_ENFORCEMENT',
    name: 'CI/CD Policy Enforcement',
    description: 'Automated policy checks in deployment pipelines',
    tier: 'enterprise',
    enabled: false,
  },
  CRYPTOGRAPHIC_AUDIT_TRAIL: {
    id: 'CRYPTOGRAPHIC_AUDIT_TRAIL',
    name: 'Cryptographic Audit Trail',
    description: 'Tamper-proof activity logging',
    tier: 'enterprise',
    enabled: false,
  },
  MULTI_GRC_SYNC: {
    id: 'MULTI_GRC_SYNC',
    name: 'Multi-GRC Sync',
    description: 'Integration with OneTrust, ServiceNow, etc.',
    tier: 'enterprise',
    enabled: false,
  },
  GOVERNANCE_TELEMETRY: {
    id: 'GOVERNANCE_TELEMETRY',
    name: 'Governance Telemetry',
    description: 'Advanced analytics and dashboards',
    tier: 'enterprise',
    enabled: false,
  },
  W3C_DPV_ONTOLOGY: {
    id: 'W3C_DPV_ONTOLOGY',
    name: 'W3C DPV Ontology',
    description: 'Standardized data vocabulary support',
    tier: 'enterprise',
    enabled: false,
  },
  DYNAMIC_VENDOR_MANAGEMENT: {
    id: 'DYNAMIC_VENDOR_MANAGEMENT',
    name: 'Dynamic Vendor Management',
    description: 'Automated vendor discovery and tracking',
    tier: 'enterprise',
    enabled: false,
  },
  VENDOR_RISK_HEATMAPS: {
    id: 'VENDOR_RISK_HEATMAPS',
    name: 'Vendor Risk Heatmaps',
    description: 'Visual risk analysis across vendors',
    tier: 'enterprise',
    enabled: false,
  },
  CLOUD_INFRA_TRACKING: {
    id: 'CLOUD_INFRA_TRACKING',
    name: 'Cloud Infrastructure Tracking',
    description: 'Monitor AWS, Azure, GCP resources',
    tier: 'enterprise',
    enabled: false,
  },
  HUMAN_IN_THE_LOOP: {
    id: 'HUMAN_IN_THE_LOOP',
    name: 'Human-in-the-Loop Workflows',
    description: 'Approval workflows for critical decisions',
    tier: 'enterprise',
    enabled: false,
  },
  CHANGE_DETECTION: {
    id: 'CHANGE_DETECTION',
    name: 'Change Detection',
    description: 'Automatic detection of system changes',
    tier: 'enterprise',
    enabled: false,
  },
  AUTO_DATA_FLOW_DIAGRAMS: {
    id: 'AUTO_DATA_FLOW_DIAGRAMS',
    name: 'Auto Data Flow Diagrams',
    description: 'Automatically generate data flow visualizations',
    tier: 'enterprise',
    enabled: false,
  },
};

/**
 * Feature flag manager class
 * Handles license validation and feature availability
 */
export class FeatureManager {
  private static instance: FeatureManager;
  private enabledFeatures: Set<string> = new Set();
  private licenseTier: FeatureTier = 'community';

  private constructor() {
    // Initialize with community features
    Object.values(FEATURE_DEFINITIONS).forEach(feature => {
      if (feature.tier === 'community') {
        this.enabledFeatures.add(feature.id);
      }
    });
  }

  static getInstance(): FeatureManager {
    if (!FeatureManager.instance) {
      FeatureManager.instance = new FeatureManager();
    }
    return FeatureManager.instance;
  }

  /**
   * Update enabled features based on license validation
   */
  setLicense(tier: FeatureTier, enabledFeatureIds: string[] = []) {
    this.licenseTier = tier;
    
    // Always include community features
    Object.values(FEATURE_DEFINITIONS).forEach(feature => {
      if (feature.tier === 'community') {
        this.enabledFeatures.add(feature.id);
      }
    });

    // Add enterprise features if licensed
    if (tier === 'enterprise') {
      enabledFeatureIds.forEach(id => {
        if (FEATURE_DEFINITIONS[id]?.tier === 'enterprise') {
          this.enabledFeatures.add(id);
        }
      });
    }
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureId: string): boolean {
    return this.enabledFeatures.has(featureId);
  }

  /**
   * Get current license tier
   */
  getLicenseTier(): FeatureTier {
    return this.licenseTier;
  }

  /**
   * Get all enabled features
   */
  getEnabledFeatures(): FeatureDefinition[] {
    return Array.from(this.enabledFeatures)
      .map(id => FEATURE_DEFINITIONS[id])
      .filter(Boolean);
  }

  /**
   * Get features by tier
   */
  getFeaturesByTier(tier: FeatureTier): FeatureDefinition[] {
    return Object.values(FEATURE_DEFINITIONS).filter(f => f.tier === tier);
  }
}

/**
 * Get feature manager instance (for non-React contexts)
 */
export function getFeatureManager(): FeatureManager {
  return FeatureManager.getInstance();
}

import { useState, useEffect } from "react";

/**
 * React Hook for accessing feature flags — reactive to setLicense() calls.
 */
export function useFeature(featureId: string): boolean {
  const manager = FeatureManager.getInstance();
  const [enabled, setEnabled] = useState(() => manager.isFeatureEnabled(featureId));

  useEffect(() => {
    setEnabled(manager.isFeatureEnabled(featureId));
  }, [featureId, manager]);

  return enabled;
}
