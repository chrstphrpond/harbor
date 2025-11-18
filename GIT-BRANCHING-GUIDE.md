# Git Branching Guide for Harbor

## What Are Branches?

Branches are **parallel versions** of your code. Think of them as separate workspaces where you can make changes without affecting the main codebase.

**Analogy:** Imagine you're writing a book:
- `main` branch = The published version everyone reads
- `feature/chapter-5` branch = Your draft of chapter 5
- `fix/typo-chapter-3` branch = Fixing a typo without touching other chapters

You write drafts in separate branches, review them, then merge them into the main book.

---

## Why Use Branches?

### 1. **Safety**
- Main branch stays stable and deployable
- Experimental features don't break production
- Easy to abandon bad ideas (just delete the branch)

### 2. **Collaboration**
- Multiple developers work simultaneously without conflicts
- Each person works on their own feature branch
- Code review happens before merging to main

### 3. **Organization**
- Clear history of what changed and why
- Easy to track which features are in progress
- Can release some features while others are still being developed

### 4. **Rollback**
- If a feature breaks production, revert just that merge
- Main branch history shows exactly what was added when

---

## Branch Naming Convention for Harbor

We follow a structured naming pattern:

```
<type>/<short-description>

Examples:
- feature/csv-upload
- fix/auth-token-expiry
- refactor/prisma-queries
- docs/api-documentation
- chore/update-dependencies
```

### Branch Types

| Type | Purpose | Example |
|------|---------|---------|
| `feature/` | New functionality | `feature/ai-insights-generator` |
| `fix/` | Bug fixes | `fix/dashboard-chart-rendering` |
| `refactor/` | Code improvements (no behavior change) | `refactor/tenant-service-cleanup` |
| `docs/` | Documentation only | `docs/deployment-guide` |
| `chore/` | Maintenance (dependencies, config) | `chore/upgrade-nestjs-v11` |
| `test/` | Adding/fixing tests | `test/automation-rules-coverage` |
| `hotfix/` | Critical production bugs | `hotfix/security-vulnerability` |

---

## Harbor Branching Strategy

We use **GitHub Flow** - a simple, lightweight workflow perfect for continuous deployment.

### Branch Structure

```
main (always deployable)
  │
  ├── feature/dashboard-charts
  │     └── Working on: Sales trend visualization
  │
  ├── feature/email-notifications
  │     └── Working on: BullMQ email worker
  │
  └── fix/tenant-isolation-bug
        └── Working on: Fixing data leak in queries
```

---

## Workflow Examples

### Example 1: Adding a New Feature (Sales Chart)

**Scenario:** You want to add a sales trend chart to the dashboard.

```bash
# 1. Make sure you're on main and it's up to date
git checkout main
git pull origin main

# 2. Create a new branch
git checkout -b feature/sales-trend-chart

# 3. Work on your feature
# ... edit files ...
# ... test locally ...

# 4. Commit your changes
git add frontend/src/components/charts/sales-trend.tsx
git commit -m "feat: Add sales trend chart component

- Created SalesTrendChart component using Recharts
- Integrated with dashboard metrics API
- Added responsive design for mobile"

# 5. Push to GitHub
git push origin feature/sales-trend-chart

# 6. Open a Pull Request on GitHub
gh pr create --title "Add sales trend chart" --body "Implements sales visualization for dashboard"

# 7. After review and approval, merge to main
# (Done via GitHub UI or CLI)

# 8. Delete the branch (cleanup)
git checkout main
git pull origin main
git branch -d feature/sales-trend-chart
```

---

### Example 2: Fixing a Bug (Auth Token Issue)

**Scenario:** Users are getting logged out too frequently. JWT expiry is too short.

```bash
# 1. Create bug fix branch
git checkout -b fix/jwt-token-expiry

# 2. Fix the issue
# Edit backend/.env.example
# Change JWT_EXPIRATION from 5m to 15m

# 3. Commit
git add backend/.env.example backend/src/auth/auth.service.ts
git commit -m "fix: Increase JWT token expiry to 15 minutes

- Updated JWT_EXPIRATION from 5m to 15m
- Prevents frequent logouts for active users
- Maintains security with refresh token rotation

Fixes #42"

# 4. Push and create PR
git push origin fix/jwt-token-expiry
gh pr create --title "Fix: Increase JWT expiry time" --body "Closes #42"

# 5. After merge, delete branch
git checkout main
git pull
git branch -d fix/jwt-token-expiry
```

