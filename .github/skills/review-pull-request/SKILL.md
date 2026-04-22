---
name: review-pull-request
description: 'Review GitHub pull requests for Phaser game project. Use for: code review, PR feedback, quality assurance, reviewing changes, approving PRs, suggesting improvements.'
---

# Review Pull Request

## When to Use
- Reviewing team member's pull request
- Providing constructive feedback
- Ensuring code quality standards
- Verifying functionality before merge
- Checking for potential issues

## Review Process Overview

### 1. Initial Assessment
- Read PR title and description
- Understand the purpose and scope
- Check PR type (feature, fix, refactor)
- Review linked issues or tasks

### 2. Code Review
- Review file changes carefully
- Check code quality and conventions
- Look for potential bugs or issues
- Verify architecture consistency

### 3. Testing
- Checkout branch locally
- Test functionality
- Verify no regressions

### 4. Provide Feedback
- Comment on specific lines
- Request changes if needed
- Approve if ready to merge

## Accessing the Pull Request

### View PR on GitHub
```bash
# List open PRs
gh pr list

# View specific PR details
gh pr view 123

# View PR in browser
gh pr view 123 --web
```

### Checkout PR Locally
```bash
# Fetch PR branch
gh pr checkout 123

# Or manually
git fetch origin pull/123/head:pr-123
git checkout pr-123

# Or if branch name is known
git fetch origin
git checkout feature/branch-name
```

## Code Review Checklist

### Architecture & Design
- [ ] Changes align with project architecture
- [ ] React-Phaser separation maintained
- [ ] EventBus used correctly for communication
- [ ] Scene structure preserved unless intentionally modified
- [ ] No unnecessary refactoring

### Code Quality (see `/dev-conventions`)
- [ ] TypeScript types used correctly
- [ ] No use of `any` without justification
- [ ] Consistent naming conventions (PascalCase, camelCase)
- [ ] Code is readable and maintainable
- [ ] Functions/methods have single responsibility
- [ ] No duplicate code

### Phaser-Specific
- [ ] Scene lifecycle methods used correctly
- [ ] `EventBus.emit('current-scene-ready', this)` for new scenes
- [ ] Assets loaded in Preloader scene
- [ ] Game logic stays in Phaser scenes
- [ ] No memory leaks (cleanup in scene destroy)

### React-Specific
- [ ] UI logic in React, game logic in Phaser
- [ ] Hooks used appropriately
- [ ] Props typed correctly
- [ ] Component structure logical
- [ ] No unnecessary re-renders

### Code Cleanliness
- [ ] No debug `console.log` statements
- [ ] No commented-out code
- [ ] No unused imports
- [ ] Code formatted consistently
- [ ] No hardcoded values (use constants)

### Security & Performance
- [ ] No security vulnerabilities introduced
- [ ] No performance issues
- [ ] Assets optimized
- [ ] No blocking operations in update loop

### Documentation
- [ ] Complex logic has comments
- [ ] README updated if needed
- [ ] API changes documented
- [ ] Breaking changes highlighted

## Testing the PR

### Local Testing Procedure

1. **Checkout the PR Branch**
   ```bash
   gh pr checkout 123
   ```

2. **Install Dependencies** (if package.json changed)
   ```bash
   npm install
   ```

3. **Test Development Build**
   ```bash
   npm run dev-nolog
   ```
   - Navigate through all scenes
   - Test changed functionality
   - Verify no console errors
   - Check browser console for warnings

4. **Test Production Build**
   ```bash
   npm run build-nolog
   ```
   - Verify build succeeds
   - No TypeScript errors
   - No build warnings

5. **Test Production Preview**
   ```bash
   npx vite preview
   ```
   - Test in production mode
   - Verify assets load correctly
   - Performance check

6. **Run Regression Tests** (see `/regression-testing`)
   - Verify all scenes work
   - Test scene transitions
   - Check EventBus communication
   - Ensure no existing features broken

### Test Cases to Verify
- [ ] All affected scenes work correctly
- [ ] Scene transitions function properly
- [ ] React UI controls work
- [ ] No console errors or warnings
- [ ] Assets load successfully
- [ ] Game performance acceptable
- [ ] Mobile/responsive (if applicable)

## Providing Feedback

### Comment Types

#### 1. Blocking Issues (Request Changes)
Issues that must be fixed before merge:
```markdown
**🚨 Blocking**: This introduces a memory leak. The scene doesn't clean up 
the timer in the destroy method.

Suggested fix:
```typescript
destroy() {
  if (this.gameTimer) {
    this.gameTimer.destroy();
  }
  super.destroy();
}
```
```

#### 2. Suggestions (Non-blocking)
Improvements that would be nice but aren't required:
```markdown
**💡 Suggestion**: Consider extracting this spawn logic into a separate 
SpawnManager class for better reusability.
```

