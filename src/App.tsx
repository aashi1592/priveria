import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Index from "./pages/Index";
import Assessments from "./pages/Assessments";
import AIModule from "./pages/AIModule";
import ThirdParty from "./pages/ThirdParty";
import Reports from "./pages/Reports";
import RiskCalculator from "./pages/RiskCalculator";
import DPIAWizard from "./pages/DPIAWizard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/ai-module" element={<AIModule />} />
                <Route path="/third-party" element={<ThirdParty />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/risk-calculator" element={<RiskCalculator />} />
                <Route path="/dpia-wizard" element={<DPIAWizard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
