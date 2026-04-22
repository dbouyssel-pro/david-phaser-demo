---
name: dev-conventions
description: 'Development conventions for Phaser 4 + React + TypeScript project. Use for: coding style, architecture patterns, scene structure, EventBus communication, TypeScript best practices, component organization.'
---

# Development Conventions

## When to Use
- Writing or modifying game code
- Adding new Phaser scenes
- Implementing React-Phaser communication
- Structuring TypeScript components
- Following project architecture patterns

## Architecture Overview

### Stack
- **Phaser 4**: Game engine
- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server

### Entry Points
- React bootstraps from `src/main.tsx`
- UI shell renders from `src/App.tsx`
- Phaser initializes from `src/game/main.ts`
- Phaser mounts through `src/PhaserGame.tsx`

### Communication Bridge
- React ↔ Phaser communication via `src/game/EventBus.ts`
- Keep the bridge explicit: use `PhaserGame.tsx` refs and `EventBus`
- Avoid hidden globals

## Scene Structure

### Location
All Phaser scenes live under `src/game/scenes/`

### Standard Scenes
- `Boot.ts`: Initial loading
- `Preloader.ts`: Asset loading
- `MainMenu.ts`: Main menu screen
- `Game.ts`: Gameplay
- `GameOver.ts`: End screen

### Scene Requirements
When adding a new scene that React must access:
```typescript
EventBus.emit('current-scene-ready', this);
```

Emit this event when the scene should be exposed back to React.

## Coding Conventions

### TypeScript Style
- Use TypeScript strict mode
- Prefer explicit types over `any`
- Keep interfaces and types near their usage
- Use consistent naming: PascalCase for classes/components, camelCase for functions/variables

### React Conventions
- Functional components with hooks
- Keep game logic in Phaser, UI logic in React
- When changing game behavior, verify if `src/App.tsx` controls need updating

### Phaser Conventions
- Preserve existing scene structure unless explicitly required to change
- Use scene lifecycle methods appropriately (create, update, etc.)
- Keep scene logic focused and single-responsibility

### Code Changes
- Keep changes minimal and consistent with existing style
- Prefer targeted scene changes over broad refactors
- Treat current gameplay as placeholder demo behavior
- Replace sample logic only when the task explicitly requires it

## File Organization

```
src/
├── main.tsx              # React entry point
├── App.tsx               # React UI shell
├── PhaserGame.tsx        # Phaser mount component
├── game/
│   ├── main.ts          # Phaser initialization
│   ├── EventBus.ts      # Communication bridge
│   └── scenes/          # All game scenes
```

## Best Practices

1. **Separation of Concerns**: Game logic in Phaser, UI logic in React
2. **Explicit Communication**: Always use EventBus for cross-boundary events
3. **Type Safety**: Leverage TypeScript for type checking
4. **Minimal Changes**: Don't refactor unless necessary
5. **Consistent Style**: Match existing code patterns
