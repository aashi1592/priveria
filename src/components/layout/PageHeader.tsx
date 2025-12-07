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
  children?: ReactNode;
}

export const PageHeader = ({ title, description, action, children }: PageHeaderProps) => {
  return (
    <header className="border-b border-border bg-gradient-primary sticky top-0 z-40 shadow-lg backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:text-white/80" />
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {description && (
                <p className="text-sm text-white/80 mt-1">{description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {children}
            {action && (
              <Button onClick={action.onClick} className="gap-2 bg-white text-primary hover:bg-white/90">
                {action.icon}
                {action.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
