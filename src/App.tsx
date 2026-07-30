import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("./pages/Login"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));
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
const ThreatModeling = lazy(() => import("./pages/ThreatModeling"));
const Community = lazy(() => import("./pages/Community"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
            <Route path="/" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/assessments" element={<AppLayout><Assessments /></AppLayout>} />
            <Route path="/ai-module" element={<AppLayout><AIModule /></AppLayout>} />
            <Route path="/third-party" element={<AppLayout><ThirdParty /></AppLayout>} />
            <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
            <Route path="/risk-calculator" element={<AppLayout><RiskCalculator /></AppLayout>} />
            <Route path="/dpia-wizard" element={<AppLayout><DPIAWizard /></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            <Route path="/feature-guide" element={<AppLayout><FeatureGuide /></AppLayout>} />
            <Route path="/document-analysis" element={<AppLayout><DocumentAnalysis /></AppLayout>} />
            <Route path="/team-communication" element={<AppLayout><TeamCommunication /></AppLayout>} />
            <Route path="/threat-modeling" element={<AppLayout><ThreatModeling /></AppLayout>} />
            <Route path="/community" element={<AppLayout><Community /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
