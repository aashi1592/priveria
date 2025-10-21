import { ComponentType } from "react";
import { useFeature } from "@/config/features";
import { UpgradePrompt } from "./UpgradePrompt";

/**
 * Higher-order component that wraps a component with enterprise feature checking
 * 
 * Usage:
 * const EnterpriseComponent = withEnterpriseFeature(MyComponent, 'AI_RISK_SCORING');
 */
export function withEnterpriseFeature<P extends object>(
  Component: ComponentType<P>,
  featureId: string,
  variant: "card" | "inline" | "banner" = "card"
) {
  return function EnterpriseFeatureWrapper(props: P) {
    const isEnabled = useFeature(featureId);

    if (!isEnabled) {
      return <UpgradePrompt featureId={featureId} variant={variant} />;
    }

    return <Component {...props} />;
  };
}

/**
 * Component that conditionally renders children based on feature availability
 * 
 * Usage:
 * <FeatureGate featureId="AI_RISK_SCORING">
 *   <MyComponent />
 * </FeatureGate>
 */
interface FeatureGateProps {
  featureId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  variant?: "card" | "inline" | "banner";
}

export function FeatureGate({
  featureId,
  children,
  fallback,
  variant = "card",
}: FeatureGateProps) {
  const isEnabled = useFeature(featureId);

  if (!isEnabled) {
    return fallback || <UpgradePrompt featureId={featureId} variant={variant} />;
  }

  return <>{children}</>;
}
