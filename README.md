# Priveria Enterprise DPIA Framework-as-a-Service (DPIA-FaaS)

> Unified workflow for Data Protection Impact Assessments, vendor governance, and privacy compliance automation.

Priveria is an open-source privacy governance project built to make Data Protection Impact Assessments more operational, reusable, and threat-informed for AI systems, high-risk data processing, and emerging agentic workflows. At the core, it is a practitioner-built workflow for turning DPIAs from static compliance documents into a continuous governance capability.

Priveria helps privacy, security, and legal teams collaborate on DPIAs, monitor third-party risk, and keep policies audit-ready. The platform ships with modern UX, thoughtful defaults, and optional AI-powered workflows so teams of any size can roll out a repeatable privacy program.

## Core Problem:
Modern privacy risks does not stay still, but most DPIAs do.

Traditional DPIAs are often completed as one-time legal or compliance exercises. They are documented, stored, and rarely revisited in a meaningful way, even when the underlying system changes. That model is increasingly ineffective for AI systems, multi-vendor environments, and agentic workflows where data uses, model behavior, permissions, third-party tools, and risk exposure evolve continuously. Many organizations run DPIAs across a patchwork of tools such as OneTrust, Archer, ServiceNow, and spreadsheets on shared drives. Each system works in its lane, but none speak a shared language. Privacy risk quantification differs; templates vary, and board-level metrics lack consistency. As a result, it is difficult to produce a cohesive privacy risk view across data flows, AI systems, and business units. One team might label a risk as "high-risk" while another, using a different scoring model, calls the same scenario "acceptable". The enterprise ends up managing risks in pieces instead of patterns—a structural gap that creates reactive privacy governance instead of a resilient one.

Modern AI systems are fluid. Training data changes, model behavior evolves, and dependencies shift faster than traditional compliance framework can track. A single static assessment no longer reflects reality a month later. What's missing is a unifying layer that brings coherence to all this-a way to connect assessments, standardize risk logic, and shift privacy governance from paperwork to logic.




## Key Highlights

- **Streamlined DPIAs** – Guided assessments, reusable templates, and automated report generation.
- **Third-Party Oversight** – Track vendor inventories, risk scores, and review cadences in one place.
- **Compliance Dashboards** – Real-time view of mitigation tasks, control coverage, and policy status.
- **AI Assistance (optional)** – Draft impact statements, summarize evidence, and surface risk insights faster.
- **Enterprise-ready** – Role-based access, audit logs, and integrations with Supabase or Lovable Cloud.

---

## DPIA-as-a-Service (DPIA-FaaS)

Priveria reframes the DPIA from a one-time legal artifact into **continuous, reusable, threat-informed assessment infrastructure**. Instead of a document that ages the moment it's signed, a DPIA becomes a living object that:

- Re-evaluates when underlying data flows, model versions, vendors, or permissions change.
- Shares a common risk vocabulary across privacy, security, legal, and product teams.
- Plugs into existing GRC, AI governance, and threat-modeling workflows rather than replacing them.
- Produces machine-readable outputs (JSON, policy-as-code) that downstream systems and product teams can consume.

The goal is to shift privacy governance from **paperwork to logic** — a programmable layer that keeps assessments aligned with how modern AI and agentic systems actually evolve.

---

## Feature Overview

### Data Protection Impact Assessments
- Step-by-step assessment wizard with contextual guidance.
- **Multi-risk register** in the wizard — add multiple distinct risks, each with its own likelihood and impact, rolled into the overall DPIA score.
- Attach evidence, mitigation actions, and approvals to each DPIA.
- **Per-assessment DPIA report download** — each assessment card offers a one-click report in five formats targeting different audiences (board, regulator, EU AI Act auditor, internal technical, threat-register stakeholder share), downloadable as HTML, PDF, or Markdown.
- All assessment data persists in localStorage and survives page reloads.

### Third-Party Risk Management
- Maintain a living vendor catalogue with categories, data usage, and POC details.
- **Add, edit, and manage vendors** via a full CRUD interface — data persists across sessions.
- Visualize risk tiers, pending reviews, and compliance scores at a glance.
- Link vendors directly to real processing activities and trigger enhanced workflows for high-risk partners.
- Download a formatted vendor risk report per vendor.

### AI-assisted Compliance (Optional Module)
- Automated risk scoring suggestions and mitigation recommendations.
- Natural-language search across policies, DPIAs, and evidence.
- Draft-ready questionnaires and impact statements based on past assessments.

