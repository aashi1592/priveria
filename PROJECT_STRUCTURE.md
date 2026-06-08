# Project Structure Guide

**For Non-Technical Team Members & Project Managers**

This guide explains how the Priveria project is organized and where to find different types of files.

---

## 📁 Quick Navigation Map

```
priveria/
├── README.md                    ← Start here: Project overview
├── PROJECT_STRUCTURE.md         ← You are here
├── ROADMAP.md                   ← Development timeline & milestones
├── CONTRIBUTING.md              ← How to contribute (all roles)
├── FEATURE_GUIDE.md             ← Guide to all features
│
├── 📚 docs/                     ← Technical & Setup Documentation
│   ├── ARCHITECTURE.md          ← How the system is built
│   └── INSTALLATION.md          ← How to set up locally
│
├── 📋 config/                   ← Feature toggles & settings
│   └── features.json            ← Enable/disable features
│
├── 🎨 public/                   ← Images, logos, static assets
│
├── 💻 src/                      ← Application Source Code
│   ├── App.tsx                  ← Main app entry point
│   ├── main.tsx                 ← React initialization
│   ├── pages/                   ← Page components (user-facing views)
│   │   ├── Index.tsx            ← Home/Dashboard
│   │   ├── DPIAWizard.tsx       ← Assessment creation
│   │   ├── Assessments.tsx      ← Assessment list/history
│   │   ├── Reports.tsx          ← Report generation
│   │   ├── ThreatModeling.tsx   ← Threat catalog
│   │   ├── RiskCalculator.tsx   ← Risk scoring
│   │   ├── ThirdParty.tsx       ← Vendor management
│   │   ├── DocumentAnalysis.tsx ← File upload/analysis
│   │   ├── AIModule.tsx         ← AI features
│   │   ├── TeamCommunication.tsx ← Team collaboration
│   │   ├── Community.tsx        ← Community page
│   │   ├── Settings.tsx         ← User settings
│   │   └── FeatureGuide.tsx     ← In-app feature documentation
│   │
│   ├── components/              ← Reusable UI components
│   │   ├── ui/                  ← Design system (buttons, cards, etc.)
│   │   ├── layout/              ← Page layout components
│   │   ├── wizard/              ← Assessment wizard steps
│   │   ├── reports/             ← Report generation UI
│   │   ├── document/            ← Document upload/analysis
│   │   ├── dashboard/           ← Dashboard widgets
│   │   └── [other]/             ← Feature-specific components
│   │
│   ├── lib/                     ← Utility functions & helpers
│   │   ├── exportTemplates/     ← Report export formats
│   │   ├── supabase.ts          ← Database connection
│   │   └── [utilities]/         ← Other helper functions
│   │
│   ├── contexts/                ← Shared application state
│   │   ├── AssessmentsContext   ← Assessment data
│   │   └── EnterpriseConfigContext ← Settings & config
│   │
│   ├── hooks/                   ← Custom React hooks
│   ├── integrations/            ← Third-party service integrations
│   ├── data/                    ← Static data (templates, categories)
│   └── config/                  ← App configuration files
│
├── ⚙️ supabase/                 ← Backend Infrastructure
│   ├── functions/               ← Serverless functions (AI, analysis)
│   │   ├── analyze-document/    ← Document processing
│   │   └── dpia-to-policy/      ← Policy conversion
│   ├── migrations/              ← Database schema changes
│   └── config.toml              ← Supabase configuration
│
├── 📦 Package Files
│   ├── package.json             ← Project dependencies
│   ├── tsconfig.json            ← TypeScript configuration
│   ├── vite.config.ts           ← Build tool configuration
│   └── index.html               ← HTML entry point
│
├── 🚀 Deployment & Testing
│   ├── .github/                 ← GitHub configuration
│   ├── UAT_DPIA_Platform.md     ← User acceptance test scenarios
│   └── .lovable/                ← Lovable.dev configuration
│
└── .gitignore                   ← Files not tracked by Git
```

---

## 📖 How to Use This Guide

### **For Non-Technical Team Members:**

1. **Want to see what the app looks like?**
   - Check the home page (Index.tsx) to understand the main interface
   - See the pages/ folder to find all user-facing screens

2. **Need to understand a feature?**
   - Open FEATURE_GUIDE.md for detailed feature descriptions
   - Look in src/pages/ to see where that feature is implemented

