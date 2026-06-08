export interface AtlasTactic {
  id: string;
  tactic: string;
  description: string;
  techniques: string[];
}

export const atlasTactics: AtlasTactic[] = [
  {
    id: "AML.TA0002",
    tactic: "Reconnaissance",
    description: "Gathering information about the target ML system, datasets, and deployment.",
    techniques: ["Search victim-owned websites", "Search application repositories", "Active scanning"],
  },
  {
    id: "AML.TA0003",
    tactic: "Resource Development",
    description: "Establishing infrastructure or capabilities used to attack ML systems.",
    techniques: ["Acquire public ML artifacts", "Develop adversarial ML attack capabilities", "Obtain capabilities"],
  },
  {
    id: "AML.TA0004",
    tactic: "Initial Access",
    description: "Gaining a foothold in the ML environment.",
    techniques: ["ML supply chain compromise", "Valid accounts", "Phishing"],
  },
  {
    id: "AML.TA0000",
    tactic: "ML Model Access",
    description: "Obtaining query or weights access to a target model.",
    techniques: ["Inference API access", "Physical environment access", "Full model access"],
  },
  {
    id: "AML.TA0005",
    tactic: "Execution",
    description: "Running adversarial code or payloads inside the ML system.",
    techniques: ["User execution", "Command and scripting interpreter", "LLM prompt injection"],
  },
  {
    id: "AML.TA0006",
    tactic: "Persistence",
    description: "Maintaining a foothold across retrains or restarts.",
    techniques: ["Poison training data", "Backdoor ML model", "LLM persistence via tools"],
  },
  {
    id: "AML.TA0007",
    tactic: "Defense Evasion",
    description: "Avoiding detection by monitoring, classifiers, or guardrails.",
    techniques: ["Evade ML model", "LLM jailbreak", "Masquerading"],
  },
  {
    id: "AML.TA0008",
    tactic: "Discovery",
    description: "Learning the structure and capabilities of the ML environment.",
    techniques: ["Discover ML model family", "Discover ML artifacts", "Discover LLM system prompt"],
  },
  {
    id: "AML.TA0009",
    tactic: "Collection",
    description: "Gathering data of interest from the ML system.",
    techniques: ["ML artifact collection", "Data from information repositories"],
  },
  {
    id: "AML.TA0001",
    tactic: "ML Attack Staging",
    description: "Preparing the adversarial attack against the deployed model.",
    techniques: ["Create proxy ML model", "Craft adversarial data", "Verify attack"],
  },
  {
    id: "AML.TA0010",
    tactic: "Exfiltration",
    description: "Stealing model weights, training data, or intellectual property.",
    techniques: ["Exfiltration via ML inference API", "Extract ML model", "LLM data leakage"],
  },
  {
    id: "AML.TA0011",
    tactic: "Impact",
    description: "Disrupting, denying, or eroding trust in the ML system.",
    techniques: ["Evade ML model", "Denial of ML service", "Spamming ML system with chaff data", "Erode ML model integrity"],
  },
];