---

### Example 3: Multiple Developers Working Simultaneously

**Scenario:** Alice is adding AI insights, Bob is fixing a bug, you're updating docs.

```
main
  │
  ├── feature/ai-insights (Alice)
  │     └── "Working on GPT-4 integration"
  │
  ├── fix/csv-parser-crash (Bob)
  │     └── "Fixing error with malformed CSVs"
  │
  └── docs/setup-guide (You)
        └── "Improving installation instructions"
```

**Why this works:**
- Each person has isolated workspace
- No merge conflicts (different files)
- Can merge in any order
- Main stays stable throughout

---

## When to Create a Branch

### ✅ **Always create a branch for:**

1. **New features** (no matter how small)
   ```bash
   git checkout -b feature/add-export-button
   ```

2. **Bug fixes**
   ```bash
   git checkout -b fix/broken-dashboard-link
   ```

3. **Experiments** ("Let's try this approach")
   ```bash
   git checkout -b experiment/recharts-vs-chartjs
   ```

4. **Refactoring**
   ```bash
   git checkout -b refactor/extract-dashboard-logic
   ```

5. **Documentation updates**
   ```bash
   git checkout -b docs/add-docker-troubleshooting
   ```

### ❌ **Don't create a branch for:**

1. **Fixing typos in README** (can commit directly to main in solo projects)
   - In team projects, still use a branch

2. **Updating .gitignore** (minor, low-risk)
   - Unless it's part of a larger change

**Rule of thumb:** When in doubt, create a branch. It's free and safer.

---

## Pull Requests (PRs)

A **Pull Request** is a formal way to merge your branch into `main`.

### Why Use PRs?

1. **Code Review** - Team members check your code
2. **Automated Testing** - CI runs tests before merge
3. **Discussion** - Comment on specific lines of code
4. **Documentation** - PR description explains changes
5. **Safety** - Prevents accidental breaking changes

### Harbor PR Template

When creating a PR, include:

```markdown
## What Changed
Brief description of your changes.

## Why
Explain the motivation for this change.

## How to Test
1. npm run dev
2. Navigate to /dashboard
3. Verify sales chart displays correctly

## Screenshots (if UI change)
[Attach before/after images]

## Checklist
- [ ] Code follows Harbor style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested on Chrome and Firefox
```

---

## Common Branch Scenarios

### Scenario 1: Working on Long-Running Feature

**Problem:** Your feature takes 2 weeks. Main branch is getting updates. How to stay current?

**Solution:** Regularly merge main into your branch.

```bash
# You're on feature/advanced-analytics
git checkout main
git pull origin main

git checkout feature/advanced-analytics
git merge main  # Bring main's changes into your branch

# Resolve any conflicts
# Continue working
```

**Frequency:** Merge main into your branch every 2-3 days.

---

### Scenario 2: Emergency Hotfix

**Problem:** Production is down! Critical bug needs immediate fix.

**Solution:** Hotfix branch off main, merge directly.

```bash
# Create hotfix branch
git checkout main
git checkout -b hotfix/security-vulnerability

# Fix the critical issue
# ... make changes ...

git commit -m "hotfix: Patch SQL injection vulnerability

CRITICAL: Fixes security issue in tenant query
Deploy immediately after merge"

git push origin hotfix/security-vulnerability

# Create PR with URGENT label
gh pr create --title "HOTFIX: Security vulnerability" --label urgent

# After fast-tracked review, merge and deploy
```

---

### Scenario 3: Abandoned Feature

**Problem:** You built a feature but decided not to use it.

**Solution:** Just delete the branch.

```bash
# Delete local branch
git branch -d feature/experimental-ui

# Delete remote branch
git push origin --delete feature/experimental-ui
```

**No harm done!** Main branch was never affected.

---

