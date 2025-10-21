import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FEATURE_DEFINITIONS } from "@/config/features";

interface UpgradePromptProps {
  featureId: string;
  variant?: "card" | "inline" | "banner";
}

export function UpgradePrompt({ featureId, variant = "card" }: UpgradePromptProps) {
  const feature = FEATURE_DEFINITIONS[featureId];

  if (!feature) {
    return null;
  }

  const handleContactSales = () => {
    window.open("mailto:enterprise@yourcompany.com?subject=Enterprise License Inquiry", "_blank");
  };

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/50">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{feature.name}</span> requires an Enterprise license
        </p>
        <Button size="sm" variant="outline" onClick={handleContactSales} className="ml-auto">
          Upgrade
        </Button>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-4 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">{feature.name}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
          <Button onClick={handleContactSales}>
            Get Enterprise
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className="border-2 border-dashed">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="gap-1">
            <Lock className="h-3 w-3" />
            Enterprise Feature
          </Badge>
        </div>
        <CardTitle className="flex items-center gap-2">
          {feature.name}
        </CardTitle>
        <CardDescription>{feature.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Available in Enterprise Edition:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              AI-powered automation and insights
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Enterprise integrations (OneTrust, ServiceNow)
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Advanced security and audit trails
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Priority support and SLA
            </li>
          </ul>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleContactSales} className="flex-1">
            Contact Sales
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <a href="https://docs.yourcompany.com/enterprise" target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
