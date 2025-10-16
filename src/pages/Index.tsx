import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RiskOverview } from "@/components/dashboard/RiskOverview";
import { DPIACategories } from "@/components/dashboard/DPIACategories";
import { RecentAssessments } from "@/components/dashboard/RecentAssessments";
import { ComplianceFrameworks } from "@/components/dashboard/ComplianceFrameworks";
import { Plus } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Enterprise DPIA Management"
        description="Data Protection Impact Assessment & AI Risk Framework"
        action={{
          label: "New Assessment",
          onClick: () => navigate("/dpia-wizard"),
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <div className="px-6 py-8 space-y-8">
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskOverview />
          <ComplianceFrameworks />
        </div>

        <DPIACategories />

        <RecentAssessments />
      </div>
    </div>
  );
};

export default Index;
