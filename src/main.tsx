import { StrictMode, Component, ErrorInfo, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { EnterpriseConfigProvider } from "./contexts/EnterpriseConfigContext";
import { AssessmentsProvider } from "./contexts/AssessmentsContext";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Unhandled error:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">{(this.state.error as Error).message}</p>
            <button className="underline text-sm" onClick={() => this.setState({ error: null })}>
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <EnterpriseConfigProvider>
          <AssessmentsProvider>
            <App />
          </AssessmentsProvider>
        </EnterpriseConfigProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