### Reporting & Dashboards
- Snapshot KPIs such as DPIA status, vendor health, and overall compliance.
- Five built-in export templates: EDPB regulator view, EU AI Act conformity, board brief, internal technical report, and threat-register stakeholder share.
- Each template available as **HTML** (styled, browser-ready), **PDF** (paginated), or **Markdown** (version-control friendly).
- Human-in-the-loop review panel with threat-register preview before export.
- Tailorable widgets so teams can focus on what matters most.

### Privacy Threat Modeling for AI
- Catalog privacy harms across the AI lifecycle: training data, model behavior, prompts, outputs, and downstream agent actions.
- **Contextual LINDDUN threat generation** — the wizard automatically generates threats specific to your processing activity (data categories, legal basis, cross-border transfers, third-party sharing) rather than generic placeholders.
- **Contextual MAESTRO threat generation** — agentic AI threats scale to your AI classification and autonomy settings (prompt injection, agent coordination failure, autonomous decision-making without oversight).
- Map threats to mitigations using familiar lenses (STRIDE, LINDDUN, MITRE ATLAS) adapted for privacy.
- Surface high-risk patterns such as memorization, re-identification, prompt injection leading to data exfiltration, and unintended profiling.

### Continuous DPIA Governance
- Trigger re-assessment automatically when system conditions change — new data sources, model upgrades, vendor swaps, or scope expansions.
- Maintain version history so reviewers can see what changed, when, and why.
- Convert assessments into policy-as-code artifacts that product and engineering teams can enforce in CI/CD.

### Agentic AI Coverage
- Assessment patterns built for autonomous, multi-step agent workflows where data context flows across tools, memory, and external APIs.
- Model permissions, tool-use boundaries, and delegated actions as first-class risk inputs.
- Capture emergent risks (chained tool calls, persistent memory, cross-session data reuse) that static DPIAs typically miss.
- **AI Module** connected to real assessments — systems are surfaced automatically from completed DPIAs where AI involvement was flagged, categorised by EU AI Act risk tier.

### Custom DPIA Calculator
- Transparent, configurable scoring engine — every weight, threshold, and tier is inspectable and editable.
- Standardize how risk is quantified across business units so "high risk" means the same thing everywhere.
- **Export scoring rationale** as a formatted report, or **pre-fill a new DPIA wizard** directly from the calculator results.
- Reset the calculator at any time to start a fresh scoring session.

---

## How Priveria Connects to Existing Tools

Priveria is designed to **complement, not replace**, the systems privacy and governance teams already run:

- **GRC platforms** (ServiceNow, Archer, OneTrust) — Priveria can feed standardized DPIA outputs and risk scores into existing GRC workflows.
- **Vendor risk platforms** — Sync vendor inventories and risk tiers to align third-party governance with DPIA findings.
- **AI governance frameworks** — Map assessments to **NIST AI RMF**, **ISO/IEC 42001**, **ISO/IEC 42005**, and **EU AI Act** control sets.
- **Threat modeling** — Reuse established lenses (**STRIDE**, **LINDDUN**, **MITRE ATLAS**) for privacy-specific threat enumeration.
- **Engineering workflows** — Emit policy-as-code (JSON / YAML) so product teams can enforce DPIA outcomes in their own pipelines.

---

## Who It Is For

- **Privacy engineers** building scalable, programmable privacy controls.
- **Data Protection Officers (DPOs)** who need defensible, continuously updated DPIAs.
- **AI governance leads** assessing model, agent, and pipeline risk.
- **Legal & compliance teams** aligning assessments to GDPR, the EU AI Act, and sector regulations.
- **Product privacy teams** embedding privacy review into the SDLC without slowing delivery.

---

## Use Cases

Priveria is designed around the real-world scenarios privacy and governance teams face daily:

