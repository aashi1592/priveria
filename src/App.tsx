import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { lazy, Suspense } from "react";
const Index = lazy(() => import("./pages/Index"));
const Assessments = lazy(() => import("./pages/Assessments"));
const AIModule = lazy(() => import("./pages/AIModule"));
const ThirdParty = lazy(() => import("./pages/ThirdParty"));
const Reports = lazy(() => import("./pages/Reports"));
const RiskCalculator = lazy(() => import("./pages/RiskCalculator"));
const DPIAWizard = lazy(() => import("./pages/DPIAWizard"));
const Settings = lazy(() => import("./pages/Settings"));
const FeatureGuide = lazy(() => import("./pages/FeatureGuide"));
const DocumentAnalysis = lazy(() => import("./pages/DocumentAnalysis"));
const TeamCommunication = lazy(() => import("./pages/TeamCommunication"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
              <Suspense fallback={<div className="p-6">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/assessments" element={<Assessments />} />
                  <Route path="/ai-module" element={<AIModule />} />
                  <Route path="/third-party" element={<ThirdParty />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/risk-calculator" element={<RiskCalculator />} />
                  <Route path="/dpia-wizard" element={<DPIAWizard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/feature-guide" element={<FeatureGuide />} />
                  <Route path="/document-analysis" element={<DocumentAnalysis />} />
                  <Route path="/team-communication" element={<TeamCommunication />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
