// Design tokens — dark navy + gold theme. See docs/design.md §1.1.
export const colors = {
  // Core background / surface colors
  background: '#0C1220',
  card: '#131D30',
  secondary: '#1C2840',
  accent: '#2A3D5C',
  elevatedCard: '#182640',
  elevatedCardEnd: '#0F1829',
  insetSubCard: 'rgba(12,18,32,0.6)',
  modalBackdrop: 'rgba(8,14,24,0.65)',
  modalBackdropLight: 'rgba(8,14,24,0.6)',

  // Primary (gold)
  primary: '#C49A3C',
  primaryHighlight: '#D4A843',
  primaryShadow: '#B08830',
  primaryShimmer: '#E8C06A',
  border: 'rgba(196,154,60,0.18)',
  ring: 'rgba(196,154,60,0.4)',

  // Named gold-opacity steps (recurring across components)
  goldTintSubtle: 'rgba(196,154,60,0.07)',
  goldTintMedium: 'rgba(196,154,60,0.15)',
  goldWashSubtle: 'rgba(196,154,60,0.08)',
  goldWashStrong: 'rgba(196,154,60,0.18)',
  goldBorderFaint: 'rgba(196,154,60,0.08)',
  goldBorderSubtle: 'rgba(196,154,60,0.10)',
  goldBorderMedium: 'rgba(196,154,60,0.18)',
  goldBorderStrong: 'rgba(196,154,60,0.28)',
  goldBorderIntense: 'rgba(196,154,60,0.35)',

  // Text
  foreground: '#EDE7DC',
  mutedForeground: '#8A9AB8',
  dimmedForeground: '#C4BCAE',
  mushafBrown: '#8B6914',
  mushafBrownFaded: 'rgba(139,105,20,0.65)',
  mushafBrownDeep: '#5C3D0A',
  mushafText: '#1A100A',

  // Semantic / state
  destructive: '#d4183d',
  destructiveSettings: '#E05A5A',
  rangeHighlight: 'rgba(100,160,110,0.18)',
  rangeEndpointText: 'rgb(60,130,80)',
  rangeEndpointBorder: 'rgba(100,160,110,0.8)',
  rangeEndpointBg: 'rgba(100,160,110,0.2)',
  mergeSuccess: '#3DA65A',
  mergeSuccessLight: '#62C87A',
  mergeIconBg: 'rgba(80,160,100,0.15)',
  deleteButtonBg: 'rgba(212,24,61,0.08)',
  deleteButtonBorder: 'rgba(212,24,61,0.18)',

  // Mushaf page (cream parchment)
  mushafPageTop: '#FBF5E8',
  mushafPageBottom: '#F5ECD8',

  // Muted/blue-grey opacity steps (icon buttons, ghost buttons, dividers)
  mutedTintFaint: 'rgba(138,154,184,0.08)',
  mutedTintSubtle: 'rgba(138,154,184,0.1)',
  mutedTintMedium: 'rgba(138,154,184,0.15)',
  mutedBorderSubtle: 'rgba(138,154,184,0.12)',
  mutedBorderMedium: 'rgba(138,154,184,0.15)',

  white: '#FFFFFF',
} as const;
