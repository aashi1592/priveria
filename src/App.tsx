import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedLayout><Index /></ProtectedLayout>} />
              <Route path="/assessments" element={<ProtectedLayout><Assessments /></ProtectedLayout>} />
              <Route path="/ai-module" element={<ProtectedLayout><AIModule /></ProtectedLayout>} />
              <Route path="/third-party" element={<ProtectedLayout><ThirdParty /></ProtectedLayout>} />
              <Route path="/reports" element={<ProtectedLayout><Reports /></ProtectedLayout>} />
              <Route path="/risk-calculator" element={<ProtectedLayout><RiskCalculator /></ProtectedLayout>} />
              <Route path="/dpia-wizard" element={<ProtectedLayout><DPIAWizard /></ProtectedLayout>} />
              <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
              <Route path="/feature-guide" element={<ProtectedLayout><FeatureGuide /></ProtectedLayout>} />
              <Route path="/document-analysis" element={<ProtectedLayout><DocumentAnalysis /></ProtectedLayout>} />
              <Route path="/team-communication" element={<ProtectedLayout><TeamCommunication /></ProtectedLayout>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
