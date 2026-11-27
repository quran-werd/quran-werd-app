/**
 * QCF v1 per-page fonts (one TTF per mushaf page, 604 files, ~94MB) are no
 * longer bundled in the binary. They are downloaded on first launch together
 * with the Mushaf Local Store and cached in the app's document directory.
 *
 * Bump QCF_FONTS_VERSION only when the font files themselves change; it is
 * part of the on-device cache directory, so a bump re-downloads every font.
 */
export const QCF_FONTS_VERSION = 'v1';

/**
 * Hosts tried in order for `${base}/p${page}.ttf`. Both are Quran.com /
 * Quran Foundation CDNs serving the same Hafs QCF v1 set the app used to
 * bundle (verified against the bundled files: 601/604 byte-identical on the
 * primary, the rest are minor upstream glyph corrections with the same
 * codepoint coverage).
 */
export const QCF_FONT_BASE_URLS = [
  'https://verses.quran.foundation/fonts/quran/hafs/v1/ttf',
  'https://static.qurancdn.com/fonts/quran/hafs/v1/ttf',
];

export const QCF_TOTAL_PAGES = 604;

/** Parallel downloads during the first-launch bulk download. */
export const QCF_FONT_DOWNLOAD_CONCURRENCY = 6;

/** Attempts per host before moving to the next host. */
export const QCF_FONT_DOWNLOAD_ATTEMPTS = 2;

/** Smallest plausible QCF page font; anything smaller is treated as corrupt. */
export const QCF_FONT_MIN_BYTES = 4 * 1024;
