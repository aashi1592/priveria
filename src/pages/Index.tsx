import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RiskOverview } from "@/components/dashboard/RiskOverview";
import { DPIACategories } from "@/components/dashboard/DPIACategories";
import { RecentAssessments } from "@/components/dashboard/RecentAssessments";
import { ComplianceFrameworks } from "@/components/dashboard/ComplianceFrameworks";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeView={activeView} setActiveView={setActiveView} />
      
      <main className="container mx-auto px-6 py-8">
        {activeView === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Enterprise DPIA Management
              </h1>
              <p className="text-muted-foreground text-lg">
                Data Protection Impact Assessment & AI Risk Framework
              </p>
            </div>

            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskOverview />
              <ComplianceFrameworks />
            </div>

            <DPIACategories />
            
            <RecentAssessments />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
