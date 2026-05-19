## Plan: STRIDE + MITRE ATLAS, Export Templates, Collaboration Checkpoint

**Guarantee: no existing feature is modified.** MAESTRO (WizardStep7), LINDDUN (WizardStep6), the DPIA Wizard, Assessments, Policy Generator, Document Analysis, and Team Communication all remain exactly as they are. All work below is additive.

---

### 1. STRIDE + MITRE ATLAS — new page `/threat-modeling`

New sidebar item "Threat Modeling" (Target icon), new route in `App.tsx`.

- **STRIDE lens** — Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Each card reframed for AI/ML pipelines (training data, model APIs, inference endpoints) with: definition, AI-specific example, suggested control.
- **MITRE ATLAS lens** — adversarial-ML tactics (Reconnaissance, Resource Development, Initial Access, ML Model Access, Execution, Persistence, Defense Evasion, Discovery, Collection, ML Attack Staging, Exfiltration, Impact) with representative techniques (evasion, extraction, poisoning, membership inference).
- Tabs to switch lenses. "Add to assessment" attaches selected threats to a per-assessment threat register stored in localStorage.
- Static data: `src/data/strideLenses.ts`, `src/data/mitreAtlas.ts`. No backend.

This complements (does not replace) MAESTRO and LINDDUN, which stay in the wizard.

---

### 2. Export templates — new page `/reports/templates`

Linked from the existing Reports page via a new "Templates" button. The existing Reports content is not altered.

Four templates, each a pure `(assessment) => string` function in `src/lib/exportTemplates/`:

- **Regulator View — EDPB DPIA Template** (latest): structured per WP248 rev.01 (systematic description, necessity & proportionality, risks to rights and freedoms, measures envisaged, sign-off) and aligned to EDPB Opinion 28/2024 on AI models. Output: Markdown + printable HTML + `.md` download.
- **EU AI Act Conformity Pack**: Articles 9 / 10 / 13 / 53 mapped to Priveria-produced evidence.
- **Board Brief (1-pager)**: risk tier, top threats, residual risk, decision required.
- **Internal Technical Report**: full threat register (STRIDE + ATLAS + LINDDUN + MAESTRO if present) + controls + re-trigger events.

Downloads via `Blob`. No backend, no migrations.

---

### 3. Collaboration checkpoint — between report generation and policy-as-code

Inserted on the existing Reports page as a new component, BEFORE the handoff to the Policy Generator. The existing report generation flow is wrapped, not modified.

`ReportReviewPanel` provides, inside the same document:

- **Holistic view** — side-by-side panes: assessment summary, threat register, draft controls, regulator-view preview. Single scrollable surface so reviewers see the whole picture in one place.
- **Reviewer sign-offs** — Privacy, Security, Engineering, Legal. Each captures name + role + timestamp.
- **Inline comments** — per-section comment threads.
- **Human-in-the-loop gate** — "Proceed to Policy-as-Code" is disabled until Privacy + at least one of (Security / Engineering / Legal) have signed off.
- **Status badge** on Reports page: Pending → In Review → Approved.

State persisted in localStorage keyed by assessment id via `useReviewState` hook. No DB changes.

---

### Files

**New**
- `src/pages/ThreatModeling.tsx`
- `src/data/strideLenses.ts`, `src/data/mitreAtlas.ts`
- `src/lib/exportTemplates/{edpbRegulator,euAiActConformity,boardBrief,internalTechnical,index}.ts`
- `src/components/reports/ExportTemplatePicker.tsx`
- `src/components/reports/ReportReviewPanel.tsx`
- `src/hooks/useReviewState.ts`

**Edited (additive only — no existing JSX removed)**
- `src/App.tsx` — register `/threat-modeling` route
- `src/components/layout/AppSidebar.tsx` — one new nav item
- `src/pages/Reports.tsx` — mount `ExportTemplatePicker` and `ReportReviewPanel` alongside existing content

### Explicitly out of scope
- No edits to `DPIAWizard.tsx` or any `WizardStep*.tsx` (MAESTRO + LINDDUN preserved).
- No edits to Assessments, Policy Generator, Document Analysis, Team Communication.
- No DB migrations, no edge functions, no auth changes.
- EDPB template follows the public WP248 rev.01 structure and EDPB Opinion 28/2024 guidance — not a verbatim copy.
