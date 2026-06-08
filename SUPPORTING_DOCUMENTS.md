# Supporting Documents Checklist

**For Contributors, Reviewers, and Project Management**

This guide explains what supporting documents and artifacts should accompany code changes, features, and major contributions to ensure quality, clarity, and maintainability.

---

## Table of Contents

1. [Code Changes](#code-changes)
2. [New Features](#new-features)
3. [Bug Fixes](#bug-fixes)
4. [Database Changes](#database-changes)
5. [Documentation Updates](#documentation-updates)
6. [Release Artifacts](#release-artifacts)
7. [Community Contributions](#community-contributions)

---

## Code Changes

### All Pull Requests Must Include

**Minimum (non-negotiable):**
- [ ] PR title: Clear and descriptive (e.g., "feat: Add multi-risk register to DPIA wizard")
- [ ] PR description: What changed and why
- [ ] Link to related issue (if applicable)
- [ ] Testing evidence: "Tested locally at http://localhost:5173"

**Example PR Description:**
```markdown
## What Changed
Updated the DPIA Wizard to allow multiple risk entries per assessment, 
enabling users to break down complex risks into component parts.

## Why
Previously, assessments could only have one overall risk. This limited 
nuance in risk analysis for complex systems. Users requested ability to 
track multiple distinct risks with separate mitigation plans.

## Testing Done
- [x] Created 3 test assessments with 2-5 risks each
- [x] Verified multi-risk PDF export includes all risks
- [x] Tested risk calculator with different combinations
- [x] Checked mobile view on iPhone 12
- [x] No errors in console

## Files Changed
- src/pages/DPIAWizard.tsx — Added risk entry form and state
- src/lib/riskCalculator.ts — Updated scoring logic for multiple risks
- src/components/wizard/RiskForm.tsx — New component for risk entry
- docs/ARCHITECTURE.md — Updated to reflect new data model

## Related Issue
Closes #42 (User requested multi-risk assessment)
```

### Code Review Criteria

**Reviewers check for:**
- [ ] Does code follow project style (see src/ examples)?
- [ ] Are variable names clear and descriptive?
- [ ] Is error handling included (try/catch where appropriate)?
- [ ] Are there console.log statements left behind?
- [ ] Does TypeScript have no @ts-ignore directives?
- [ ] Are new dependencies necessary?

**Example Review Comment:**
```
// Comment on code
```
"This function is doing too much. Can you split it into:
1. validateInput()
2. fetchData()
3. transformData()

Also, what happens if the API call fails? Should we catch that?"

---

## New Features

### Feature Requirements Checklist

Before starting development:
- [ ] **Issue opened** — Describe what users need and why
- [ ] **Design doc** (if complex) — Sketch of how it will work
- [ ] **Acceptance criteria** — How we'll know it's done
- [ ] **Estimate** — Rough hours/days

### Feature PR Must Include

**Documentation:**
- [ ] `FEATURE_GUIDE.md` updated with new feature description
- [ ] `PROJECT_STRUCTURE.md` updated if folder/file structure changed
- [ ] In-code comments for non-obvious logic
- [ ] Example usage or screenshot if UI feature

**Testing:**
- [ ] Unit tests added (if complex logic)
- [ ] Manual testing walkthrough in PR comments
- [ ] Edge cases tested (empty states, errors, large datasets)
- [ ] Mobile view verified

**User Documentation:**
- [ ] Feature is explained in README or FEATURE_GUIDE.md
- [ ] If feature flag exists, toggle is documented in config/features.json
- [ ] Example workflows provided
- [ ] Known limitations listed

### Example Feature Contribution

**Feature: Threat Modeling Templates**

**PR Description:**
```markdown
## Feature: Threat Modeling Templates Library

### What
Users can now choose from 5 pre-built threat templates:
- STRIDE (Security)
- LINDDUN (Privacy)
- OWASP Top 10
- ATLAS (AI/ML)
- Custom blank template

### Why
Users requested faster threat identification without building from scratch. 
Templates reduce cognitive load and ensure consistent threat coverage.

### Files Changed
- src/pages/ThreatModeling.tsx — Template selection UI
- src/data/threatTemplates.ts — Template definitions
- src/lib/threatModelingEngine.ts — Template loading logic
- docs/ARCHITECTURE.md — Updated threat modeling section
- FEATURE_GUIDE.md — Added templates section

### Screenshots
[Include before/after screenshots if UI change]

### Testing Walkthrough
1. Go to Threat Modeling page
2. Click "Choose Template"
3. Select "LINDDUN Privacy"
4. Verify all 7 threat categories load
5. Add threat, export PDF, verify export includes template

### Known Limitations
- Custom templates not yet saveable (future feature)
- Only English templates currently (i18n coming Q3)
```

---

## Bug Fixes

### Bug Report Checklist

When reporting bugs, include:

**Title:** "BUG: [area] - [what's broken]"  
Example: "BUG: Export - PDF missing vendor names"

**Description:**
```markdown
## What Happened
When exporting an assessment with 5 vendors to PDF, vendor names don't appear 
in the "Third-Party Processors" section. The section is present but empty.

## Expected
Vendor names should be listed with risk scores.

## Steps to Reproduce
1. Create assessment with title "Test"
2. Add 2 vendors: "Acme Corp" and "Beta Inc"
3. Link vendors to assessment
4. Export to PDF (Board Brief template)
5. Check PDF page 3 — vendors section is empty

## Environment
- Browser: Chrome 126.0
- OS: macOS 14.5
- App version: 1.0.0

## Screenshots
[Include screenshot of the problem]

## Possible Cause
Might be related to vendor object structure change in last update
```

### Fix PR Requirements

**For any bug fix:**
- [ ] Link to bug report issue
- [ ] Root cause explained in PR description
- [ ] Fix verified to solve the issue
- [ ] Check if this affects other areas
- [ ] Add comment in code if the fix is non-obvious

**Example Fix PR:**
```markdown
## Fix: PDF export missing vendor names

### Root Cause
When vendors were refactored to use new data structure (separate 
vendor_id and vendor_data fields), the PDF template wasn't updated 
to use the new vendor_data field.

### The Fix
Updated `src/lib/exportTemplates/boardBrief.ts` line 87 to:
```tsx
// Before
vendor.name

// After
vendor.vendor_data?.name || vendor.name
```

### Testing
- [x] Reproduced original bug
- [x] Applied fix
- [x] Exported with 5 vendors — all names now appear
- [x] Exported without vendors — no errors
- [x] Tested other export templates — all work
```

---

## Database Changes

### Database Schema Updates

**Before making changes:**
- [ ] Document current schema in ARCHITECTURE.md
- [ ] Explain why change is needed
- [ ] Plan migration path for existing data
- [ ] Consider backwards compatibility

### Migration File Checklist

Every database change needs a migration file in `supabase/migrations/`:

**File naming:** `TIMESTAMP_descriptive_name.sql`  
Example: `20260608_add_vendor_certifications_table.sql`

**Migration content:**
```sql
-- Migration: Add vendor certifications tracking
-- Date: 2026-06-08
-- Author: [Your Name]
-- Reason: Track which certifications each vendor has (SOC 2, ISO27001, etc)

-- Create new table
CREATE TABLE vendor_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_cert_per_vendor UNIQUE(vendor_id, certification_name)
);

-- Enable RLS (Row Level Security)
ALTER TABLE vendor_certifications ENABLE ROW LEVEL SECURITY;

-- Add index for performance
CREATE INDEX idx_vendor_certifications_vendor_id 
  ON vendor_certifications(vendor_id);

-- Add audit trigger
CREATE TRIGGER vendor_certifications_updated_at
  BEFORE UPDATE ON vendor_certifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Rollback script (save for emergency)
-- DROP TABLE vendor_certifications;
```

**PR with migration must include:**
- [ ] SQL migration file
- [ ] Updated ARCHITECTURE.md with new schema
- [ ] Explanation of data migration (if existing data affected)
- [ ] Rollback procedure
- [ ] Expected performance impact

---

## Documentation Updates

### When Documentation Needs Updates

**Triggered by:**
- New features added
- API changes
- Setup process changes
- Architecture refactoring
- Community questions (often indicates docs are unclear)

### Documentation PR Checklist

```markdown
## Docs Update: [Topic]

### What Changed
- Updated PROJECT_STRUCTURE.md to reflect new folders
- Rewrote installation steps for clarity
- Added troubleshooting section to docs/INSTALLATION.md

### Why
Users reported confusion about folder organization. The previous docs 
were outdated after last refactor.

### Files Changed
- PROJECT_STRUCTURE.md
- docs/INSTALLATION.md
- README.md

### Review Focus
- Is it clear to someone new to the project?
- Are all code examples accurate?
- Are links working?
- Is formatting consistent?
```

### Documentation Style Guide

**Headings:** Use H2 (##) for sections, H3 (###) for subsections

**Code blocks:** Always include language
```markdown
Good:
```typescript
const x = 1;
```

Bad:
```
const x = 1;
```
```

**Links:** Link to docs, not arbitrary websites
```markdown
See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for folder overview.
```

**Instructions:** Use numbered lists, clarity over cleverness
```markdown
Good:
1. Open the file
2. Find line 42
3. Change "old" to "new"

Bad:
To modify the config, you might want to look in the file somewhere and 
see where it says the thing and change that thing to another thing.
```

---

## Release Artifacts

### For Version Releases

**Create a GitHub Release with:**

1. **Version number** — vX.Y.Z (semantic versioning)
2. **Release notes:**
   ```markdown
   # Priveria v1.2.0
   
   **Release Date:** June 15, 2026
   
   ## ✨ New Features
   - Multi-risk register for assessments
   - Threat modeling templates library
   - Enhanced vendor certification tracking
   
   ## 🐛 Bug Fixes
   - Fixed PDF export missing vendor names
   - Corrected risk calculator for complex scenarios
   
   ## 📚 Documentation
   - Updated PROJECT_STRUCTURE.md
   - Added threat modeling guide
   
   ## 🔗 Dependencies Updated
   - react: 18.2.0 → 18.3.1
   - typescript: 5.1.6 → 5.4.5
   
   ## 🙏 Contributors
   - @contributor1
   - @contributor2
   
   ## 🔐 Security
   - No critical vulnerabilities
   - Dependency audit passed
   
   [See all commits in this release](link)
   ```

3. **Assets** (if applicable):
   - Built binaries or Docker images
   - Generated documentation
   - Migration scripts

4. **Breaking Changes** (if applicable):
   ```markdown
   ⚠️ **BREAKING CHANGES**
   
   If upgrading from v1.1.x, note:
   - Database schema changed (migration required)
   - API endpoint changed from /api/risk to /api/risks
   - Config key renamed: riskScoring → riskScoringEngine
   
   **Migration Steps:**
   1. Run: supabase migration up
   2. Update config file (see CONTRIBUTING.md)
   3. Test locally before deploying
   ```

---

## Community Contributions

### For Tool/Use Case Contributions to PrivacyEngCollabSpace

**Required documents:**
1. **README.md** — Follow template in templates/tool-template.md
2. **LICENSE** — Must be open source (MIT, Apache 2.0, GPL, etc.)
3. **Quick Start** — How to use the tool in 5 minutes
4. **Examples** — Real or realistic examples

**Example Tool Entry:**

```markdown
# Privacy Impact Assessment Tool (Priveria)

**Category:** Risk Assessment  
**Focus Areas:** DPIA, Threat Modeling, Compliance Monitoring

## Overview
Priveria is an open-source enterprise DPIA platform that shifts privacy 
governance from static documents to continuous, programmable infrastructure.

## Features
- Multi-step assessment wizard
- Threat modeling (LINDDUN, STRIDE, ATLAS)
- Automated risk scoring
- Third-party vendor management
- PDF/Word export with 5 templates

## Installation
```bash
npm install priveria
```

## Quick Start
[5-minute example of using the tool]

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Feature Guide](FEATURE_GUIDE.md)
- [Installation](docs/INSTALLATION.md)

## License
Apache 2.0

## Contact
[Email, GitHub, Slack]

## Related Tools
- [Other privacy tools]
```

---

## Checklist Summary

### Minimum for Any PR
- [ ] Clear title and description
- [ ] Link to related issue
- [ ] Testing evidence
- [ ] No console errors

### For Features
- [ ] Documentation updated (README, FEATURE_GUIDE, etc.)
- [ ] Code comments for complex logic
- [ ] Screenshots (if UI)
- [ ] Edge cases tested
- [ ] Mobile view checked

### For Bug Fixes
- [ ] Root cause explained
- [ ] Fix verified
- [ ] Related areas checked
- [ ] Comment added if non-obvious

### For Database Changes
- [ ] Migration file created
- [ ] ARCHITECTURE.md updated
- [ ] Data migration plan
- [ ] Rollback procedure

### For Documentation
- [ ] Accurate and current
- [ ] Links working
- [ ] Code examples tested
- [ ] Consistent formatting

### For Releases
- [ ] Version number set
- [ ] Release notes written
- [ ] Contributors credited
- [ ] Breaking changes noted
- [ ] Migration guides (if applicable)

---

## Questions?

**If you're unsure what's needed:**
1. Check this document
2. Look at recent merged PRs for examples
3. Ask in the PR or open a Discussion
4. Review template in CONTRIBUTING.md

**Better to ask than to guess!**

---

**Last Updated:** June 8, 2026  
**Maintained By:** Aashita Jain, Decoded by Counsel  
**Next Review:** December 8, 2026
