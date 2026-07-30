import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listAssessmentsTool from "./tools/list-assessments";
import getAssessmentTool from "./tools/get-assessment";
import createAssessmentTool from "./tools/create-assessment";
import listVendorsTool from "./tools/list-vendors";
import summarizeRiskPostureTool from "./tools/summarize-risk-posture";
import syncAssessmentToOneTrustTool from "./tools/sync-assessment-to-onetrust";

// Issuer must be the direct Supabase host, built from the project ref literal.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "priveria",
  title: "priveria",
  version: "0.1.0",
  instructions:
    "Privacy governance tools for Priveria. Use `list_assessments` and `get_assessment` to read DPIA / AI risk assessments, `create_assessment` to start a new intake, `list_vendors` for third-party risk, `summarize_risk_posture` for a portfolio-level privacy risk snapshot, and `sync_assessment_to_onetrust` to push an assessment to OneTrust and get sync status plus field mapping results. All tools act as the signed-in Priveria user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listAssessmentsTool,
    getAssessmentTool,
    createAssessmentTool,
    listVendorsTool,
    summarizeRiskPostureTool,
    syncAssessmentToOneTrustTool,
  ],
});