#### 3. Questions
Asking for clarification:
```markdown
**❓ Question**: Why was the EventBus emission removed here? Is this scene 
no longer exposed to React?
```

#### 4. Praise
Acknowledging good work:
```markdown
**✨ Nice**: Great use of TypeScript generics here! Much more type-safe.
```

### Feedback Best Practices

1. **Be Specific**
   - ❌ "This code is unclear"
   - ✅ "Consider renaming `x` to `playerVelocity` for clarity"

2. **Be Constructive**
   - ❌ "This is wrong"
   - ✅ "This could cause issues because... Consider this approach instead..."

3. **Provide Context**
   - Explain why a change is needed
   - Link to documentation or examples
   - Reference project conventions

4. **Suggest Solutions**
   - Don't just point out problems
   - Offer concrete alternatives
   - Provide code examples

5. **Use Line Comments**
   - Comment on specific lines in GitHub
   - Group related comments
   - Be precise about location

## Review Outcomes

### Approve ✅
When to approve:
- Code meets quality standards
- All tests pass
- No blocking issues
- Follows project conventions
- PR description accurate

```bash
# Approve via GitHub CLI
gh pr review 123 --approve --body "LGTM! Code looks good, tested locally."

# Or via web interface
```

### Request Changes 🔴
When changes are needed:
- Blocking issues found
- Tests fail
- Conventions not followed
- Security/performance issues

```bash
# Request changes
gh pr review 123 --request-changes --body "Please address the comments before merging."
```

### Comment 💬
For non-blocking feedback:
- Minor suggestions
- Questions for clarification
- General feedback

```bash
# Add comment without approving/rejecting
gh pr review 123 --comment --body "A few minor suggestions, but looks good overall."
```

## Review Timeline

### Response Time Guidelines
- **First look**: Within 24 hours
- **Detailed review**: Within 48 hours
- **Follow-up**: Within 24 hours after updates

### Review Depth by PR Size
- **Small PR** (<100 lines): Quick but thorough review
- **Medium PR** (100-500 lines): Detailed review, test key features
- **Large PR** (>500 lines): Consider asking to split, or allocate more time

## Common Issues to Watch For

### TypeScript Issues
- Improper type assertions (`as any`)
- Missing type definitions
- Ignored TypeScript errors (`@ts-ignore`)

### Phaser Issues
- Memory leaks (not cleaning up in destroy)
- Assets not preloaded
- Missing scene ready events
- Update loop performance

### React Issues
- Unnecessary re-renders
- Missing dependencies in useEffect
- Props not typed
- Game logic in React components

### General Issues
- Hardcoded values
- Magic numbers
- Duplicate code
- Poor naming
- Missing error handling

## Collaboration

### Discussing Changes
```bash
# View PR conversation
gh pr view 123

# Add comment to PR
gh pr comment 123 --body "Great work on this feature!"

# Reply to review comments on GitHub interface
```

### Pair Review
For complex PRs:
- Schedule synchronous review session
- Screen share and walk through changes
- Discuss architecture decisions
- Resolve questions in real-time

## After Review

### If Approved
- Author can merge PR
- Delete feature branch after merge
- Monitor deployment

### If Changes Requested
- Author addresses feedback
- Makes commits to same branch
- PR updates automatically
- Re-review when ready

### Merge Strategies
- **Squash and merge**: Clean history (preferred for feature branches)
- **Rebase and merge**: Linear history
- **Merge commit**: Preserves full history

## Quick Review Workflow

```bash
# Complete review workflow
gh pr list                          # See open PRs
gh pr checkout 123                  # Checkout PR
npm install                         # Install deps if needed
npm run dev-nolog                   # Test in dev
npm run build-nolog                 # Test build
# ... test functionality ...
gh pr review 123 --approve         # Approve if good
# Or
gh pr review 123 --request-changes # Request changes
```

## Review Templates

### Approval Template
```markdown
## Review Summary
✅ Approved

### Tested
- [x] Dev build
- [x] Production build
- [x] All scenes work correctly
- [x] No console errors

### Code Quality
- Clean, readable code
- Follows project conventions
- Good TypeScript types
- Proper scene structure

Great work! 🎉
```

### Request Changes Template
```markdown
## Review Summary
🔴 Changes Requested

### Issues Found
1. [Line 42] Memory leak: timer not cleaned up in destroy()
2. [Line 78] Missing type definition for `gameState`
3. [Scene.ts] Missing EventBus.emit for scene-ready

### Testing
- ⚠️ Console error when transitioning to GameOver scene
- ✅ Production build works

Please address the issues above and push an update.
```

## Best Practices

1. **Review promptly** - Don't let PRs sit
2. **Test locally** - Don't just read code
3. **Be thorough** - Check all changed files
4. **Be kind** - Constructive, not critical
5. **Ask questions** - Understand intent
6. **Verify tests** - Run regression tests
7. **Check CI** - Ensure automated checks pass
8. **Document feedback** - Clear, actionable comments
