# Build the Mushaf Local Store on-device on first launch, not bundled at build time

**Status**: accepted

The QuranPager currently fetches each page's word-level data live from the Quran.com CDN on demand and lazily caches it per-page in AsyncStorage — meaning every user re-downloads the whole mushaf, page by page, as they read, and offline reading is limited to previously-visited pages. We considered bundling a complete word-level dataset into the app binary at build time (mirroring the server's `quranMaps.mushaf2.cache.json`, which is committed to the repo and shipped as-is), but rejected it: word-level glyph data for 604 pages is large enough to meaningfully bloat the app binary and every future data correction would require an app store release just to update static bundled data.

Instead, the app downloads the full mushaf once, on first launch, behind a loading UI, and persists it as a single JSON file via expo-file-system (the Mushaf Local Store). The build is resumable — each page is written to its own temp file as it completes, so an interrupted first launch resumes from the last completed page rather than restarting — and the store is stamped with a Mushaf data version that's bumped only when the underlying data or bundled QCF fonts change, triggering a one-time rebuild for affected users.

This trades a slower, network-dependent first launch for a smaller binary, no per-page network dependency thereafter, and the ability to ship data corrections without an app release-gated binary update.
