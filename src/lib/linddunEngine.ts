/**
 * Rule-based LINDDUN threat generation.
 * Produces context-specific threats from wizard form data (Step 1–4 fields).
 * No AI call required — each threat maps deterministically to the data categories,
 * legal basis, processing type, and AI involvement captured in the wizard.
 */

import type { LinddunThreat } from "@/types/wizard";

type WizardSnapshot = {
  activityName?: string;
  categories?: string[];
  processingType?: string;
  legalBasis?: string;
  dataCategories?: string[];
  dataSubjects?: string;
  aiInvolved?: boolean;
  crossBorderTransfers?: boolean;
  thirdPartySharing?: boolean;
};

let idCounter = 1;

function threat(
  category: LinddunThreat["category"],
  name: string,
  description: string,
  scenario: string,
  likelihood: string,
  impact: string,
  riskLevel: string,
  affectedData: string[],
  mitigations: string[],
  confidence = 88
): LinddunThreat {
  return {
    id: idCounter++,
    category,
    name,
    description,
    scenario,
    likelihood,
    impact,
    riskLevel,
    ruleConfidence: confidence,
    validated: false,
    affectedData,
    mitigations,
  };
}

export function generateLinddunThreats(snapshot: WizardSnapshot): LinddunThreat[] {
  idCounter = 1;
  const threats: LinddunThreat[] = [];
  const cats = snapshot.dataCategories ?? [];
  const isVendor = snapshot.processingType === "Vendor";
  const hasAI = snapshot.aiInvolved === true;
  const hasCrossBorder = snapshot.crossBorderTransfers === true;
  const hasThirdParty = snapshot.thirdPartySharing === true || isVendor;
  const activityLabel = snapshot.activityName ?? "this processing activity";

  // ── Linkability ──────────────────────────────────────────────────────────────
  threats.push(
    threat(
      "linkability",
      `Cross-Context Profiling — ${activityLabel}`,
      "Data from multiple sources can be linked to create detailed user profiles beyond the stated purpose.",
      `${activityLabel} processes ${cats.length > 0 ? cats.slice(0, 2).join(" and ") : "personal data"} which can be combined with data from other systems to build behavioral profiles not disclosed to data subjects.`,
      "High", "Medium", "High",
      cats.length > 0 ? cats.slice(0, 3) : ["Personal data"],
      [
        "Enforce purpose limitation — block cross-system data joins not in the privacy notice",
        "Use pseudonymous identifiers scoped to this processing activity",
        "Implement data minimisation: collect only fields required for the stated purpose",
      ],
      90
    )
  );

  if (hasThirdParty) {
    threats.push(
      threat(
        "linkability",
        "Third-Party Data Re-linking",
        "Shared data can be re-linked by third-party processors with their own datasets.",
        `Data shared with ${isVendor ? "vendor systems" : "third parties"} under ${activityLabel} may be combined with their existing customer datasets, creating linkages not authorised by data subjects.`,
        "Medium", "High", "High",
        cats.length > 0 ? cats : ["Personal identifiers"],
        [
          "Contractually restrict third-party data reuse to the documented purpose",
          "Share only derived/aggregated attributes where possible",
          "Audit third-party data usage quarterly",
        ],
        85
      )
    );
  }

  // ── Identifiability ──────────────────────────────────────────────────────────
  threats.push(
    threat(
      "identifiability",
      "Quasi-Identifier Re-identification",
      "Combination of indirect attributes allows re-identification of individuals thought to be anonymous.",
      `${activityLabel} retains fields such as ${cats.slice(0, 2).join(", ") || "demographics and behavioural data"} which, when combined, can uniquely identify individuals (research shows 3 attributes suffice for 87% of populations).`,
      "Medium", "High", "High",
      cats.length > 0 ? cats : ["Demographic data", "Behavioural data"],
      [
        "Apply k-anonymity (k ≥ 5) before any analytical output",
        "Generalise quasi-identifiers (e.g. age ranges, 3-digit postcodes)",
        "Implement differential privacy for aggregate statistics",
      ],
      92
    )
  );

  if (hasAI) {
    threats.push(
      threat(
        "identifiability",
        "AI Model Inversion — Identity Leak",
        "Machine learning models trained on personal data can leak individual training examples.",
        `The AI system in ${activityLabel} may be vulnerable to model inversion or membership inference attacks, enabling adversaries to reconstruct or identify individuals from model outputs.`,
        "Medium", "High", "High",
        ["AI training data", "Model outputs"],
        [
          "Apply differential privacy during model training",
          "Rate-limit and monitor model inference endpoints",
          "Conduct membership inference red-teaming before deployment",
        ],
        87
      )
    );
  }

  // ── Non-repudiation ──────────────────────────────────────────────────────────
  threats.push(
    threat(
      "nonrepudiation",
      "Immutable Audit Trail Exposes User Actions",
      "Permanent audit logs prevent users from correcting or erasing records of their past behaviour.",
      `${activityLabel} creates timestamped logs of user actions that cannot be modified or deleted. This conflicts with the GDPR right to erasure (Art. 17) and may be used as evidence against users in unforeseen contexts.`,
      "Medium", "Medium", "Medium",
      ["Activity logs", "Audit records"],
      [
        "Distinguish operational security logs (retain) from behavioural logs (erasable)",
        "Implement log pseudonymisation with a separate key store",
        "Define retention periods per log category and automate deletion",
      ],
      80
    )
  );

  // ── Detectability ────────────────────────────────────────────────────────────
  threats.push(
    threat(
      "detectability",
      "Data Presence Inference via API Timing",
      "API response time differences reveal whether a record exists for a given data subject.",
      `Unauthenticated timing side-channels in ${activityLabel}'s APIs allow an attacker to infer whether a specific person's data is present in the system without direct access.`,
      "Low", "Medium", "Medium",
      ["API responses", "System metadata"],
      [
        "Add uniform response delays to sensitive lookup endpoints",
        "Return identical responses for found/not-found cases (constant-time responses)",
        "Monitor for enumeration attack patterns in access logs",
      ],
      75
    )
  );

  // ── Disclosure ───────────────────────────────────────────────────────────────
  if (cats.includes("health") || cats.includes("Health & Medical") || cats.includes("CAT-03")) {
    threats.push(
      threat(
        "disclosure",
        "Sensitive Health Data Over-exposure",
        "Health or medical data is exposed beyond the minimum necessary scope.",
        `${activityLabel} processes health-related data. Inadequate access controls or verbose API responses may expose this special-category data (GDPR Art. 9) to unauthorised parties.`,
        "High", "High", "High",
        ["Health data", "Medical records"],
        [
          "Apply field-level encryption for health attributes",
          "Restrict access with role-based controls (need-to-know only)",
          "Mask health fields in logs, analytics, and non-clinical views",
        ],
        94
      )
    );
  } else {
    threats.push(
      threat(
        "disclosure",
        "Excessive API Data Exposure",
        "API responses return more personal data fields than the requesting party requires.",
        `REST or GraphQL endpoints in ${activityLabel} return full data objects. Clients receive fields not needed for their function, increasing the blast radius of any client-side breach.`,
        "High", "Medium", "High",
        cats.length > 0 ? cats : ["Personal identifiers", "Profile data"],
        [
          "Implement field-level response filtering per client role",
          "Adopt a projection pattern — clients explicitly request only needed fields",
          "Conduct quarterly API security reviews",
        ],
        91
      )
    );
  }

  if (hasCrossBorder) {
    threats.push(
      threat(
        "disclosure",
        "Cross-Border Transfer Without Adequate Safeguards",
        "Data transferred to non-adequate jurisdictions may be disclosed to foreign authorities.",
        `${activityLabel} involves cross-border transfers. Without adequate SCCs, BCRs, or adequacy decisions, data may be subject to foreign surveillance laws incompatible with GDPR obligations.`,
        "High", "High", "High",
        cats.length > 0 ? cats : ["All transferred data"],
        [
          "Document the legal transfer mechanism (SCCs, BCRs, adequacy decision) in the DPIA",
          "Conduct a Transfer Impact Assessment (TIA) per EDPB guidance",
          "Encrypt data in transit and at rest with keys held in the EEA",
        ],
        89
      )
    );
  }

  // ── Unawareness ───────────────────────────────────────────────────────────────
  threats.push(
    threat(
      "unawareness",
      "Inadequate Transparency — Users Unaware of Processing",
      "Data subjects lack clear, accessible information about how their data is used.",
      `${activityLabel} may not provide granular transparency. Privacy notices may be buried in terms-of-service, use legal jargon, or fail to describe ${hasAI ? "automated decision-making" : "all processing purposes"} in plain language.`,
      "High", "Medium", "Medium",
      ["All personal data"],
      [
        "Implement just-in-time notices at the point of data collection",
        "Provide a layered privacy notice (short summary + full detail)",
        hasAI
          ? "Disclose AI/automated decision-making explicitly per GDPR Art. 22"
          : "Review and simplify privacy notice language annually",
        "Offer a self-service privacy dashboard for data subjects",
      ],
      88
    )
  );

  if (snapshot.legalBasis === "consent") {
    threats.push(
      threat(
        "unawareness",
        "Consent Obtained Without Genuine Choice",
        "Bundled or pre-ticked consent does not reflect freely given, specific, informed consent.",
        `${activityLabel} relies on consent as the legal basis. If consent is bundled with terms-of-service, pre-ticked, or required for core service access, it fails GDPR validity requirements (Art. 7).`,
        "High", "High", "High",
        ["Consent records"],
        [
          "Separate consent for each distinct processing purpose",
          "Ensure refusal does not block access to non-related services",
          "Implement granular consent management with easy withdrawal",
          "Record consent timestamps, scope, and version for auditability",
        ],
        93
      )
    );
  }

  // ── Non-compliance ────────────────────────────────────────────────────────────
  threats.push(
    threat(
      "noncompliance",
      "Missing or Outdated Retention Schedule",
      "Personal data retained beyond the necessary period, violating storage limitation.",
      `${activityLabel} lacks documented, automated retention schedules. Data accumulates indefinitely, breaching GDPR Art. 5(1)(e) and increasing the organisation's data breach exposure surface.`,
      "High", "Medium", "Medium",
      cats.length > 0 ? cats : ["All personal data"],
      [
        "Define a retention period for every data category processed",
        "Implement automated deletion or anonymisation at period end",
        "Schedule annual retention policy reviews",
        "Document retention justifications in the Record of Processing Activities (ROPA)",
      ],
      91
    )
  );

  if (snapshot.legalBasis === "legitimate-interest" || !snapshot.legalBasis) {
    threats.push(
      threat(
        "noncompliance",
        "Legitimate Interest Assessment Not Documented",
        "Processing under legitimate interest without a documented balancing test is non-compliant.",
        `${activityLabel} relies on legitimate interest (GDPR Art. 6(1)(f)) but may lack a formal Legitimate Interest Assessment (LIA) balancing the controller's interests against data subject rights.`,
        "Medium", "High", "High",
        ["Processing records"],
        [
          "Conduct and document a formal LIA before processing commences",
          "Implement a clear opt-out mechanism for data subjects",
          "Review the LIA when processing scope or context changes",
        ],
        86
      )
    );
  }

  return threats;
}
