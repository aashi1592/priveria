# GitHub Projects Implementation Guide
## Step-by-Step Setup for Priveria Development

**For: Aashita Jain (Project Owner)**  
**Purpose: Create non-engineer-friendly GitHub Projects board**  
**Time Required: 30 minutes**

---

## Table of Contents
1. [Project Board Overview](#project-board-overview)
2. [Step-by-Step Setup Instructions](#step-by-step-setup-instructions)
3. [Issues to Create](#issues-to-create)
4. [Project Configuration](#project-configuration)
5. [Views & Filters](#views--filters)
6. [Monthly Maintenance](#monthly-maintenance)

---

## Project Board Overview

### What We're Creating

```
PROJECT NAME: Priveria Development Roadmap
TYPE: Table-based project board
COLUMNS: 4 (Backlog, In Progress, In Review, Done)
AUDIENCE: Non-engineers can view and manage
PURPOSE: Track all project work in one place
```

### Board Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Priveria Development Roadmap                                │
├─────────────────────────────────────────────────────────────┤
│
│ 📋 BACKLOG       🔄 IN PROGRESS    🔍 IN REVIEW      ✅ DONE
│ ─────────────    ─────────────────  ─────────────────  ──────
│ • Task 1         • Task 4            • Task 7           • Task 10
│ • Task 2         • Task 5            • Task 8           • Task 11
│ • Task 3         • Task 6            • Task 9           • Task 12
│
│ (Priority-based) (Actively worked)   (Waiting for)      (Complete)
│
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Setup Instructions

### PHASE 1: Create the Project (5 minutes)

#### Step 1.1: Navigate to Projects
1. Go to: https://github.com/aashi1592/priveria
2. Click the **"Projects"** tab (next to Code, Issues, Pull Requests)
3. You'll see an empty projects list

#### Step 1.2: Create New Project
1. Click **"New project"** button (green button on the right)
2. A popup will appear asking for configuration

#### Step 1.3: Configure Project
**In the dialog box, select:**
- **Project name:** `Priveria Development Roadmap`
- **Template:** Choose **`Table`** (NOT "Board" - Table is better for non-engineers)
- **Description (optional):** 
  ```
  Central tracking board for all Priveria development work.
  Non-engineers can see what's planned, in progress, and completed.
  ```
- Click **"Create"**

#### Step 1.4: Wait for Creation
The project will create (takes 5-10 seconds).
You'll see a default table with some example columns.

---

### PHASE 2: Set Up Columns (10 minutes)

Your table will have default columns. You need to customize them.

#### Default columns to DELETE (if present):
- Status (if pre-filled)
- Any demo columns

#### New Columns to CREATE:

Click the **"+"** button at the right end of columns. Add these columns in order:

**Column 1: Status (hidden for sorting)**
- Name: `Status`
- Type: Single select
- Options:
  - 📋 Backlog
  - 🔄 In Progress
  - 🔍 In Review
  - ✅ Done

**Column 2: Priority**
- Name: `Priority`
- Type: Single select
- Options:
  - 🔴 Critical
  - 🟠 High
  - 🟡 Medium
  - 🟢 Low

**Column 3: Type**
- Name: `Type`
- Type: Single select
- Options:
  - 📖 Documentation
  - 🐛 Bug
  - ✨ Feature
  - 🔧 Maintenance
  - 🧪 Testing

**Column 4: Assignee**
- Name: `Assigned To`
- Type: Assignee
- (Automatically populates from GitHub)

**Column 5: Target Date**
- Name: `Target Date`
- Type: Date
- (Leave empty, users fill in as needed)

**Column 6: Labels**
- Name: `Labels`
- Type: Labels
- (Pre-populated from GitHub labels)

---

### PHASE 3: Create Issues/Tasks (10 minutes)

Now you'll create the tasks that will populate your board.

#### Method: Create Issues on GitHub

Go to: https://github.com/aashi1592/priveria/issues/new

**Copy-paste each task below, filling in the details:**

---

## Issues to Create

### ISSUE SET 1: DOCUMENTATION TASKS

#### Issue 1.1: Video Walkthrough
```
Title: Create video walkthrough of DPIA assessment wizard

Description:
New users find the assessment wizard confusing. We need a step-by-step video showing:
1. Creating a new assessment
2. Filling in basic information
3. Adding risks to the risk register
4. Exporting a PDF report

This will help non-technical users get started quickly.

Acceptance Criteria:
- [ ] Video is 5-10 minutes long
- [ ] Shows each step clearly
- [ ] Includes captions or voice-over
- [ ] Linked from README and documentation
- [ ] Uploaded to YouTube or similar platform
```

**Labels to add:** `documentation`, `help-wanted`  
**Assignee:** [Assign to content/marketing person]  
**Status:** 📋 Backlog  
**Priority:** 🟡 Medium  
**Type:** 📖 Documentation  
**Target Date:** [Leave blank for now]

---

#### Issue 1.2: User Guide - Vendors
```
Title: Write user guide for vendors management

Description:
Users need clear instructions on managing vendors in Priveria.

Guide should cover:
- Adding a new vendor
- Updating vendor information
- Linking vendors to assessments
- Understanding vendor risk scores
- Exporting vendor reports

Include screenshots for each step.

Acceptance Criteria:
- [ ] 5+ screenshots included
- [ ] Written for non-technical audience
- [ ] Step-by-step instructions
- [ ] Examples of common scenarios
- [ ] Linked from help section
```

**Labels to add:** `documentation`, `feature`  
**Assignee:** [Assign to someone]  
**Status:** 📋 Backlog  
**Priority:** 🟡 Medium  
**Type:** 📖 Documentation  
**Target Date:** [Leave blank]

---

#### Issue 1.3: Create FAQ
```
Title: Create FAQ for common DPIA questions

Description:
Support team reports users ask the same 10-15 questions repeatedly. 
Create comprehensive FAQ to reduce support tickets.

Questions to cover:
- What is a DPIA?
- When do I need to do a DPIA?
- How long does a DPIA take?
- Can I save my assessment?
- How do I export results?
- Is my data private?
- Can I undo changes?
- How do vendors get added?
- What happens after export?
- Can multiple people work on one assessment?

Acceptance Criteria:
- [ ] Covers 10+ common questions
- [ ] Written for non-technical users
- [ ] Includes links to detailed guides
- [ ] Published on main website
- [ ] Linked from README
```

**Labels to add:** `documentation`, `help-wanted`  
**Assignee:** [Assign to legal or support person]  
**Status:** 📋 Backlog  
**Priority:** 🟠 High  
**Type:** 📖 Documentation  
**Target Date:** [Leave blank]

---

### ISSUE SET 2: FEATURE TASKS

#### Issue 2.1: Dark Mode
```
Title: Add dark mode toggle to settings

Description:
Users have requested dark mode for evening work and accessibility.

Requirements:
- Toggle in Settings page
- Preference persists when user logs back in
- All pages respect dark mode setting
- Works on mobile and desktop
- Follows accessibility standards

Acceptance Criteria:
- [ ] Dark mode toggle in Settings
- [ ] Preference saved in database
- [ ] All pages support dark mode
- [ ] Tested on 5+ browsers
- [ ] Accessibility score: 90+
- [ ] No console errors
```

**Labels to add:** `feature`, `enhancement`  
**Assignee:** [Assign to frontend engineer]  
**Status:** 📋 Backlog  
**Priority:** 🟢 Low  
**Type:** ✨ Feature  
**Target Date:** [Leave blank]

---

#### Issue 2.2: Bulk Export
```
Title: Add bulk export for multiple assessments

Description:
Users need to export multiple assessments at once instead of one-by-one.

Requirements:
- Select multiple assessments on list
- Export all to single zip file
- Each assessment in separate PDF
- Include summary report
- Maintain folder structure

Acceptance Criteria:
- [ ] Select multiple assessments with checkboxes
- [ ] Export button creates zip file
- [ ] Zip contains all PDFs + summary
- [ ] Works with 5+ assessments
- [ ] Performance: < 5 seconds for 10 assessments
- [ ] Error handling for large exports
```

**Labels to add:** `feature`, `enhancement`  
**Assignee:** [Assign to engineer]  
**Status:** 📋 Backlog  
**Priority:** 🟡 Medium  
**Type:** ✨ Feature  
**Target Date:** [Leave blank]

---

### ISSUE SET 3: BUG FIXES

#### Issue 3.1: Vendor Search
```
Title: Vendor search doesn't find recently added vendors

Description:
When a vendor is added, the search function doesn't find it for 10+ minutes.

Steps to Reproduce:
1. Click "Add Vendor"
2. Fill in vendor name "Test Corp"
3. Click "Save"
4. Go back to vendor list
5. Click search
6. Search for "Test Corp"
7. ISSUE: Not found in results
8. Wait 10 minutes
9. Search again - NOW it appears

Impact:
- Users frustrated they can't find vendors they just added
- Blocking workflow
- Likely a caching issue

Expected Behavior:
- Vendor appears in search immediately after saving
- Search results update in real-time

Acceptance Criteria:
- [ ] Vendor appears in search immediately
- [ ] Tested with 5+ vendor names
- [ ] No lag time in search
- [ ] Cache properly invalidated
```

**Labels to add:** `bug`, `high-priority`  
**Assignee:** [Assign to backend engineer]  
**Status:** 🔄 In Progress  
**Priority:** 🔴 Critical  
**Type:** 🐛 Bug  
**Target Date:** [Today's date + 3 days]

---

#### Issue 3.2: Export Formatting
```
Title: PDF export missing vendor names in some templates

Description:
When exporting assessments with multiple vendors, some export templates 
show empty vendor section instead of listing vendors.

Affected Templates:
- Board brief
- Executive summary
- (possibly others - needs testing)

Impact:
- Exported documents are incomplete
- Vendors missing from reports

Expected Behavior:
- All vendor names appear in export
- Vendor risk scores included
- Vendor contact info if applicable

Acceptance Criteria:
- [ ] All export templates show vendors
- [ ] Tested with 3-5 vendors per assessment
- [ ] Vendors appear with names and risk scores
- [ ] No PDF corruption or formatting issues
```

**Labels to add:** `bug`, `high-priority`  
**Assignee:** [Assign to engineer]  
**Status:** 🔍 In Review  
**Priority:** 🟠 High  
**Type:** 🐛 Bug  
**Target Date:** [Leave blank]

---

### ISSUE SET 4: MAINTENANCE TASKS

#### Issue 4.1: Monthly Security Audit
```
Title: Monthly security audit and dependency update

Description:
Regular maintenance task to keep Priveria secure and up-to-date.

What to do:
1. Run: npm audit
2. Review vulnerabilities
3. Fix or escalate high/critical issues
4. Run: npm update
5. Test build: npm run build
6. Test locally: npm run dev
7. Run security scan
8. Document findings

Acceptance Criteria:
- [ ] npm audit shows no critical vulnerabilities
- [ ] Dependencies updated
- [ ] Build succeeds with no errors
- [ ] Local testing passes
- [ ] Security report documented
- [ ] Blockers escalated to maintainer
```

**Labels to add:** `maintenance`, `security`  
**Assignee:** [Assign to lead developer]  
**Status:** 📋 Backlog  
**Priority:** 🔴 Critical  
**Type:** 🔧 Maintenance  
**Target Date:** [1st of next month]

---

#### Issue 4.2: Quarterly PrivacyEngCollabSpace Sync
```
Title: Quarterly sync of documentation to PrivacyEngCollabSpace

Description:
Every 3 months, sync latest Priveria documentation to the organization repository.

What to sync:
- README_Priveria.md (from main README.md)
- FEATURE_GUIDE.md
- CONTRIBUTING_Priveria.md (from CONTRIBUTING.md)

Process:
1. Copy latest versions from main repo
2. Review for organization audience
3. Create PR to PrivacyEngCollabSpace
4. Get community feedback
5. Merge and announce

Scheduled Dates:
- February 1
- May 1
- August 1
- November 1

Next Due: [Next quarterly date]

Acceptance Criteria:
- [ ] Documentation copied and updated
- [ ] PR created with clear description
- [ ] Community feedback addressed
- [ ] Merged to master
- [ ] Community notified
```

**Labels to add:** `maintenance`, `community`  
**Assignee:** [Aashita]  
**Status:** 📋 Backlog  
**Priority:** 🟡 Medium  
**Type:** 🔧 Maintenance  
**Target Date:** [Next quarterly date]

---

### ISSUE SET 5: TESTING TASKS

#### Issue 5.1: Cross-Browser Testing
```
Title: Test all DPIA export templates on Mac and Windows

Description:
Ensure all export templates work correctly on both operating systems.

Templates to test:
1. EDPB regulator view
2. EU AI Act conformity
3. Board brief
4. Internal technical report
5. Threat-register stakeholder share

Operating Systems:
- macOS 12+
- Windows 10+

Browsers:
- Chrome/Chromium
- Firefox
- Safari (Mac only)

What to verify:
- Export completes without error
- PDF opens correctly
- Fonts display properly
- Formatting preserved
- Images included
- No blank pages

Acceptance Criteria:
- [ ] All 5 templates tested on Mac
- [ ] All 5 templates tested on Windows
- [ ] All templates pass visual inspection
- [ ] No errors in browser console
- [ ] Test results documented
```

**Labels to add:** `testing`, `qa`  
**Assignee:** [Assign to QA person]  
**Status:** 📋 Backlog  
**Priority:** 🟠 High  
**Type:** 🧪 Testing  
**Target Date:** [Before next release]

---

## Project Configuration

### How to Configure Your Project Board

#### Step 1: Set Default View
1. Open your project: Priveria Development Roadmap
2. Click "View settings" (gear icon)
3. Set default view to: **Table**
4. Set sort order: **By Status, then by Priority**

#### Step 2: Add Filters
1. Click "Filter" button
2. Add suggested filters:
   - **By Assignee** (see what each person has)
   - **By Priority** (see critical vs. low priority work)
   - **By Type** (see documentation, bugs, features separately)

#### Step 3: Create Custom Fields (Optional)
1. Click **"+"** to add custom field
2. **Effort Estimate**
   - Type: Single select
   - Options: Small, Medium, Large, XL
   - (Helps plan workload)

3. **Status Progress**
   - Type: Single select
   - Options: Not Started, 25%, 50%, 75%, Complete
   - (Track partial progress)

---

## Views & Filters

### Different Views for Different Needs

#### View 1: Kanban Board View
**Purpose:** Quick visual status of all work

**Steps:**
1. Open project
2. At top, look for "View" options
3. Click **"Board"** (if available)
4. Shows columns: Backlog → In Progress → In Review → Done
5. Drag tasks between columns to update status

#### View 2: Table View
**Purpose:** Detailed view of all tasks

**Steps:**
1. Click **"Table"** view
2. See all columns: Title, Status, Priority, Type, Assignee, Date
3. Sort by clicking column headers
4. Filter using "Filter" button
5. Edit cells directly

#### View 3: Timeline/Gantt View
**Purpose:** See work over time

**Steps:**
1. Click **"Timeline"** (if available)
2. See tasks laid out by target date
3. Identify bottlenecks (many tasks same date)
4. Plan delivery dates visually

---

## Monthly Maintenance

### Weekly Check (15 minutes, every Monday)

1. **Open project board:** Priveria Development Roadmap
2. **Check "In Progress" column:**
   - Are tasks still being worked on?
   - If not moved in 3 days → ask person assigned
   - Move completed tasks to "In Review"
3. **Check "In Review" column:**
   - Are tasks waiting for something?
   - If waiting > 1 week → escalate
4. **Move "Done" tasks:**
   - Verify task is truly complete
   - Move to "Done" column
5. **Add new tasks:**
   - Any new requests? Create issues and add to Backlog

### Monthly Review (30 minutes, 1st of month)

1. **Open project board**
2. **Count completed tasks:** `Done` column count
3. **Count active tasks:** `In Progress` column count
4. **Identify blockers:** `In Review` column, check comments
5. **Create status summary:**
   ```
   Monthly Progress Update:
   ✅ Completed: X tasks
   🔄 In Progress: Y tasks
   🔍 In Review: Z tasks
   📋 Backlog: W tasks
   
   Blockers: [List any]
   Next Priority: [Top 3 tasks]
   ```
6. **Share with team** in Slack or email

### Quarterly Review (1 hour, start of quarter)

1. **Run maintenance checklist** (see MAINTENANCE.md)
2. **Review project metrics:**
   - How many tasks completed this quarter?
   - Average time per task?
   - Which types of work took longest?
3. **Update ROADMAP.md** with progress
4. **Adjust priorities** for next quarter
5. **Create quarterly summary** for stakeholders

---

## Tips for Non-Engineers Using This Board

### ✅ DO:

- **Check weekly** — keeps everyone informed
- **Update status** — move tasks as they progress
- **Add comments** — explain blockers or ask questions
- **Celebrate wins** — mention completed tasks
- **Be specific** — clear task names help everyone

### ❌ DON'T:

- **Leave tasks unassigned** — people won't know who should do it
- **Forget to update** — board becomes outdated and useless
- **Use vague names** — "Update stuff" is not clear
- **Ignore blockers** — tasks stuck in "In Review" need action
- **Create duplicate tasks** — check if task already exists first

---

## Example Board States

### Good Project Board
```
📋 Backlog: 8 tasks
  - Clear descriptions
  - Priority labels set
  - Assigned to people

🔄 In Progress: 3 tasks
  - Being actively worked on
  - Comments added daily
  - Target dates set

🔍 In Review: 1 task
  - Waiting for approval
  - Comments explain what's needed

✅ Done: 12 tasks
  - Growing list shows progress
  - Recent tasks show project is active
```

### Problem Project Board
```
📋 Backlog: 50 tasks
  - Too many unstarted tasks
  - Maybe priorities are unclear?

🔄 In Progress: 0 tasks
  - Work might be stalled
  - Nothing is being done?

🔍 In Review: 8 tasks
  - Too many waiting
  - Blockers not being resolved

✅ Done: 2 tasks
  - Very little progress
  - Team might be overloaded
```

---

## Sharing Your Project with Team

Once you've set everything up:

1. **Get the project URL:**
   - Go to your project
   - Copy the URL from address bar
   - Example: `https://github.com/aashi1592/priveria/projects/1`

2. **Share with team:**
   ```
   Hi team!

   We now have a GitHub Projects board to track Priveria work:
   [Paste URL here]

   This is where we track:
   ✅ What's done
   🔄 What's in progress
   🔍 What's waiting for review
   📋 What's planned

   Check it weekly to stay updated!

   If you have questions, see GITHUB_PROJECTS_GUIDE.md or ask me.
   ```

3. **Invite team members:**
   - GitHub automatically sees people as contributors
   - They can assign themselves to tasks
   - They get notifications when assigned

---

## Troubleshooting

**Q: I created a project but tasks don't appear**
A: You need to create GitHub Issues, not just add tasks directly. Create issues on the Issues tab, then they'll appear in the project.

**Q: How do I move a task between columns?**
A: Click the task, find "Status" field, select the new status (Backlog, In Progress, etc.). The task will move to that column.

**Q: Can I see just my tasks?**
A: Yes! Click "Filter", then select "Assigned To: [Your name]". You'll see only your tasks.

**Q: How do I assign someone to a task?**
A: Click the task, find "Assigned To" field, click and choose from the dropdown.

**Q: Can I add custom fields?**
A: Yes! Click "+" when creating a column. You can add fields like "Effort Estimate" or "Priority".

---

## Next Steps

1. ✅ Read this guide (30 min)
2. **Create the project** (5 min)
3. **Set up columns** (10 min)
4. **Create sample tasks** (10 min)
5. **Share link with team** (5 min)
6. **Start using weekly** (ongoing)

**Total setup time: 30-40 minutes**

---

**Last Updated:** June 8, 2026  
**For:** Aashita Jain, Priveria Project Owner  
**Questions?** See GITHUB_PROJECTS_GUIDE.md or contact: contactus@decodedbycounsel.com

---

## Quick Reference Checklist

```
□ Create project "Priveria Development Roadmap"
□ Add Column: Status (select: Backlog, In Progress, In Review, Done)
□ Add Column: Priority (select: Critical, High, Medium, Low)
□ Add Column: Type (select: Documentation, Bug, Feature, Maintenance, Testing)
□ Add Column: Assigned To
□ Add Column: Target Date
□ Create Issue 1.1: Video Walkthrough
□ Create Issue 1.2: User Guide - Vendors
□ Create Issue 1.3: Create FAQ
□ Create Issue 2.1: Dark Mode
□ Create Issue 2.2: Bulk Export
□ Create Issue 3.1: Vendor Search Bug
□ Create Issue 3.2: Export Formatting Bug
□ Create Issue 4.1: Monthly Security Audit
□ Create Issue 4.2: Quarterly Sync
□ Create Issue 5.1: Cross-Browser Testing
□ Set default view to Table
□ Add filters (Assignee, Priority, Type)
□ Share project link with team
□ Schedule weekly Monday check-in (15 min)
□ Schedule monthly review (30 min, 1st of month)
```

**SETUP COMPLETE!** 🎉
