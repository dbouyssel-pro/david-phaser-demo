---
name: regression-testing
description: 'Non-regression testing for Phaser game. Use for: testing game functionality, verifying scenes, checking React-Phaser communication, smoke tests, validation before deployment, QA procedures.'
---

# Non-Regression Testing

## When to Use
- Before deploying to production
- After making scene changes
- Verifying React-Phaser communication
- Testing scene transitions
- Validating game functionality
- Quality assurance checks

## Testing Strategy

### Development Server Tests
Test in development mode before building for production.

#### Start Development Server
```bash
# With logs
npm run dev

# Without logs (cleaner output)
npm run dev-nolog
```

Default URL: `http://localhost:8080`

### Manual Testing Checklist

#### Scene Flow Testing
Test all scene transitions in order:

1. **Boot Scene**
   - [ ] Loads without errors
   - [ ] Transitions to Preloader

2. **Preloader Scene**
   - [ ] Shows loading progress
   - [ ] Assets load successfully
   - [ ] Transitions to MainMenu

3. **MainMenu Scene**
   - [ ] Menu displays correctly
   - [ ] Start button is clickable
   - [ ] Transitions to Game scene

4. **Game Scene**
   - [ ] Game initializes properly
   - [ ] Game logic functions as expected
   - [ ] Can transition to GameOver

5. **GameOver Scene**
   - [ ] End screen displays
   - [ ] Restart button works
   - [ ] Returns to appropriate scene

#### React-Phaser Communication Testing

1. **EventBus Validation**
   - [ ] `current-scene-ready` event fires for each scene
   - [ ] React receives scene reference correctly
   - [ ] React UI controls work properly

2. **PhaserGame Component**
   - [ ] Game canvas renders
   - [ ] Canvas has correct dimensions
   - [ ] No console errors on mount

3. **App Controls**
   - [ ] React controls in `App.tsx` function correctly
   - [ ] State changes propagate to Phaser
   - [ ] UI updates reflect game state

### Console Error Testing

#### Browser Console
1. Open browser DevTools (F12)
2. Navigate to Console tab
3. Run through complete game flow
4. Verify:
   - [ ] No JavaScript errors
   - [ ] No 404 asset errors
   - [ ] No TypeScript type errors
   - [ ] No Phaser warnings

#### Build Console
```bash
npm run build-nolog
```

Verify:
- [ ] Build completes without errors
- [ ] No TypeScript compilation errors
- [ ] No asset bundling errors
- [ ] Output directory `dist/` created

### Production Build Testing

After building for production, test the built version:

1. **Build the Project**
   ```bash
   npm run build-nolog
   ```

2. **Serve Production Build Locally**
   ```bash
   npx vite preview
   ```

3. **Test Production Version**
   - [ ] All scenes work identically to dev
   - [ ] Assets load correctly
   - [ ] No console errors
   - [ ] Performance is acceptable

### Asset Loading Testing

Verify all game assets load correctly:

1. **Image Assets**
   - [ ] All sprites visible
   - [ ] No missing texture warnings
   - [ ] Images render at correct size

2. **Audio Assets** (if any)
   - [ ] Sounds play correctly
   - [ ] No audio loading errors

3. **Asset Paths**
   - [ ] Assets load from `public/assets/`
   - [ ] No 404 errors in console

## Regression Test Procedure

### Full Test Run
Execute before each deployment:

1. **Clean Build**
   ```bash
   npm run build-nolog
   ```

2. **Development Test**
   ```bash
   npm run dev-nolog
   ```
   - Run through all scenes
   - Test all interactions
   - Verify React controls

3. **Production Preview Test**
   ```bash
   npx vite preview
   ```
   - Verify production build works
   - Check for any differences from dev

4. **Console Validation**
   - No errors in browser console
   - No build errors
   - No asset loading failures

5. **Deployment Test** (after GitHub Pages deployment)
   - Visit deployed URL
   - Run through full game flow
   - Verify on different browsers if possible

## Known Issues Tracking

Document any known issues or limitations:
- Current gameplay is placeholder demo behavior
- Specific browser compatibility notes
- Performance considerations

## Testing Best Practices

1. **Always test locally** before pushing to main
2. **Test both dev and production** builds
3. **Check console for errors** at each step
4. **Verify all scene transitions** work correctly
5. **Test React-Phaser communication** thoroughly
6. **Clear browser cache** when testing changes
7. **Test on different screen sizes** when possible

## Quick Validation

For quick checks after minor changes:

```bash
# Quick dev test
npm run dev-nolog
# Test scene flow manually
# Check console for errors

# Quick build validation
npm run build-nolog
# Verify build completes successfully
```

## Automated Testing (Future)

Consider adding:
- Unit tests for EventBus
- Component tests for React parts
- Integration tests for scene flow
- Visual regression testing
- Performance benchmarks
