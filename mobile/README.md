# Mobile app (Expo)

Rider-facing bike share app built with Expo and React Native (TypeScript).

## Run

```bash
cd mobile
npm install
npm start          # starts the Expo dev server
```

Then either:
- scan the QR code with the **Expo Go** app on your phone, or
- press `i` (iOS simulator, needs Xcode) / `a` (Android emulator, needs Android Studio) / `w` (web).

Shortcuts: `npm run ios`, `npm run android`, `npm run web`.

## Checks

```bash
npx tsc --noEmit   # typecheck
npm run lint       # ESLint (expo lint)
npx expo-doctor    # diagnose dependency/config issues
npm run check:supabase  # confirm .env can reach Supabase
```

## Data

The home screen reads stations and available bikes from the shared Supabase project, using the keys in `.env`. It needs no sign-in. Restart `npm start` after changing `.env`.

## Screens

Navigation uses [Expo Router](https://docs.expo.dev/router/introduction/). Every file in `src/app/` is a screen, and `_layout.tsx` sets up the navigator. Put components, hooks and utilities outside `src/app/` and import them with the `@/` alias (for example `@/components/Button`).

Add packages with `npx expo install <package>` so versions match the Expo SDK.
