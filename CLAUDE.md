# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Prototype bike share app for Whitman College. Three independent top-level folders (no root `package.json` or workspace tooling; run `npm install` inside each):

- `mobile/` — Expo (React Native, TypeScript) rider app. Uses Expo Router: entry is `expo-router/entry`, screens live in `mobile/src/app/` (`_layout.tsx` is the root Stack).
- `admin/` — Next.js (App Router, TypeScript) admin site. Routes live in `admin/app/`.
- `docs/` — Markdown documentation.

There is no shared code or backend yet; the two apps do not import from each other.

## Commands

Mobile (`cd mobile`):
- `npm start` — Expo dev server (`npm run ios|android|web` for a specific target)
- `npx tsc --noEmit` — typecheck; `npx expo lint` — lint; `npx expo-doctor` — diagnose config
- `npx expo install <pkg>` — add dependencies (not `npm install <pkg>`) so versions match the SDK

Admin (`cd admin`):
- `npm run dev` — dev server on http://localhost:3000
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint

No test runner is configured in either app.

## Version caveats

Both frameworks are newer than typical training data (Expo SDK 58, Next.js 16). Each app has its own `AGENTS.md` that you must follow:
- `mobile/AGENTS.md`: check versioned Expo docs (https://docs.expo.dev/llms.txt) before using Expo/RN APIs; it requires Expo Router under `src/app/` with non-route code kept outside `src/app/`.
- `admin/AGENTS.md`: read the guides in `admin/node_modules/next/dist/docs/` before writing Next.js code.
