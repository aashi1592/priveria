import { Card } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export const DashboardStats = () => {
  const stats = [
    {
      label: "Total DPIAs",
      value: "247",
      change: "+12%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
    {
      label: "High Risk",
      value: "18",
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "text-risk-high",
      bgColor: "bg-risk-high/10",
    },
    {
      label: "Pending Reviews",
      value: "34",
      change: "+5",
      trend: "up",
      icon: Clock,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      label: "Compliance Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-status-info",
      bgColor: "bg-status-info/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
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
