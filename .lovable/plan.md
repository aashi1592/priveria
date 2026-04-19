
## Plan: Augment README with brief content (preserve existing prose)

The user wants additions from `priveria_brief.docx` without altering what's already in the README. I'll add new sections after the existing content, leaving lines 1-18 (intro + Core Problem) and the existing structure untouched.

### Additions to the README

**1. New section after "Key Highlights" (or after Feature Overview): "DPIA-as-a-Service (DPIA-FaaS)"**
A short subsection introducing the DPIA-FaaS conceptual model from the brief — framing Priveria as continuous, reusable, and threat-informed assessment infrastructure (not a static doc).

**2. Expand "Feature Overview" with new module subsections** (appended; existing four subsections untouched):
- **Privacy Threat Modeling for AI** — harms across training data, model behavior, prompts, outputs, and agent actions.
- **Continuous DPIA Governance** — DPIAs that re-evaluate and re-trigger when system conditions, data flows, or model versions change.
- **Agentic AI Coverage** — assessment patterns for autonomous, multi-step agent workflows.
- **Custom DPIA Calculator** — transparent, configurable scoring engine.

**3. New section: "How Priveria Connects to Existing Tools"**
Positions Priveria alongside (not replacing) GRC, vendor risk platforms, AI governance frameworks (NIST AI RMF, ISO/IEC 42001, EU AI Act), and threat modeling (STRIDE, LINDDUN, MITRE ATLAS).

**4. New section: "Who It Is For"**
Bulleted list: Privacy engineers, DPOs, AI governance leads, legal/compliance teams, product privacy teams.

**5. New section: "Regulatory Alignment"**
Bullets covering GDPR Art. 35, EU AI Act, NIST AI RMF, ISO/IEC 42001.

**6. New section: "How to Get Involved"** (placed before/near Contributing)
Encourage issues, PRs, threat-pattern proposals, pilots on internal DPIA backlogs.

### What stays unchanged
- Title, tagline, intro paragraphs (lines 1-7)
- Core Problem section (lines 9-14)
- Existing Key Highlights bullets
- Existing Feature Overview subsections (DPIA / Third-Party / AI-assisted / Reporting)
- Quick Start, Configuration, Project Structure, Scripts, Roadmap, Contributing, Support, License

### What is intentionally NOT added
The EB-1A petition content (Section 2 of brief) — it's personal evidentiary material, not appropriate for a public OSS README. I'll skip it unless you say otherwise.

### Technical notes
- Single edit to `README.md` using `code--line_replace` to insert new sections at appropriate boundaries.
- No code changes, no dependencies, no migrations.
