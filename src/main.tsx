import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { EnterpriseConfigProvider } from "./contexts/EnterpriseConfigContext";
import { AssessmentsProvider } from "./contexts/AssessmentsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EnterpriseConfigProvider>
      <AssessmentsProvider>
        <App />
      </AssessmentsProvider>
    </EnterpriseConfigProvider>
  </StrictMode>
);
