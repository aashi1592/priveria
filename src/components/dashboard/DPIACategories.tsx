import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Eye, MapPin, Users, Briefcase, CreditCard, Navigation } from "lucide-react";

export const DPIACategories = () => {
  const categories = [
    {
      id: "CAT-01",
      name: "AI/ML Processing & Automated Decision-Making",
      icon: Brain,
      count: 34,
      highRisk: 8,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      id: "CAT-02",
      name: "Biometric Data Processing",
      icon: Eye,
      count: 12,
      highRisk: 5,
      color: "text-risk-high",
      bgColor: "bg-risk-high/10",
    },
    {
      id: "CAT-03",
      name: "Health & Medical Data",
      icon: Heart,
      count: 28,
      highRisk: 7,
      color: "text-status-error",
      bgColor: "bg-status-error/10",
    },
    {
      id: "CAT-04",
      name: "Large-Scale Systematic Monitoring",
      icon: Eye,
      count: 15,
      highRisk: 4,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      id: "CAT-05",
      name: "Children's Data Processing",
      icon: Users,
      count: 9,
      highRisk: 3,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "CAT-06",
      name: "Employee Monitoring & HR Analytics",
      icon: Briefcase,
      count: 22,
      highRisk: 2,
      color: "text-status-info",
      bgColor: "bg-status-info/10",
    },
    {
      id: "CAT-07",
      name: "Financial & Credit Data Processing",
      icon: CreditCard,
      count: 31,
      highRisk: 6,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
    {
      id: "CAT-08",
      name: "Location & Movement Tracking",
      icon: Navigation,
      count: 18,
      highRisk: 3,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      id: "CAT-09",
      name: "Employee Data Processing",
      icon: Users,
      count: 14,
      highRisk: 2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">DPIA Categories (9 of 18)</CardTitle>
          <Badge variant="secondary">261 Total Assessments</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
              >
                <CardContent className="p-4">
                  <div className={`${category.bgColor} ${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="mb-2 text-xs">
                    {category.id}
                  </Badge>
                  <h3 className="font-semibold text-sm text-foreground mb-3 line-clamp-2 h-10">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{category.count} DPIAs</span>
                    <Badge variant="destructive" className="text-xs">
                      {category.highRisk} High Risk
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
