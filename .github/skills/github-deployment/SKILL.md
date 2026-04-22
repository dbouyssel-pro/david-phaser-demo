---
name: github-deployment
description: 'GitHub Pages deployment for Phaser game. Use for: deploying to production, GitHub Actions workflow, building for GitHub Pages, CI/CD pipeline, publish to web.'
---

# GitHub Pages Deployment

## When to Use
- Deploying the game to production
- Setting up GitHub Actions workflow
- Configuring GitHub Pages
- Troubleshooting deployment issues
- Building for web hosting

## Build Configuration

### Vite Configuration
- Production config uses **relative base `'./'`**
- This configuration suits GitHub Pages project deployments
- Config location: `vite/config.prod.mjs`

### Build Commands
```bash
# Production build with logs
npm run build

# Production build without logs (recommended)
npm run build-nolog
```

### Build Validation
Always validate the production build before deployment:
```bash
npm run build-nolog
```

Check the `dist/` folder output for:
- Correct asset paths (relative)
- No broken references
- All assets bundled properly

## Deployment Workflow

### GitHub Actions Configuration
- Workflow file: `.github/workflows/deploy-pages.yml`
- Triggered on: pushes to `main` branch
- Automated deployment to GitHub Pages

### Deployment Process
1. Push code to `main` branch
2. GitHub Actions workflow triggers automatically
3. Build runs with `npm run build-nolog`
4. Artifacts published to GitHub Pages
5. Site available at: `https://<username>.github.io/<repo-name>/`

### Manual Deployment Steps
If setting up deployment for the first time:

1. **Enable GitHub Pages**:
   - Repository Settings → Pages
   - Source: GitHub Actions

2. **Verify Workflow**:
   - Check `.github/workflows/deploy-pages.yml` exists
   - Ensure workflow has proper permissions

3. **Test Build Locally**:
   ```bash
   npm run build-nolog
   ```

4. **Push to Main**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

5. **Monitor Deployment**:
   - GitHub → Actions tab
   - Watch workflow execution
   - Verify deployment success

## Troubleshooting

### Assets Not Loading
- Verify `base: './'` in `vite/config.prod.mjs`
- Check browser console for 404 errors
- Ensure paths are relative, not absolute

### Workflow Fails
- Check Node.js version in workflow
- Verify dependencies install correctly
- Review workflow logs in Actions tab

### Page Not Updating
- Clear browser cache
- Check if workflow completed successfully
- Verify GitHub Pages is enabled
- Wait a few minutes for CDN propagation

## Configuration Reference

### Required Files
- `vite/config.prod.mjs`: Production Vite config with relative base
- `.github/workflows/deploy-pages.yml`: GitHub Actions workflow
- `package.json`: Build scripts

### Environment
- Node.js version: Defined in workflow
- Build output: `dist/` directory
- Base path: Relative (`'./'`)

## Best Practices

1. **Always test locally** with `npm run build-nolog` before pushing
2. **Use build-nolog** for production to avoid log noise
3. **Monitor the Actions tab** after pushing to verify deployment
4. **Keep relative paths** for GitHub Pages compatibility
5. **Validate changes** in the deployed site after successful workflow
