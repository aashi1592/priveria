# Project Maintenance & Housekeeping

**Scheduled maintenance tasks to keep Priveria healthy and organized**

---

## Quick Reference

| Task | Frequency | Time | Owner |
|------|-----------|------|-------|
| Issue triage | Weekly | 30 min | Maintainer |
| Stale issue cleanup | Bi-weekly | 15 min | Maintainer |
| Dependency updates | Monthly | 1 hour | Maintainer |
| Security audit | Monthly | 1 hour | Maintainer |
| Documentation review | Quarterly | 2 hours | Maintainer |
| Branch cleanup | Quarterly | 30 min | Maintainer |
| Major cleanup | Annually | 4 hours | Maintainer |

---

## Weekly: Issue Triage (30 minutes)

### Goal
Keep the issue queue healthy and responsive. Users should feel heard within a week.

### Checklist

```bash
# Check for new issues
# Go to github.com/aashi1592/priveria/issues
```

**For each new issue:**

- [ ] **Read completely** — Understand the ask
- [ ] **Categorize** — Add label (bug, feature, docs, question, etc.)
- [ ] **Assign priority** — Critical/High/Medium/Low
- [ ] **Respond** — Thank them and ask clarifying questions if needed
- [ ] **Link** — Connect to related issues

### Response Templates

**For Bug Reports:**
```
Thanks for reporting! I'll look into this. Can you provide:
1. Exact steps to reproduce
2. What you expected vs. what happened
3. Your browser and OS version

Once I understand the issue better, I'll prioritize and assign.
```

**For Feature Requests:**
```
Great idea! This aligns with our [vision/roadmap]. Before we implement, 
can you help me understand:
1. What problem does this solve?
2. Who would benefit?
3. Any alternatives you considered?

I'll discuss with the team and update you on our thinking.
```

**For Questions/Discussions:**
```
Good question! I'm moving this to Discussions where it's easier to 
chat and help other users find the answer. See [link].
```

**For Duplicates:**
```
Thanks for the report. This is related to #123 which is being worked on. 
I'm closing this as a duplicate, but please follow #123 for updates and 
add any additional context there.
```

---

## Bi-Weekly: Stale Issue Cleanup (15 minutes)

### Goal
Remove issues that are no longer relevant. Keep the backlog actionable.

### Process

**1. Find stale issues**
```bash
# In GitHub Issues, use filters
is:open -updated:>30d  # No activity for 30+ days
```

**2. Decide what to do**

| Situation | Action |
|-----------|--------|
| **No response to request for info** | Ask one more time, close if no response in 2 weeks |
| **Feature no longer relevant** | Close with explanation |
| **Already fixed** | Close with link to fix |
| **Still important but inactive** | Keep, note any blockers |
| **User satisfied** | Close with "Fixed!" |

**3. Close with template**
```
Thanks for your interest in this issue. It's been quiet for a while, 
so I'm closing it to keep our backlog clean. Feel free to reopen if 
you'd like to continue working on it!
```

---

## Monthly: Dependency Updates (1 hour)

### Goal
Keep packages current, fix security vulnerabilities, avoid getting stuck on old versions.

### Audit for Security Issues
```bash
cd /path/to/priveria
npm audit

# Check for vulnerabilities
npm audit fix  # Auto-fix if possible

# For remaining issues, check manually:
# Open package.json and consider updating manually
```

### Check for Outdated Packages
```bash
npm outdated

# See which packages have updates available
# Update selectively (don't update everything at once)
npm update [package-name]
```

### Test After Updates
```bash
npm install
npm run build  # Does it compile?
npm run dev    # Does it run locally?

# Manual testing in browser
# Test key features to ensure nothing broke
```

### Commit Updates
```bash
git add package.json package-lock.json
git commit -m "chore: Update dependencies (npm audit, npm update)"
git push origin main
```

### When to Update
- **Security fixes:** Immediately (create hotfix)
- **Minor updates:** Monthly or quarterly
- **Major version changes:** Plan carefully, test thoroughly, consider breaking changes

### When NOT to Update
- Less than 2 weeks before a release
- If dependency has known breaking changes without migration
- If your code heavily depends on current version behavior

---

## Monthly: Security Audit (1 hour)

### Goal
Proactively find and fix security issues before they become problems.

### Checklist

**1. Dependency security**
```bash
npm audit
# Review and fix any High/Critical vulnerabilities
```

