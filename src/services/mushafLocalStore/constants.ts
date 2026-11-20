/**
 * Bump only when the underlying mushaf data or bundled QCF v1 fonts change
 * (e.g. a glyph correction ships). Bumping wipes and rebuilds every
 * on-device Mushaf Local Store on next launch. See CONTEXT.md
 * ("Mushaf data version") and docs/adr/0001-mushaf-local-store-built-on-first-launch.md.
 */
export const MUSHAF_DATA_VERSION = 2;

export const MUSHAF_TOTAL_PAGES = 604;

/** How many pages to fetch concurrently while building the store. */
export const MUSHAF_BUILD_CONCURRENCY = 8;

/** Attempts per page before the build fails and surfaces an error. */
export const MUSHAF_BUILD_PAGE_RETRY_ATTEMPTS = 3;