## Harbor Workflow for Solo vs Team

### Solo Development (You Working Alone)

**Minimal branching:**
```bash
main
  └── feature/whatever-youre-building
```

**Workflow:**
1. Create branch for each feature
2. Work, commit often
3. Merge to main when done
4. No formal PR needed (but good practice)

**Why still use branches solo?**
- Practice for team collaboration
- Safety net for experiments
- Clean commit history

---

### Team Development (2+ Developers)

**Structured branching:**
```bash
main (protected, requires PR + review)
  │
  ├── feature/user-dashboard (Alice)
  ├── feature/api-rate-limiting (Bob)
  ├── fix/csv-upload-bug (Charlie)
  └── docs/api-guide (You)
```

**Workflow:**
1. Create branch from main
2. Work on your feature
3. Push to GitHub
4. Open PR
5. Wait for code review
6. Address feedback
7. CI tests pass
8. Teammate approves
9. Merge to main
10. Delete branch

**Required:**
- Branch protection on `main`
- At least 1 reviewer approval
- All tests must pass

---

## Branch Protection Rules

For Harbor in production, set these GitHub settings:

### Protect `main` branch:
- ✅ Require pull request before merging
- ✅ Require 1 approval (for teams)
- ✅ Require status checks to pass (CI tests)
- ✅ Require branches to be up to date
- ❌ Do NOT allow force push
- ❌ Do NOT allow deletion

**How to set up:**
1. Go to GitHub repo → Settings → Branches
2. Add rule for `main`
3. Enable protections above

---

## Real Harbor Development Timeline

Here's how branches would look over 2 weeks:

### Week 1
```
Day 1-2: feature/csv-upload → Merged to main
Day 3-5: feature/dashboard-metrics → Merged to main
Day 6: fix/auth-redirect-loop → Merged to main
Day 7: main is stable, deployed to staging
```

### Week 2
```
Day 8-10: feature/ai-insights (in progress)
Day 9: fix/chart-tooltip-overflow → Merged to main
Day 11: feature/ai-insights → Merged to main
Day 12-14: feature/email-alerts (in progress)
```

**Branch lifetime:** 1-5 days typically. Longer branches = more merge conflicts.

---

## Git Commands Cheat Sheet

### Creating & Switching Branches
```bash
# Create new branch
git checkout -b feature/my-feature

# Switch to existing branch
git checkout main

# Create branch without switching
git branch feature/my-feature

# List all branches
git branch -a

# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

### Syncing Branches
```bash
# Get latest from remote
git fetch origin

# Pull latest main
git checkout main
git pull origin main

# Update your branch with main's changes
git checkout feature/my-feature
git merge main

# Alternative: rebase (cleaner history)
git rebase main
```

### Checking Status
```bash
# See current branch
git branch

# See what changed
git status

# See commit history
git log --oneline --graph --all
```

---

## When Things Go Wrong

### "I committed to main by accident!"

```bash
# Move your commit to a new branch
git branch feature/accidental-commit
git reset --hard HEAD~1  # Remove from main
git checkout feature/accidental-commit
```

### "I have merge conflicts!"

```bash
# Merge main into your branch
git checkout feature/my-feature
git merge main

# Git shows conflicts in files
# Edit files, remove conflict markers (<<<<, ====, >>>>)
# Then:
git add .
git commit -m "Merge main into feature/my-feature"
```

### "I need to undo my last commit"

```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Undo commit and discard changes (DANGER!)
git reset --hard HEAD~1
```

---

## Best Practices for Harbor

### 1. **Small, focused branches**
   - ✅ Good: `feature/add-sales-chart`
   - ❌ Bad: `feature/update-entire-dashboard-and-fix-bugs-and-refactor`

### 2. **Descriptive names**
   - ✅ Good: `fix/tenant-isolation-query`
   - ❌ Bad: `fix/bug` or `fix/stuff`

### 3. **Regular commits**
   ```bash
   # Not this:
   git commit -m "worked on dashboard"

   # This:
   git commit -m "feat: Add sales revenue KPI card

   - Created RevenueCard component
   - Fetches data from /api/dashboard/metrics
   - Displays trend indicator with percentage change"
   ```

### 4. **Keep branches short-lived**
   - Merge within 3-5 days
   - Avoid week-long branches (high conflict risk)

### 5. **Pull main frequently**
   ```bash
   # Every morning:
   git checkout main
   git pull origin main
   git checkout feature/my-feature
   git merge main
   ```

### 6. **Delete merged branches**
   ```bash
   # After PR is merged:
   git checkout main
   git pull
   git branch -d feature/merged-feature
   ```

---

## Example: Real Harbor Feature Development

Let's walk through adding **"Export Dashboard to PDF"** feature.

### Step 1: Plan the work
Create GitHub issue #87: "Add PDF export button to dashboard"

### Step 2: Create branch
```bash
git checkout main
git pull origin main
git checkout -b feature/pdf-export
```

### Step 3: Develop
```bash
# Install library
npm install jspdf --save

