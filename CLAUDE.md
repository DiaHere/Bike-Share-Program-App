# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Execution & Planning

- Plans must only consist of: A 1-3 sentences max summary of the goal, a step by step process plan to achieve the goal, a bulleted list of the exact files to change, and the specific lines of code being added or modified.
- Prioritize simplicity: Propose the simplest, most direct fix first before considering any refactoring.
- Stay in scope: Do not touch, modify, or analyze files outside the immediate request.
- No over-engineering: Avoid adding new design patterns, abstract classes, or interfaces unless explicitly requested.
- Write concise code: Deliver clean, standard code with zero placeholder comments or conversational fluff.


## Repository layout

Prototype bike share app for Whitman College. Top-level folders (no root `package.json` or workspace tooling; run `npm install` inside each):

- `mobile/` — Expo (React Native, TypeScript) rider app. Uses Expo Router: entry is `expo-router/entry`, screens live in `mobile/src/app/` (`_layout.tsx` is the root Stack).
- `admin/` — Next.js (App Router, TypeScript) admin site. Routes live in `admin/app/`.
- `docs/` — Markdown documentation.
- `supabase/` — SQL migrations and seed data for the shared database (not an npm project).

## UI theme

All UI in both apps follows `docs/theme.md` (Whitman College colors, fonts, spacing, buttons and navigation). Read it before writing or changing any screen, and use its tokens instead of hard-coded colors or fonts. If a screen needs something the theme doesn't cover, add it to `docs/theme.md` first.

There is no shared code; the two apps do not import from each other.

## Backend

Supabase (Postgres + row-level security) is the shared backend for both apps; see the Backend section of `README.md`. Both apps are connected through `@supabase/supabase-js`: the client lives in `mobile/src/lib/supabase.ts` and `admin/lib/supabase.ts`. Keys come from env vars (`EXPO_PUBLIC_*` in mobile, `NEXT_PUBLIC_*` in admin); never commit keys.

- Schema: `supabase/migrations/` (run in filename order) and `supabase/seed.sql`. Change the database only through a new migration file, and name it with the version Supabase assigns when it is applied.
- Tables: `stations` and `bikes`. Read live available counts from the `station_availability` view; never store a count. `capacity` is the rack size, not the available count.
- Access: anyone can read, only admins can insert or update, nobody can delete. An admin is a Supabase Auth user with `app_metadata.role = 'admin'` (until the `users` table in Sprint 4). Enforce access with RLS policies rather than client-side checks.
- Mobile reads without sign-in. Admin signs in through `admin/components/AuthGate.tsx` and loads and saves data in `admin/components/DataProvider.tsx`.
- In `mobile/`, add packages with `npx expo install`.

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