3. **Want to add a new page or feature?**
   - Create a new file in src/pages/ for new pages
   - Create components in src/components/ for reusable pieces

4. **Need to toggle features on/off?**
   - Edit config/features.json
   - No code changes needed — just change true/false

### **For Technical Team Members:**

1. **Understanding the architecture?**
   - Read docs/ARCHITECTURE.md for system design
   - Study src/contexts/ for state management

2. **Adding new database tables?**
   - Create a migration file in supabase/migrations/
   - Update the schema documentation

3. **Creating new API functions?**
   - Add files to supabase/functions/
   - Follow the pattern of existing functions

4. **Building UI components?**
   - Use shadcn/ui components from src/components/ui/
   - Create reusable components in src/components/

---

## 🔑 Key Files Explained

| File | Purpose | Who Needs It |
|------|---------|-------------|
| **README.md** | Project overview & quick start | Everyone |
| **ROADMAP.md** | What's coming next | Managers, Product |
| **FEATURE_GUIDE.md** | Detailed feature documentation | Everyone |
| **docs/ARCHITECTURE.md** | How the system works | Engineers |
| **docs/INSTALLATION.md** | Setup instructions | Engineers, DevOps |
| **config/features.json** | Feature toggles | Managers, QA |
| **UAT_DPIA_Platform.md** | Testing checklist | QA, Product |
| **.github/** | CI/CD pipelines | DevOps, Engineers |

---

## 🌿 Branching Strategy

The project uses the following branch structure:

- **main** ← Stable, production-ready code
  - Only merged code with testing and reviews
  - Direct edits to README/docs are OK for documentation
  
- **feature/*** ← Feature development branches
  - One feature per branch (e.g., feature/threat-modeling)
  - Merged to main via pull request when complete
  
- **experimental/*** ← Experimental work (if needed)
  - Not merged to main until reviewed and stabilized
  - For testing new ideas or major refactors

---

## 📅 Testing Before Sync

**Always follow these steps before pushing code to GitHub:**

### Step 1: Local Testing
```bash
# Install latest dependencies
npm install

# Run the app locally
npm run dev

# Visit http://localhost:5173 and test your changes
```

### Step 2: Build Test
```bash
# Make sure the build succeeds
npm run build

# Check for any errors in the console
```

### Step 3: Code Quality
```bash
# Check for linting issues
npm run lint

# Fix issues automatically
npm run lint -- --fix
```

### Step 4: Manual Feature Testing
- Test the feature you changed in the running app
- Test related features to ensure nothing broke
- Check both desktop and mobile views
- Test edge cases (empty states, errors, etc.)

### Step 5: Git Commit
```bash
# Stage your changes
git add .

# Commit with a clear message
git commit -m "feat: description of what changed"

# Push to your branch
git push origin feature/your-feature-name
```

### Step 6: Create Pull Request (if applicable)
- On GitHub, create a PR from your branch to main
- Include a clear description of changes
- Link to any related issues
- Request review from team members

### Step 7: Merge to Main
- After review and approval, merge to main
- Delete the feature branch
- Pull latest main locally to stay in sync

---

## 🔄 Daily Workflow for Non-Engineers

1. **At start of day:**
   ```bash
   git pull origin main  # Get latest changes
   npm install           # Update dependencies if needed
   npm run dev           # Start the app
   ```

2. **During the day:**
   - Make changes in the app
   - Test them locally in the browser
   - Take notes of any issues

3. **Before leaving:**
   ```bash
   git add .
   git commit -m "brief description"
   git push origin main
   ```

---

## ❓ Common Questions

**Q: Where do I add a new page to the app?**
A: Create a new file in `src/pages/` and add a route in `src/App.tsx`

**Q: How do I change something visible on the screen?**
A: Find the corresponding file in `src/pages/` or `src/components/` and edit it

**Q: What if I break something?**
A: Use `git checkout -- filename` to undo changes, or `git reset --hard` to undo everything

**Q: Where do I change the database?**
A: Create a new migration in `supabase/migrations/` — never edit the schema directly

**Q: How do I test without breaking the live version?**
A: Test locally with `npm run dev` first, then push to a feature branch, then create a pull request

---

## 🎯 Next Steps

1. **Read FEATURE_GUIDE.md** for a tour of all features
2. **Read docs/INSTALLATION.md** to set up locally
3. **Check the ROADMAP.md** to see what's planned
4. **Join the community** in the Community page of the app

---

*Last updated: June 8, 2026*
