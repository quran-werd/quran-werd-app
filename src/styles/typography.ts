import {TextStyle} from 'react-native';
import {colors} from './colors';

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

// Named text styles — see docs/design.md §1.2.
export const typography = {
  homeGreeting: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 26,
    lineHeight: 26 * 1.4,
    color: colors.foreground,
  } as TextStyle,
  wardCardSurahName: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 34,
    lineHeight: 34 * 1.2,
    color: colors.foreground,
  } as TextStyle,
  completionMessage: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 22,
    lineHeight: 22 * 1.5,
    color: colors.foreground,
  } as TextStyle,
  screenTitle: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 28,
    lineHeight: 28 * 1.3,
    color: colors.foreground,
  } as TextStyle,
  screenTitleSmall: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 24,
    color: colors.foreground,
  } as TextStyle,
  sheetTitle: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 20,
    color: colors.foreground,
  } as TextStyle,
  surahCardName: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 20,
    lineHeight: 20 * 1.2,
    color: colors.foreground,
  } as TextStyle,
  surahListRowName: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 17,
    color: colors.foreground,
  } as TextStyle,
  appBarHeading: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 18,
    color: colors.foreground,
  } as TextStyle,
  reviewSessionSurahName: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 16,
    color: colors.foreground,
  } as TextStyle,
  werdSurahName: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 16,
    color: colors.foreground,
  } as TextStyle,
  mushafHeaderSurah: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 15,
    color: colors.mushafBrown,
  } as TextStyle,
  mushafHeaderJuz: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 13,
    color: colors.mushafBrown,
  } as TextStyle,
  verseTextQuranViewer: {
    fontFamily: fontFamilies.amiriQuran,
    fontSize: 20,
    lineHeight: 20 * 2.0,
    letterSpacing: 0.01,
    color: colors.mushafText,
  } as TextStyle,
  verseTextReviewSession: {
    fontFamily: fontFamilies.amiriQuran,
    fontSize: 21,
    lineHeight: 21 * 2.5,
    color: colors.mushafText,
  } as TextStyle,
  verseTextRangeCard: {
    fontFamily: fontFamilies.amiriQuran,
    fontSize: 15,
    lineHeight: 15 * 1.6,
    color: colors.dimmedForeground,
  } as TextStyle,
  verseTextPlanExpanded: {
    fontFamily: fontFamilies.amiriQuran,
    fontSize: 14,
    lineHeight: 14 * 1.6,
    color: colors.dimmedForeground,
  } as TextStyle,
  bodyLabelLarge: {
    fontFamily: fontFamilies.cairo.semibold,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.foreground,
  } as TextStyle,
  bodyLabel: {
    fontFamily: fontFamilies.cairo.regular,
    fontSize: 15,
    color: colors.foreground,
  } as TextStyle,
  subtitleMeta: {
    fontFamily: fontFamilies.cairo.regular,
    fontSize: 14,
    color: colors.mutedForeground,
  } as TextStyle,
  smallLabel: {
    fontFamily: fontFamilies.cairo.regular,
    fontSize: 13,
    color: colors.mutedForeground,
  } as TextStyle,
  extraSmall: {
    fontFamily: fontFamilies.cairo.regular,
    fontSize: 12,
    color: colors.mutedForeground,
  } as TextStyle,
  tinyLabel: {
    fontFamily: fontFamilies.cairo.regular,
    fontSize: 11,
    color: colors.mutedForeground,
  } as TextStyle,
  microLabel: {
    fontFamily: fontFamilies.cairo.bold,
    fontSize: 10,
    color: colors.foreground,
  } as TextStyle,
  microTiny: {
    fontFamily: fontFamilies.cairo.bold,
    fontSize: 9,
    color: colors.mutedForeground,
  } as TextStyle,
  dateStatusLabel: {
    fontFamily: fontFamilies.cairo.regular,
    fontSize: 14,
    // No letterSpacing: Arabic is a connected script, so CSS-style
    // letter-spacing (from design.md's web mockup) breaks glyph joining.
    color: colors.mutedForeground,
  } as TextStyle,
  sectionLabel: {
    fontFamily: fontFamilies.cairo.bold,
    fontSize: 11,
    color: colors.mutedForeground,
  } as TextStyle,
} as const;
