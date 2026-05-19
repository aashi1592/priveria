export interface StrideEntry {
  id: string;
  category: string;
  definition: string;
  aiExample: string;
  control: string;
}

export const strideEntries: StrideEntry[] = [
  {
    id: "S",
    category: "Spoofing",
    definition: "An attacker impersonates a legitimate identity, service, or model endpoint.",
    aiExample: "Adversary publishes a look-alike model on a public hub; downstream pipeline pulls the malicious checkpoint.",
    control: "Signed model artifacts, registry allow-lists, mutual TLS between inference services.",
  },
  {
    id: "T",
    category: "Tampering",
    definition: "Unauthorized modification of data, model weights, prompts, or pipeline code.",
    aiExample: "Training data poisoning that biases a fraud-detection model toward a specific cohort.",
    control: "Dataset hashing, immutable feature stores, code & weight provenance via SLSA.",
  },
  {
    id: "R",
    category: "Repudiation",
    definition: "Users or systems deny actions because logging is missing or untrusted.",
    aiExample: "No audit trail of which prompts produced a decision the data subject is now contesting.",
    control: "Tamper-evident prompt/response logs, signed inference receipts, retention aligned to DPIA.",
  },
  {
    id: "I",
    category: "Information Disclosure",
    definition: "Sensitive data is exposed beyond its intended audience or purpose.",
    aiExample: "Model memorizes PII and emits it via crafted prompts (training data leakage).",
    control: "DP-SGD, output filters, red-team prompt suites, scoped retrieval contexts.",
  },
  {
    id: "D",
    category: "Denial of Service",
    definition: "Availability of the model or data pipeline is degraded.",
    aiExample: "Token-amplification attack on an LLM endpoint exhausts GPU budget for legitimate users.",
    control: "Per-tenant rate limits, max-token caps, anomaly detection on cost/latency.",
  },
  {
    id: "E",
    category: "Elevation of Privilege",
    definition: "Actor gains rights they should not have, across users, tenants, or system layers.",
    aiExample: "Prompt injection causes an agent to call an admin tool the calling user cannot invoke directly.",
    control: "Tool allow-lists per role, capability tokens, deny-by-default agent action policies.",
  },
];
