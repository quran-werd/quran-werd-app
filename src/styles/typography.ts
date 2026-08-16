// Font family tokens — resolved via @expo-google-fonts/* useFonts() in App.tsx.
export const fontFamilies = {
  amiriQuran: 'AmiriQuran_400Regular',
  amiri: 'Amiri_400Regular',
  amiriBold: 'Amiri_700Bold',
  cairo: {
    light: 'Cairo_300Light',
    regular: 'Cairo_400Regular',
    semibold: 'Cairo_600SemiBold',
    bold: 'Cairo_700Bold',
  },
} as const;

export type TypographyFamily = 'amiriQuran' | 'amiri' | 'amiriBold' | 'cairo';
export type TypographyLevel =
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'label'
  | 'caption';

// Named size scale — see docs/design.md §1.2.
export const typographyScale: Record<TypographyLevel, number> = {
  heading: 34,
  title: 26,
  subtitle: 20,
  body: 16,
  label: 14,
  caption: 12,
};

// Amiri is a calligraphic script whose ligatures, diacritics, and dots (e.g.
// the two dots above ة) sit taller and lower than Cairo's simple sans-serif
// glyphs. A Cairo-sized line box (~1.3-1.4x) clips them at the top; confirmed
// on-device that 1.4x clips and 2.0x doesn't.
const AMIRI_LINE_HEIGHT_RATIO = 1.6;
const CAIRO_LINE_HEIGHT_RATIO = 1.8;

export function getLineHeight(
  fontSize: number,
  family: TypographyFamily,
): number {
  const ratio =
    family === 'cairo' ? CAIRO_LINE_HEIGHT_RATIO : AMIRI_LINE_HEIGHT_RATIO;
  return fontSize * ratio;
}
