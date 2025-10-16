import { Button } from "@/components/ui/button";
import { Shield, LayoutDashboard, FolderKanban, Brain, Users, FileText, Settings } from "lucide-react";

interface DashboardHeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const DashboardHeader = ({ activeView, setActiveView }: DashboardHeaderProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "assessments", label: "Assessments", icon: FolderKanban },
    { id: "ai-module", label: "AI Module", icon: Brain },
    { id: "third-party", label: "Third Party", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DPIA Framework</h1>
              <p className="text-xs text-muted-foreground">Enterprise Risk Management</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView(item.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
            New Assessment
          </Button>
        </div>
      </div>
    </header>
  );
};