| Use Case | What You Can Do | Key Features |
|----------|----------------|-------------|
| **AI System DPIA & EU AI Act Conformity** | Assess high-risk AI end-to-end and produce structured conformity evidence for Articles 9, 10, 13 and 53. | DPIA Wizard, Risk Calculator, Export Templates |
| **Agentic AI Governance** | Model multi-agent workflows, tool-use boundaries, permissions, and chain-of-action risks. | MAESTRO Framework, AI Module, Wizard |
| **Privacy Threat Modeling** | Enumerate privacy and adversarial threats across ML pipelines with STRIDE, LINDDUN, and MITRE ATLAS. | STRIDE (ML-adapted), LINDDUN, MITRE ATLAS, Threat Register |
| **Third-Party Risk & Vendor DPIA** | Maintain a living vendor catalogue, track certifications, and run vendor-specific DPIAs. | Third-Party Risk, Assessments, DPA Lifecycle |
| **Cross-Functional Collaboration** | Bring Privacy, Security, Engineering and Legal together with sign-offs and gated hand-offs. | Human-in-the-Loop Review, Team Communication, Policy-as-Code |
| **Regulator-Ready Exports** | Generate EDPB-aligned regulator views, EU AI Act packs, board briefs, and internal reports. | EDPB Template, EU AI Act Conformity, Board Brief, Stakeholder Share |
| **Continuous Privacy Governance** | Turn static DPIAs into living objects that re-evaluate when systems change. | Assessments, Version History, Settings |
| **Policy-as-Code Generation** | Convert finalized DPIA JSON into runtime-enforceable Rego or TypeScript policies. | Policy Generator, Team Communication, Review Panel |

---

## Regulatory Alignment

Priveria's assessment model is designed to support — and produce evidence for — major privacy and AI governance regimes:

- **GDPR Article 35** — DPIAs for high-risk processing, including profiling and large-scale processing of special category data.
- **EU AI Act** — Risk classification and conformity evidence for high-risk AI systems and general-purpose AI obligations.
- **NIST AI Risk Management Framework (AI RMF)** — Mapping to Govern, Map, Measure, and Manage functions.
- **ISO/IEC 42001** — Inputs for AI management system controls and continuous improvement loops.
- **ISO/IEC 42005** — Direct alignment with the AI system impact assessment standard, including scope, data, and stakeholder impact analysis for AI systems throughout their lifecycle.
- **ISO/IEC 27701** — Privacy information management alignment for organizations layering Priveria on existing ISMS programs.

---

## Quick Start

### Prerequisites
- Node.js 18 or newer (npm 9+)
- Git
- A Supabase project **or** Lovable Cloud account for persistence

### Installation
```bash
git clone https://github.com/aashi1592/priveria.git
cd priveria
npm install
cp .env.example .env
# Update .env with Supabase or Lovable Cloud credentials
npm run dev
```

Once the dev server is running, visit `http://127.0.0.1:5173/` in your browser to explore the app.

**Note:** This is a local development URL that only works on your machine. To customize the host/port, set `HOST` and `PORT` environment variables before running `npm run dev`.

---

## Documentation

- **[Installation Guide](docs/INSTALLATION.md)** — setup, backend options, and troubleshooting
- **[Architecture Overview](docs/ARCHITECTURE.md)** — system design and data flow
- **[UAT DPIA Platform](UAT_DPIA_Platform.md)** — user acceptance test scenarios

---

## Configuration

Create a `.env` file (copy `.env.example`) and provide the following variables:

```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_public_key

# Optional — enterprise features
VITE_ENTERPRISE_ENABLED=false
VITE_LICENSE_KEY=your_priveria_enterprise_license
VITE_ORGANIZATION_ID=your_organization_id

# Optional — AI (enterprise)
LOVABLE_API_KEY=your_lovable_ai_token

# Optional — GRC integrations
ONETRUST_API_KEY=your_onetrust_key
ONETRUST_ORG_ID=your_onetrust_org_id
```

See `.env.example` for the full list, including ServiceNow, Archer, and alternate AI providers.

---

## Project Structure

