// Whitman theme tokens. Values come from docs/theme.md; change them there first.

export const colors = {
  primary: '#002768',
  primaryDark: '#00153E',
  accent: '#FAC515',
  sky: '#6CB2E2',
  surface: '#FFFFFF',
  background: '#F0F6FF',
  text: '#191919',
  textMuted: '#5B6472',
  border: '#D5DCE6',
  statusAvailable: '#1E7D32',
  statusInUse: '#002768',
  statusMaintenance: '#8A5A00',
  statusAlert: '#B3261E',
  statusInactive: '#5B6472',
} as const;

export const fonts = {
  heading: 'Lora_700Bold',
  headingSemi: 'Lora_600SemiBold',
  body: 'Figtree_400Regular',
  bodyMedium: 'Figtree_500Medium',
  bodySemi: 'Figtree_600SemiBold',
} as const;

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 } as const;

export const radius = { card: 8, sheet: 16 } as const;
