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
npx expo-doctor    # diagnose dependency/config issues
```

Add packages with `npx expo install <package>` so versions match the Expo SDK.