**2. Code security review**
```
Look for these issues in recent commits:
- Hardcoded passwords, API keys, secrets
- SQL injection possibilities
- XSS vulnerabilities in data display
- Unvalidated user input
- Insecure API calls (HTTP instead of HTTPS)
```

**3. GitHub security alerts**
- Go to github.com/aashi1592/priveria/security/alerts
- Review any flagged dependencies
- Update or note exception if safe

**4. Data security**
- [ ] Sensitive data not exposed in logs
- [ ] .env files in .gitignore
- [ ] Secrets not in config files
- [ ] Database passwords not in code

**5. Access control**
- [ ] RLS policies correct in Supabase
- [ ] Admin functions require admin role
- [ ] Users can't see others' data
- [ ] Public endpoints properly scoped

### Create Issue if Found
```
Title: SECURITY: [Brief description]

If it's minor:
Label: "security"
Priority: Medium
Timeline: Fix in next release

If it's critical:
Label: "security", "critical"
Priority: Critical
Timeline: Fix within 24 hours
```

---

## Quarterly: Documentation Review (2 hours)

### Goal
Ensure docs match reality. Confused users come from outdated docs.

### Review These Files

| File | Check For |
|------|-----------|
| **README.md** | Is it still accurate? Are links working? |
| **FEATURE_GUIDE.md** | Do features match actual code? Screenshots current? |
| **docs/ARCHITECTURE.md** | Still reflects system design? Outdated tech mentioned? |
| **docs/INSTALLATION.md** | Does setup actually work end-to-end? |
| **PROJECT_STRUCTURE.md** | Folder structure changed since written? |
| **ROADMAP.md** | Timeline still accurate? Status updated? |
| **CONTRIBUTING.md** | Process still valid? Links working? |

### Testing Documentation
```bash
# Actually follow the installation steps yourself
cd /tmp
rm -rf priveria-test
git clone https://github.com/aashi1592/priveria.git priveria-test
cd priveria-test
npm install
npm run dev

# Did it work? If not, docs need updating
```

### Update If Needed
```bash
# Make edits to .md files
# Commit changes
git add *.md
git commit -m "docs: Update [file] to reflect current state"
git push origin main
```

---

## Quarterly: Branch Cleanup (30 minutes)

### Goal
Remove old branches. Keep repository clean and fast.

### Identify Old Branches
```bash
# Show branches sorted by last commit date
git branch -r --sort=-committerdate

# Show branches not updated in 90 days
git branch -r --sort=-committerdate | \
  while read branch; do
    commit_date=$(git log -1 --format=%ci "$branch")
    echo "$branch | $commit_date"
  done | grep "$(date -d '-90 days' '+%Y-%m')"
```

### Delete Old Branches
```bash
# List branches to delete
# Verify they're merged to main first!

git branch -d old-feature-branch  # Local
git push origin --delete old-feature-branch  # Remote

# Example: Cleaning up old feature branches
git push origin --delete feature/old-ui-redesign
git push origin --delete feature/experimental-ai
```

### Keep These Branches
- main (primary branch)
- Branches with active PRs
- Branches with work < 2 weeks old
- Release branches if applicable

### Archive Branch Info
If deleting a branch with important history, document it:

```markdown
## Archived Branches

| Branch | Merged | Date | Notes |
|--------|--------|------|-------|
| feature/old-ui | Yes | Jun 2026 | Superseded by new design |
| experimental/ml | No | Apr 2026 | Research only, not continuing |
```

---

## Quarterly: Changelog & Version Review (30 minutes)

### Goal
Prepare for next release. Know what's changed since last version.

### Gather Changes
```bash
# List commits since last release
git log v1.1.0..HEAD --oneline

# Categorize them:
# feat: New features
# fix: Bug fixes
# docs: Documentation
# refactor: Code improvements
# perf: Performance
# test: Tests
# chore: Maintenance
```

### Update CHANGELOG
```markdown
## [Unreleased]

### Added
- Multi-risk register for assessments (#123)
- Threat modeling templates (#145)

### Fixed
- PDF export missing vendor names (#156)
- Risk calculator edge case (#167)

### Changed
- Updated dependencies
- Improved documentation

### Security
- Fixed XSS vulnerability in report exports

### Deprecated
- Legacy API endpoint /api/risk (use /api/risks)

---

## [1.0.0] - 2026-05-15

[Previous release notes...]
```

---

## Annually: Major Cleanup (4 hours)

### Goal
Big picture review. Reset for the next year.

### 1. Repository Health Audit (1 hour)
```bash
# Analyze repository statistics
git shortlog -sne  # Commits by person
git log --oneline | wc -l  # Total commits
du -sh .git  # Repository size
```