```text
priveria/
├── .github/
│   └── ISSUE_TEMPLATE/          # Bug report & feature request templates
├── config/
│   └── features.json            # Feature flags / module toggles
├── docs/
│   ├── ARCHITECTURE.md
│   └── INSTALLATION.md
├── public/                      # Static assets (Vite)
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── dashboard/             # KPIs, risk overview, compliance widgets
│   │   ├── document/              # Upload & analysis UI
│   │   ├── enterprise/            # License gates & upgrade prompts
│   │   ├── layout/                # App shell, sidebar, page headers
│   │   ├── reports/               # Export picker & review panel
│   │   ├── team-communication/    # DPIA-to-policy converter
│   │   ├── threat-modeling/       # Shareable threat register
│   │   ├── ui/                    # shadcn/ui primitives (button, dialog, …)
│   │   └── wizard/                # DPIA wizard steps (incl. multi-risk register)
│   ├── config/
│   │   └── features.ts            # Typed feature config loader
│   ├── contexts/
│   │   ├── AssessmentsContext.tsx
│   │   └── EnterpriseConfigContext.tsx
│   ├── data/
│   │   ├── mitreAtlas.ts          # MITRE ATLAS threat data
│   │   └── strideLenses.ts        # STRIDE / privacy lens definitions
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useReviewState.ts
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts          # Supabase browser client
│   │       └── types.ts           # Generated DB types
│   ├── lib/
│   │   ├── exportTemplates/
│   │   │   ├── edpbRegulator.ts
│   │   │   ├── euAiActConformity.ts
│   │   │   ├── boardBrief.ts
│   │   │   ├── internalTechnical.ts
│   │   │   ├── threatRegisterShare.ts
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── linddunEngine.ts       # Contextual LINDDUN threat generation
│   │   ├── maestroEngine.ts       # Contextual MAESTRO threat generation
│   │   ├── reportDownload.ts      # HTML / PDF / Markdown download utilities
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── test/
│   │   ├── assessments.test.ts
│   │   ├── featureFlags.test.ts
│   │   ├── riskScoring.test.ts
│   │   └── setup.ts
│   ├── types/
│   │   └── wizard.ts              # WizardFormData, LinddunThreat, MaestroThreat
│   ├── pages/                     # Route-level views
│   │   ├── Index.tsx              # Dashboard home
│   │   ├── DPIAWizard.tsx
│   │   ├── Assessments.tsx
│   │   ├── ThirdParty.tsx
│   │   ├── ThreatModeling.tsx
│   │   ├── RiskCalculator.tsx
│   │   ├── Reports.tsx
│   │   ├── DocumentAnalysis.tsx
│   │   ├── TeamCommunication.tsx
│   │   ├── AIModule.tsx
│   │   ├── Settings.tsx
│   │   ├── FeatureGuide.tsx
│   │   ├── Community.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   ├── analyze-document/      # Edge function: document analysis
│   │   ├── dpia-to-policy/        # Edge function: policy-as-code export
│   │   └── validate-license/      # Edge function: enterprise license check
│   └── migrations/                # SQL schema migrations
├── .env.example                   # Environment variable template
├── components.json                # shadcn/ui configuration
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── CONTRIBUTING.md
├── UAT_DPIA_Platform.md           # User acceptance test scenarios
├── LICENSE
└── README.md
```

---

## Available Scripts

- `npm run dev` – Start the Vite development server.
- `npm run build` – Produce an optimized production build.
- `npm run build:dev` – Build with development flags for profiling.
- `npm run preview` – Preview the production bundle locally.
- `npm run lint` – Run ESLint across the codebase.
- `npm run typecheck` – Run TypeScript type checking without emitting files.
- `npm run test` – Run the test suite (Vitest).
- `npm run test:coverage` – Run tests with coverage report (output to `coverage/`).

---

## Roadmap

- Automated DPIA scheduling and reminders.
- Expanded control libraries mapped to GDPR, ISO 27701, NIST, and more.
- Deeper integrations (ServiceNow, OneTrust, Archer).
- Additional AI copilots for questionnaire completion and vendor due diligence.

---

## How to Get Involved

Priveria is built in the open and grows through practitioner contributions. Ways to participate:

- **Open issues** — report bugs, request features, or propose new threat patterns and DPIA templates.
- **Submit pull requests** — improvements to the wizard, calculator, integrations, or documentation are all welcome.
- **Share threat patterns** — contribute reusable privacy threat models for AI, agentic, and high-risk processing scenarios.
- **Pilot Priveria** — try it on an internal DPIA backlog and share lessons learned (anonymized) so the community benefits.
- **Join the conversation** — use GitHub Discussions to debate scoring models, governance patterns, and roadmap priorities.

---

## Contributing

We welcome pull requests and issue reports! Please review `CONTRIBUTING.md` for coding standards, branching strategy, and review guidelines before submitting changes.

---

## Support & Community

- **Issues & Feature Requests** – Use the GitHub Issues tab to report bugs or propose enhancements.
- **Product Questions** – Start a discussion in GitHub Discussions or reach out to the maintainers.
- **Slack Community** – Join the conversation on [Slack](https://decodedbycounsel.slack.com/archives/C0B615QH2Q0) for real-time support and community discussion.
- **Security Concerns** – Email contactus@decodedbycounsel.com with details so we can investigate promptly.

---

## License

This project is released under the Apache License 2.0. See `LICENSE` for details.

