---
name: create-pull-request
description: 'Create GitHub pull requests for Phaser game project. Use for: creating PR, branching strategy, PR templates, commit conventions, preparing code for review, branch management.'
---

# Create Pull Request

## When to Use
- Creating a new pull request
- Preparing code for team review
- Following branching workflow
- Structuring PR information
- Managing feature branches

## Branching Strategy

### Branch Naming Conventions
```
feature/<description>     # New features
fix/<description>         # Bug fixes
refactor/<description>    # Code refactoring
docs/<description>        # Documentation updates
test/<description>        # Testing improvements
chore/<description>       # Maintenance tasks
```

Examples:
- `feature/add-enemy-sprites`
- `fix/scene-transition-bug`
- `refactor/eventbus-types`

### Creating a Feature Branch
```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Or from specific branch
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

## Commit Guidelines

### Commit Message Format
```
<type>: <short description>

<optional detailed description>

<optional footer>
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Testing changes
- `style`: Code style/formatting
- `chore`: Maintenance tasks

### Commit Examples
```bash
# Good commits
git commit -m "feat: add enemy spawn system in Game scene"
git commit -m "fix: correct MainMenu button positioning"
git commit -m "refactor: extract EventBus types to separate file"

# Detailed commit
git commit -m "feat: implement power-up system

- Add PowerUp class with sprite rendering
- Integrate with collision detection
- Add score multiplier effect
- Update Game scene with power-up spawning"
```

## Pre-PR Checklist

Before creating a pull request:

### Code Quality
- [ ] Code follows project conventions (see `/dev-conventions`)
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Existing functionality not broken

### Testing
- [ ] Manual testing completed (see `/regression-testing`)
- [ ] All scenes tested if modified
- [ ] React-Phaser communication verified
- [ ] Production build tested (`npm run build-nolog`)

### Code Cleanup
- [ ] Remove debug console.logs
- [ ] Remove commented-out code
- [ ] Format code consistently
- [ ] Remove unused imports

### Documentation
- [ ] Update README if needed
- [ ] Add code comments for complex logic
- [ ] Update relevant documentation

### Git Hygiene
```bash
# Ensure you're on your feature branch
git branch

# Pull latest main
git checkout main
git pull origin main
git checkout feature/your-feature

# Rebase on main (optional but recommended)
git rebase main

# Ensure all changes committed
git status

# Push feature branch
git push origin feature/your-feature-name
```

## Creating the Pull Request

### Option 1: GitHub Web Interface

1. **Push Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Navigate to GitHub**
   - Go to repository on GitHub
   - GitHub shows "Compare & pull request" button
   - Click the button

3. **Fill PR Template**
   - Base branch: `main`
   - Compare branch: your feature branch

### Option 2: GitHub CLI

```bash
# Install GitHub CLI if needed
# sudo apt install gh (Linux)
# brew install gh (macOS)

# Authenticate (first time only)
gh auth login

# Create PR
gh pr create --base main --head feature/your-feature

# With title and body
gh pr create \
  --title "feat: add enemy spawn system" \
  --body "Implements enemy spawning in Game scene with configurable waves"

# Interactive mode
gh pr create
```

## Pull Request Template

### PR Title Format
```
<type>: <clear description>
```

Examples:
- `feat: add enemy wave spawning system`
- `fix: correct scene transition timing`
- `refactor: improve EventBus type safety`

### PR Description Structure

```markdown
## Description
Brief summary of what this PR does and why.

## Changes
- Specific change 1
- Specific change 2
- Specific change 3

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation update
- [ ] Testing improvement

## Testing Done
- [ ] Tested in development (`npm run dev-nolog`)
- [ ] Tested production build (`npm run build-nolog`)
- [ ] All scenes tested
- [ ] No console errors
- [ ] React controls verified

## Screenshots (if applicable)
Add screenshots or GIFs demonstrating the change.

## Related Issues
Closes #123 (if applicable)

## Checklist
- [ ] Code follows project conventions
- [ ] No breaking changes
- [ ] Documentation updated if needed
- [ ] Tested thoroughly
```

## After Creating PR

### Self-Review
1. Review your own PR first
2. Check the "Files changed" tab
3. Add comments on complex sections
4. Verify no unintended changes

### Request Reviewers
```bash
# Add reviewers via GitHub CLI
gh pr edit --add-reviewer username1,username2

# Add labels
gh pr edit --add-label "enhancement"
gh pr edit --add-label "bug"
```

### Monitor CI/CD
- Check GitHub Actions status
- Verify deployment preview if available
- Fix any CI failures immediately

## Common Scenarios

### Update PR After Feedback
```bash
# Make requested changes
git add .
git commit -m "fix: address review feedback"
git push origin feature/your-feature

# PR updates automatically
```

### Sync with Main Branch
```bash
# If main has new commits
git checkout main
git pull origin main
git checkout feature/your-feature
git merge main
# Or: git rebase main

# Resolve conflicts if any
git push origin feature/your-feature
```

### Force Push After Rebase
```bash
# Only if you rebased
git push --force-with-lease origin feature/your-feature
```

## Best Practices

1. **Small, Focused PRs**: One feature or fix per PR
2. **Clear Description**: Explain what and why, not just what
3. **Test Thoroughly**: Before creating PR
4. **Self-Review**: Review your own changes first
5. **Responsive**: Address feedback promptly
6. **Clean History**: Squash fixup commits if needed
7. **Stay Updated**: Keep branch in sync with main

## Draft Pull Requests

For work-in-progress:
```bash
# Create draft PR
gh pr create --draft

# Or via web interface: select "Create draft pull request"

# Mark ready for review when done
gh pr ready
```

## Troubleshooting

### Push Rejected
```bash
# Pull and merge/rebase first
git pull origin feature/your-feature
# Or if you rebased: git push --force-with-lease
```

### Merge Conflicts
```bash
# Update from main
git checkout main
git pull origin main
git checkout feature/your-feature
git merge main

# Resolve conflicts in editor
git add .
git commit -m "merge: resolve conflicts with main"
git push
```

### Wrong Base Branch
- Edit PR on GitHub interface
- Change base branch in PR settings

## Quick Commands Reference

```bash
# Complete workflow
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: add new feature"
npm run build-nolog  # test build
git push origin feature/new-feature
gh pr create

# Update PR
git add .
git commit -m "fix: address review feedback"
git push origin feature/new-feature
```
