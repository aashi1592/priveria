import { Card } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, Shield, Brain } from "lucide-react";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { useAssessments } from "@/contexts/AssessmentsContext";

export const DashboardStats = () => {
  const { config } = useEnterpriseConfig();
  const { stats: assessmentStats } = useAssessments();

  const baseStats = [
    {
      label: "Total DPIAs",
      value: assessmentStats.total.toString(),
      change: "+12%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
    {
      label: "High Risk",
      value: assessmentStats.highRisk.toString(),
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "text-risk-high",
      bgColor: "bg-risk-high/10",
    },
    {
      label: "Pending Reviews",
      value: assessmentStats.pending.toString(),
      change: "+5",
      trend: "up",
      icon: Clock,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      label: "Compliance Rate",
      value: `${config.complianceRate}%`,
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-status-info",
      bgColor: "bg-status-info/10",
    },
  ];

  // Add LINDDUN stats when enabled
  const linddunStats = config.linddunEnabled ? [
    {
      label: "Privacy Threats",
      value: "127",
      change: "+8",
      trend: "up",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
  ] : [];

  // Add MAESTRO stats when enabled
  const maestroStats = config.maestroEnabled ? [
    {
      label: "Agentic AI Threats",
      value: "43",
      change: "+12",
      trend: "up",
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
  ] : [];

  const allStats = [...baseStats, ...linddunStats, ...maestroStats];

  const gridCols = config.linddunEnabled && config.maestroEnabled ? 'lg:grid-cols-6' : 
                  config.linddunEnabled || config.maestroEnabled ? 'lg:grid-cols-5' : 'lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
      {allStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.trend === 'up' ? 'text-status-success' : 'text-status-error'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
