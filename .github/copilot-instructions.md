# Project Guidelines

## Purpose
This repository is a starter project for building a browser game with Phaser 4, React 19, TypeScript, and Vite.
It currently serves as a workshop/demo base rather than a finished game product.
The shipped scenes are example scenes used to demonstrate scene transitions and React-to-Phaser communication.

## Architecture
- React bootstraps the application from `src/main.tsx` and renders the UI shell from `src/App.tsx`.
- Phaser is created from `src/game/main.ts` and mounted through `src/PhaserGame.tsx`.
- React and Phaser communicate through `src/game/EventBus.ts`.
- Phaser scenes live under `src/game/scenes/` and must emit `current-scene-ready` when a scene should be exposed back to React.

## Conventions
- Keep the React to Phaser bridge explicit: prefer `PhaserGame.tsx` refs and `EventBus` over hidden globals.
- When adding a new scene that React must access, emit `EventBus.emit('current-scene-ready', this)` from that scene.
- Preserve the existing scene structure (`Boot`, `Preloader`, `MainMenu`, `Game`, `GameOver`) unless a task explicitly changes the flow.
- Treat the current gameplay as placeholder demo behavior; feel free to replace sample text and sample scene logic when the task requires it.

## Build And Run
- Install dependencies with `npm install`.
- Start the development server with `npm run dev` or `npm run dev-nolog`.
- Build production assets with `npm run build` or `npm run build-nolog`.
- Default Vite development URL is `http://localhost:8080`.

## Editing Guidance
- Keep changes minimal and consistent with the existing TypeScript and Phaser coding style.
- Prefer targeted scene changes over broad refactors.
- When changing game behavior, verify whether corresponding React controls in `src/App.tsx` also need updating.