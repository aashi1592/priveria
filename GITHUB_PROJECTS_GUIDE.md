# GitHub Projects Setup Guide for Priveria

**For Non-Engineers: How to Use GitHub Projects to Track Work**

---

## Table of Contents

1. [What is GitHub Projects?](#what-is-github-projects)
2. [Setting Up Your Project Board](#setting-up-your-project-board)
3. [Understanding the Columns](#understanding-the-columns)
4. [How to Add Tasks](#how-to-add-tasks)
5. [How to Track Progress](#how-to-track-progress)
6. [For Different Roles](#for-different-roles)

---

## What is GitHub Projects?

**GitHub Projects** is a simple task management board built into GitHub. Think of it like a digital whiteboard where you can:

- ✅ Keep track of what needs to be done
- ✅ See what people are working on
- ✅ Mark work as complete
- ✅ Organize by priority or type
- ✅ See the big picture of project progress

**Unlike spreadsheets or external tools**, everything stays in one place next to your code.

---

## Setting Up Your Project Board

### Step 1: Create a New Project

1. Go to https://github.com/aashi1592/priveria
2. Click the **"Projects"** tab (near Code, Issues, Pull Requests)
3. Click **"New project"** (green button)
4. Choose **"Table"** as the template (easiest for non-engineers)
5. Name it: **"Priveria Development Roadmap"**
6. Click **"Create"**

### Step 2: Set Up Columns

Your project board will have columns that show the status of work:

```
📋 Backlog  →  🔄 In Progress  →  🔍 In Review  →  ✅ Done
```

**Default columns to create:**
1. **📋 Backlog** — Tasks we want to do eventually
2. **🔄 In Progress** — Tasks someone is actively working on
3. **🔍 In Review** — Tasks waiting for review/feedback
4. **✅ Done** — Tasks completed

**To add columns:**
1. In your new project, click the "+" button next to columns
2. Type the column name
3. Repeat for each column

---

## Understanding the Columns

### 📋 **Backlog**
**What goes here:** Tasks that need to be done but haven't been started yet

**Examples:**
- "Add export template for EU AI Act"
- "Improve dashboard performance"
- "Write user guide for vendors"

**Status:** Not started, no one assigned yet

---

### 🔄 **In Progress**
**What goes here:** Tasks someone is actively working on right now

**Examples:**
- "Update README documentation" (Assigned to: Aashita)
- "Fix vendor search feature" (Assigned to: Dev Team)
- "Create threat modeling guide" (Assigned to: Legal Team)

**Status:** Someone is working on it this week

---

### 🔍 **In Review**
**What goes here:** Tasks waiting for approval/feedback before moving to Done

**Examples:**
- "New DPIA template" (Waiting for: Legal review)
- "Dashboard redesign" (Waiting for: UX feedback)
- "Security audit fix" (Waiting for: Security sign-off)

**Status:** Done but needs final approval

---

### ✅ **Done**
**What goes here:** Completed tasks

**Examples:**
- "Project unification complete"
- "Governance documentation published"
- "PrivacyEngCollabSpace synced"

**Status:** Finished and closed

---

## How to Add Tasks

### Method 1: Add a New Issue (Recommended for Non-Engineers)

1. Go to **Issues** tab → Click **"New issue"**
2. Fill in the details:

   **Title:** Clear description of what needs to be done
   ```
   Example: "Update README with latest features"
   ```

   **Description:** Explain what this task is about (optional but helpful)
   ```
   Example: 
   "We added new threat modeling features in May. 
   The README needs to mention these new features 
   so users know they exist."
   ```

   **Labels:** Add tags (click "Labels")
   ```
   Examples: 
   - "documentation" (if it's a docs task)
   - "bug" (if it's fixing something broken)
   - "feature" (if it's a new capability)
   - "priority-high" (if it's urgent)
   ```

   **Assignee:** Who should work on this? (click "Assignee")

3. Click **"Create"** 
4. The issue automatically appears in your Project board (in Backlog)

### Method 2: Add Directly in Project Board

1. Go to your Project
2. Click **"Add item"** in the Backlog column
3. Type the task name
4. Click the task to add more details (description, assignee, etc.)

### What Makes a Good Task Description?

**Good:** 
```
"Create user guide for non-engineers to use the DPIA wizard

Description:
Our non-technical users find the assessment wizard confusing. 
We need a step-by-step guide with screenshots showing:
1. How to create a new assessment
2. How to fill in the basic info
3. How to add risks
4. How to export the PDF

Acceptance criteria:
- Guide has 5+ screenshots
- Written for non-technical audience
- Links from main README
"
```

**Bad:**
```
"User guide"
```

---

## How to Track Progress

### For Project Managers / Non-Engineers

**View Progress:**
1. Open your Project board
2. You see how many items in each column
3. Count = Progress

```
Example:
📋 Backlog: 15 items (tasks to start)
🔄 In Progress: 3 items (currently being worked on)
🔍 In Review: 2 items (waiting for approval)
✅ Done: 18 items (completed!)

This shows: 18/(15+3+2+18) = 40% complete
```

**Check What's Blocked:**
1. Look in "In Review" column
2. Click each task
3. Read the comments to see what's needed
4. Help unblock if possible

**Track by Type:**
1. Click the "Label" field when viewing tasks
2. Filter by "documentation", "bug", "feature" etc.
3. See progress by category

### Weekly Status Check (15 minutes)

Every Monday morning, do this:

1. Open your Project board
2. Look at **🔄 In Progress** column
3. Ask: "Are these tasks still being worked on?"
4. If not moved in 3+ days, check in with person assigned
5. Move completed tasks to **✅ Done**
6. Move blocked tasks to **🔍 In Review** (if waiting for feedback)

---

## For Different Roles

### For Project Managers / Non-Engineers

**Your job:** Keep the board up-to-date and moving

**Weekly checklist:**
- [ ] Check In Progress tasks (are they still active?)
- [ ] Check In Review tasks (are they waiting for something?)
- [ ] Move Done tasks to Done column
- [ ] Add new tasks to Backlog when they come up
- [ ] Share a quick summary: "5 tasks done, 3 in progress"

**Example Status Update:**
```
Weekly Progress Update:
✅ Completed: 3 tasks (README update, docs sync, governance guide)
🔄 In Progress: 2 tasks (vendor testing, report templates)
🔍 In Review: 1 task (security audit - waiting for sign-off)

All on track! No blockers this week.
```

---

### For Engineers / Developers

**Your job:** Update your tasks as you work

**When you start work:**
1. Find your task in Backlog
2. Drag it to "In Progress"
3. Add a comment: "Starting work on this today"

**When you finish:**
1. Drag task to "In Review"
2. Add a comment with what you did
3. Request review from appropriate person

**When it's approved:**
1. Drag to "Done"
2. Add comment: "Complete!" or link to PR/issue

---

### For Legal / Compliance Team

**Your job:** Review and approve compliance-related tasks

**Weekly check:**
1. Look in "In Review" column
2. Find tasks tagged with "legal" or "compliance"
3. Review the work
4. Comment: "Approved" or "Needs changes: ..."
5. Once approved, task moves to Done

**Example task:**
```
Title: "Create DPIA template for healthcare organizations"
Status: In Review (waiting for your approval)
Assignee: Dev Team
Your job: Check the template meets legal requirements
```

---

### For Security Team

**Your job:** Review and approve security-related tasks

**Weekly check:**
1. Look in "In Review" column
2. Find tasks tagged with "security"
3. Review the security implications
4. Comment: "Security approved" or "Security concerns: ..."
5. Once approved, task moves to Done

---

## Example Project Board Setup

Here's what your project board might look like:

```
┌─────────────────────────────────────────────────────────────────┐
│ PRIVERIA DEVELOPMENT ROADMAP                                    │
├─────────────────────────────────────────────────────────────────┤
│
│ 📋 BACKLOG (5)          🔄 IN PROGRESS (3)    🔍 IN REVIEW (2)   ✅ DONE (18)
│ ─────────────────────   ──────────────────    ─────────────────  ──────────
│
│ • Add use-case         • Vendor testing      • Security audit    • Project
│   template             (Dev Team)            (awaiting sec      unification
│ (feature)             • Report export       review)             complete
│                         fix (John)          • Docs review       • Governance
│ • Improve              • UI improvements    (awaiting legal    docs done
│   dashboard            (Maria)              approval)          • README
│   performance                                                   updated
│ (performance)         Labels:               Labels:             • Feature
│                       - in-progress         - review            guide
│ • Write vendor         - high-priority      - blocking          published
│   guide
│ (documentation)       Assigned to:          Assigned to:        (18 items)
│                       • John Doe            • Sarah Smith
│ • Update threat        • Maria Garcia       • Tech Lead
│   patterns             • Aashita            
│ (feature)            
│
│ • Create AI            Progressing on
│   assessment          schedule!
│   guide
│ (documentation)
│
│ (5 items)                                    (2 items)
│
└─────────────────────────────────────────────────────────────────┘
```

---

## Best Practices for Non-Engineers

### ✅ DO:

- **Write clear task names** so anyone can understand them
- **Add descriptions** explaining why the task matters
- **Use labels** (documentation, bug, feature, priority-high) for organization
- **Assign to someone** so it's clear who's responsible
- **Update status weekly** so the board reflects reality
- **Add comments** to explain blockers or ask questions
- **Move completed tasks to Done** to celebrate progress

### ❌ DON'T:

- **Create vague tasks** like "Update stuff"
- **Leave tasks unassigned** (people won't know who should do it)
- **Ignore tasks in Review** (they need action to move forward)
- **Forget to update** the board (it becomes outdated and useless)
- **Use jargon** (write for non-technical readers)
- **Create too many columns** (keep it simple)

---

## Sample Tasks to Get Started

Create these tasks in your Backlog to start:

### Documentation Tasks
```
Title: "Create video walkthrough of DPIA wizard"
Description: "New users need a video showing how to create an assessment step-by-step"
Labels: documentation
Priority: High
Assignee: [Marketing/Content person]
```

```
Title: "Write FAQ for common DPIA questions"
Description: "Users ask the same questions repeatedly. Create an FAQ to help them"
Labels: documentation
Priority: Medium
Assignee: [Content/Legal person]
```

### Feature Tasks
```
Title: "Add dark mode to the application"
Description: "Users requested the ability to use dark mode for evening work"
Labels: feature, nice-to-have
Priority: Low
Assignee: [Frontend developer]
```

### Bug Tasks
```
Title: "Fix vendor search not finding recent additions"
Description: "When a vendor is added, searching doesn't find it for 10+ minutes"
Labels: bug
Priority: High
Assignee: [Backend developer]
```

### Testing/QA Tasks
```
Title: "Test all DPIA export templates on Mac and Windows"
Description: "Verify exports work correctly on both operating systems"
Labels: testing
Priority: High
Assignee: [QA team]
```

---

## Viewing Your Project

### View Types

Your GitHub Project supports multiple views:

**1. Board View** (like Kanban cards)
- See columns side-by-side
- Drag tasks between columns
- Quick visual progress

**2. Table View** (like spreadsheet)
- All tasks in rows
- Sort by assignee, priority, label
- Easy for data entry

**3. Timeline View** (like Gantt chart)
- See when tasks start/end
- Plan deadlines
- Spot bottlenecks

**Switch views:** Click tabs at the top of your project

---

## Filtering & Searching

### Find What You Need

**Filter by assignee:**
1. Click "Filter" in project
2. Select "Assignee"
3. Choose a person
4. See only their tasks

**Filter by status:**
1. Click "Filter"
2. Select "Status"
3. See tasks in specific column

**Filter by priority:**
1. Click "Filter"
2. Select "Priority"
3. See high/medium/low priority items

**Search for task:**
1. Press Ctrl+F (or Cmd+F on Mac)
2. Type keyword
3. See matching tasks

---

## Common Questions

**Q: A task is stuck in "In Review" — what do I do?**
A: Click the task and read the comments. See what's needed. Comment: "Still waiting on this — any blockers?" If it's been waiting 1+ week, escalate.

**Q: Can I see how much work each person has?**
A: Yes! Filter by Assignee, count tasks in "In Progress". If someone has 5+ tasks, they might be overloaded.

**Q: How often should I update the board?**
A: At least weekly. Daily is better if you have active developers.

**Q: Can I automate anything?**
A: Yes, GitHub Projects can auto-move issues when PRs are merged. Guides: [GitHub Projects Automation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)

**Q: What if we use multiple projects?**
A: You can! Create separate projects for:
- Quarterly planning
- Bug triage
- Feature backlog
- Security/compliance
- Community issues

---

## Monthly Review Template

Use this monthly to review progress:

```markdown
# Monthly Review — [Month Year]

## Completed (✅ Done column)
- [Count] tasks completed
- Major wins: 
  * [Task 1]
  * [Task 2]
  * [Task 3]

## In Progress (🔄 In Progress column)
- [Count] tasks active
- On track: Yes/No
- Blockers: [List any]

## Backlog Status (📋 Backlog column)
- [Count] tasks waiting
- Next priority: [Task name]

## Metrics
- Total tasks completed this month: __
- Average time per task: __
- Completion rate: __%

## Next Month Focus
- [Priority 1]
- [Priority 2]
- [Priority 3]

## Team Notes
- What went well:
- What needs improvement:
```

---

## Quick Start Checklist

- [ ] Navigate to github.com/aashi1592/priveria/projects
- [ ] Create new project called "Priveria Development Roadmap"
- [ ] Set up 4 columns: Backlog, In Progress, In Review, Done
- [ ] Add 5-10 sample tasks from earlier section
- [ ] Invite team members to the project
- [ ] Assign tasks to people
- [ ] Set weekly review schedule (Monday morning)
- [ ] Share project link with team: `https://github.com/aashi1592/priveria/projects/[number]`

---

## Learning Resources

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects)
- [GitHub Issues Guide](https://docs.github.com/en/issues/tracking-your-work-with-issues)
- [GitHub for Project Management](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)

---

## Sharing Your Project with the Team

**Share the project board link:**
```
https://github.com/aashi1592/priveria/projects/[project-number]
```

**Send to team with this message:**
```
Hi team!

We now have a GitHub Projects board to track Priveria work:
[Link above]

This is where we'll track:
✅ What's done
🔄 What's in progress
🔍 What's waiting for review
📋 What's planned

You don't need to be an engineer to use it — everyone can:
- See progress at a glance
- Know who's working on what
- Ask questions on tasks
- Track blockers

Please check it weekly to stay updated!

If you have questions, see GITHUB_PROJECTS_GUIDE.md
```

---

**Last Updated:** June 8, 2026  
**Maintained By:** Aashita Jain, Decoded by Counsel  
**Next Review:** December 8, 2026

For questions about setting up GitHub Projects, refer to this guide or the GitHub documentation linked above.
