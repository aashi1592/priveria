import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
          {action && (
            <Button onClick={action.onClick} className="gap-2">
              {action.icon}
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