**Questions to answer:**
- Is repository healthy? Growing appropriately?
- Are we accumulating technical debt?
- Are tests and CI/CD working well?
- Is documentation staying current?

### 2. Community Review (1 hour)
```
Questions:
- How many contributors did we have this year?
- What were the most common requests?
- Who should we recognize/thank?
- Are we hearing from users? How satisfied are they?
- Any patterns in bug reports? Usability issues?
```

### 3. Process Review (1 hour)
```
Questions:
- Is PR review process working?
- Are issues being resolved in reasonable time?
- Do community members feel heard?
- Is documentation keeping up?
- Should we change any processes?

Document in GOVERNANCE.md if changes needed.
```

### 4. Roadmap Planning (1 hour)
```markdown
## Next 12 Months Plan

Based on community feedback, update:
- Major features planned
- Performance/scale improvements needed
- Documentation gaps to close
- Community growth targets
- Sustainability plan

Update ROADMAP.md with new timeline.
```

### Publish Annual Report (Optional)
```markdown
# Priveria 2026 Annual Report

## By the Numbers
- 50 commits merged
- 25 issues closed
- 10 contributors
- 5 releases

## Key Accomplishments
- Feature X launched
- Community grew to Y
- Z organizations using Priveria

## Thank You
We're grateful to our contributors:
- @person1
- @person2
- ...

## Looking Ahead: 2027
Next year we're focusing on:
- AI-assisted features
- Enterprise integrations
- Community tools
```

---

## Special Maintenance: Emergency Hotfixes

### When
- Critical security vulnerability
- Data loss bug
- Service completely broken

### Process
```bash
# Create hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Fix the issue
# Test thoroughly
# Create PR with urgent label

# Once approved, merge immediately
# Tag as patch release (1.0.1)
# Announce to users
```

---

## Tools & Automation

### GitHub Actions (Optional)
Set up workflows for:
- Automated tests on PR
- Dependency security checks
- Code quality linting
- Stale issue auto-close (after warning)

### Scripts

**Quick audit script:**
```bash
#!/bin/bash
echo "=== Repository Health Check ==="
echo "Total commits: $(git log --oneline | wc -l)"
echo "Total issues: $(gh issue list -s all | wc -l)"
echo "Open issues: $(gh issue list | wc -l)"
echo "Recent contributors: $(git shortlog -sne | head -5)"
echo "Dependency audit:"
npm audit
```

---

## Maintenance Schedule Template

Copy this to a calendar app or GitHub project:

```
WEEKLY (Every Monday, 30 min)
- [ ] Issue triage

TWICE MONTHLY (1st & 15th, 15 min)
- [ ] Stale issue cleanup

MONTHLY (1st of month, 2 hours)
- [ ] Dependency updates & security audit
- [ ] Publish monthly summary

QUARTERLY (March, June, Sept, Dec, 2+ hours)
- [ ] Documentation review & updates
- [ ] Branch cleanup
- [ ] Changelog review
- [ ] Plan next quarter

ANNUALLY (January, 4 hours)
- [ ] Major cleanup & health audit
- [ ] Community/process review
- [ ] Roadmap planning for next year
- [ ] Publish annual report
```

---

## Delegation Guide

As project grows, you might delegate tasks:

**Who can do what:**

| Task | Maintainer | Core Contributor | Community |
|------|-----------|-----------------|-----------|
| Issue triage | ✅ | ✅ | Comments only |
| Code review | ✅ | ✅ | Suggestions ok |
| Merge to main | ✅ | Ask first | No |
| Release | ✅ | No | No |
| Update docs | ✅ | ✅ | PR ok |
| Moderate discussions | ✅ | ✅ | Report issues |

---

## Troubleshooting Maintenance

**Q: I'm falling behind on maintenance tasks**
A: Delegate! Promote a core contributor to co-maintainer. Or move to maintenance mode (security/bug fixes only).

**Q: The project grew too big for one person**
A: Consider forming a maintainer team. Define roles in GOVERNANCE.md.

**Q: Users complaining about slow response**
A: Set clear SLAs in GOVERNANCE.md. "Critical: 24h, High: 3 days" etc.

**Q: Too many stale issues**
A: Have a cleanup sprint. Close oldest 20 issues (asking maintainence). Or declare amnesty "pre-v2 cleanup" and close old issues.

---

**Last Updated:** June 8, 2026  
**Maintained By:** Aashita Jain, Decoded by Counsel  
**Next Review:** December 8, 2026
