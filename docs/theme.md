# Whitman theme

Status: draft for team review, Sprint 1 (November 2026). Items marked **(pending)** wait on a team decision.

Source: Whitman College brand guide, <https://brand.whitman.edu> (updated October 2026). Where Whitman's poster page lists slightly different hex values, the brand guide wins.

Both apps (`mobile/` and `admin/`) use only the values in this file. To add a color, font or size, change this file first.

## Colors

Name tokens by role (`primary`, `surface`), not by color (`blue`), so a color can change without renaming code.

| Token | Hex | Whitman name | Use for |
| --- | --- | --- | --- |
| `primary` | `#002768` | Blue | Buttons, links, headings, selected tab, station pins |
| `primaryDark` | `#00153E` | Navy | Admin sidebar, pressed states, dark headers |
| `accent` | `#FAC515` | Wheatfield Gold | The one main action on a student screen; active item marker in admin nav |
| `sky` | `#6CB2E2` | Whitman Sky | Decoration only (illustrations, highlights on navy) |
| `surface` | `#FFFFFF` | White | Cards, sheets, table rows, inputs |
| `background` | `#F0F6FF` | Cool Gray | Screen and page background, table header row |
| `text` | `#191919` | Secondary Black | Body text |
| `textMuted` | `#5B6472` | not in brand | Secondary text, captions, unselected tabs |
| `border` | `#D5DCE6` | not in brand | Dividers, input and card borders |

### Contrast rules (WCAG AA, ratios checked)

- Gold is never text, an icon, or a thin line on white (1.6:1, fails). Put Blue (8.8:1) or Navy (11.1:1) text on a gold fill.
- Sky is never text on white (2.3:1, fails). It passes on Navy (7.7:1).
- Passing pairs: Blue on white 14.1:1, white on Blue 14.1:1, black on Cool Gray 16.2:1, `textMuted` on white 6.0:1.
- Use at most one gold element per screen, so gold always means "the main thing to do here."

### Status colors (pending)

The brand palette has no green, amber or red, so these are functional colors added for bike and rental status. All pass 4.5:1 on white.

| Status | Token | Hex | On white |
| --- | --- | --- | --- |
| Available | `statusAvailable` | `#1E7D32` | 5.2:1 |
| In use | `statusInUse` | `#002768` | 14.1:1 |
| Maintenance | `statusMaintenance` | `#8A5A00` | 5.9:1 |
| Missing or overdue | `statusAlert` | `#B3261E` | 6.5:1 |
| Inactive, or 0 bikes | `statusInactive` | `#5B6472` | 6.0:1 |

Always show status with a text label or icon as well as color. About 1 in 12 men can't tell red from green.

## Typography

| Role | Font | Weights |
| --- | --- | --- |
| Headings (screen titles, section headers) | Lora | 600, 700 |
| Everything else (body, buttons, labels, tables) | Figtree | 400, 500, 600 |

- Lora and Figtree are the brand guide's free alternatives to Whitman's licensed fonts ("Whitman" and Vito). Do not use the licensed fonts.
- Mobile: `@expo-google-fonts/lora` and `@expo-google-fonts/figtree`, added with `npx expo install`. Admin: `next/font/google`.
- Numbers that change (rental timer, bike counts) use Figtree with tabular figures (`fontVariant: ['tabular-nums']` in React Native, `font-variant-numeric: tabular-nums` in CSS) so digits don't jump.

Sizes:

| Style | Mobile (pt) | Admin (px) |
| --- | --- | --- |
| Title (Lora 700) | 28 | 28 |
| Section (Lora 600) | 20 | 20 |
| Body (Figtree 400) | 16 | 15 |
| Label / button (Figtree 600) | 16 | 14 |
| Caption (Figtree 400) | 13 minimum | 13 |
| Rental timer (Figtree 600, tabular) | 40 | n/a |

Mobile text must scale with iOS Dynamic Type. Don't set `allowFontScaling={false}`.

## Spacing and shape

- Spacing scale: 4, 8, 12, 16, 24, 32, 48. Screen side padding is 16 on mobile, 24 on admin.
- Corner radius: 8 for cards, inputs and table containers; 16 for bottom sheets (top corners); fully rounded for the main action button.
- Touch targets on mobile are at least 44 by 44 pt.
- One shadow level, for cards and sheets only.

## Buttons

| Kind | Fill | Text | When |
| --- | --- | --- | --- |
| Main action (student app) | Gold | Navy | One per screen: Scan to unlock, Unlock bike, Return bike |
| Primary | Blue | White | Confirmations and saves (admin Save, Add station) |
| Secondary | White, Blue border | Blue | Alternatives (Choose a bike instead, Cancel) |
| Destructive | White, red border | Red | Deactivate, End rental early, Place hold |

Labels say what happens: "Unlock bike 07", not "OK" or "Submit".

## Navigation

- **Student app (pending):** bottom tab bar with three tabs: Map, My ride, Account. Selected tab Blue, others `textMuted`. The main action button sits above the tab bar.
- **Admin site:** fixed left sidebar, Navy background, white labels. The active item has a 4 px gold bar on the left and a bold label. Sections in order: Dashboard, Stations, Bikes, Rentals, Reports. Below 900 px wide the sidebar collapses behind a menu button. A top bar shows the page title on the left and the signed-in admin with Sign out on the right.

## Logo and name

- Write the name "Whitman Bike Share" as text in Lora.
- Do not use the clock tower logo, the seal or the monogram. The brand guide restricts them, and campus programs need an official lockup approved by the Office of Communications (brand@whitman.edu). **(pending)** Ask ASWC whether to request one.

## Light mode only (MVP)

- Mobile already sets `"userInterfaceStyle": "light"` in `mobile/app.json`.
- Admin: remove the `prefers-color-scheme: dark` block from `admin/app/globals.css` when the theme is wired in.

## Where the tokens go in code

- Mobile: `mobile/src/theme/` (outside `src/app/`, per `mobile/AGENTS.md`), with `colors.ts`, `typography.ts` and `spacing.ts`.
- Admin: CSS variables in `admin/app/globals.css`, named after the tokens above (`--color-primary`, `--color-accent`, and so on).
- The two apps share no code, so keep the values identical by copying from this file.