# Create component
touch frontend/src/components/dashboard/export-button.tsx

# Implement feature
# ... coding ...

# Test locally
npm run dev
# Click export button, verify PDF downloads

# Commit
git add .
git commit -m "feat: Add PDF export for dashboard

- Installed jspdf library
- Created ExportButton component
- Exports current dashboard view as PDF
- Includes charts, KPIs, and timestamp

Closes #87"
```

### Step 4: Push and PR
```bash
git push origin feature/pdf-export

gh pr create \
  --title "Add PDF export to dashboard" \
  --body "Implements #87. Users can now export dashboard as PDF."
```

### Step 5: Code Review
- Teammate reviews code
- Suggests using company logo in header
- You make changes, push again

```bash
# Make changes based on feedback
git add .
git commit -m "Add Harbor logo to exported PDF header"
git push origin feature/pdf-export
```

### Step 6: Merge
- Tests pass ✅
- Reviewer approves ✅
- Merge via GitHub UI

### Step 7: Cleanup
```bash
git checkout main
git pull origin main
git branch -d feature/pdf-export
```

**Done!** Feature is now in main branch and will deploy next.

---

## Comparison: No Branches vs With Branches

### Without Branches (Dangerous)
```
main (everyone commits here)
  ├── Alice commits broken code → Everyone's dev environment breaks
  ├── Bob commits incomplete feature → Staging deploy fails
  └── You can't experiment without risking production
```

**Problems:**
- ❌ Can't deploy (main is always unstable)
- ❌ Can't review code before it affects everyone
- ❌ Can't work on multiple features simultaneously
- ❌ Hard to rollback specific changes

### With Branches (Safe)
```
main (always stable, deployable)
  │
  ├── feature/alice (Alice's isolated workspace)
  ├── feature/bob (Bob's isolated workspace)
  └── feature/you (Your isolated workspace)
```

**Benefits:**
- ✅ Main is always deployable
- ✅ Features reviewed before merge
- ✅ Easy to abandon bad ideas
- ✅ Clear history of what changed when

---

## Summary: When to Use Branches in Harbor

| Situation | Use Branch? | Branch Name Example |
|-----------|-------------|---------------------|
| Adding CSV upload feature | ✅ Yes | `feature/csv-upload` |
| Fixing dashboard bug | ✅ Yes | `fix/dashboard-chart-crash` |
| Updating README typo | ⚠️ Optional (branch if team) | `docs/fix-readme-typo` |
| Refactoring Prisma queries | ✅ Yes | `refactor/optimize-queries` |
| Experimenting with new UI | ✅ Yes | `experiment/new-sidebar-design` |
| Emergency security patch | ✅ Yes | `hotfix/xss-vulnerability` |
| Adding tests | ✅ Yes | `test/automation-coverage` |
| Updating dependencies | ✅ Yes | `chore/update-deps` |

**Golden Rule:** If you're changing code, create a branch. It's safer and professional.

---

## Next Steps for Harbor

1. **Set up branch protection** on GitHub for `main`
2. **Create issue templates** for features/bugs
3. **Set up CI/CD** to run tests on every PR
4. **Write a CONTRIBUTING.md** with branch guidelines

Your repo is now enterprise-ready for team collaboration! 🚀
