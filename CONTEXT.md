# Quran Werd App

A React Native app for memorizing and revising the Quran, centered on a page-accurate Mushaf reader (the QuranPager).

## Language

**Mushaf Local Store**:
The on-device, runtime-built dataset that the QuranPager renders from: word-level glyph codes, line/position layout, ayah text, and surah/page/ayah locator maps for all 604 pages. Built once, on first app launch, by fetching every page from the Quran.com CDN; persisted as a single JSON file via expo-file-system. Not present until the first-launch build completes.
_Avoid_: cache (ambiguous — see Mushaf Locator Cache), quran cache, local cache

**Mushaf Locator Cache**:
The server-side (`quran-werd-server`) build-time snapshot at `src/data/quranMaps.mushaf2.cache.json` — `ayahMap`/`surahMap`/`pageMap` only, no text or glyph data, generated from the Quran Foundation API and committed to the repo. A different artifact from the Mushaf Local Store: build-time vs runtime, repo-committed vs device-persisted, locator-only vs full render data.
_Avoid_: quranMaps cache, the cache (when the app-side store is meant)

**mushaf2**:
The QDC mushafId 2 layout — Hafs riwayah, Uthmani script, 15-line Madani mushaf, 604 pages. The only mushaf layout this app supports. Both the Mushaf Locator Cache and the Mushaf Local Store are built against this layout.

**QCF v1 glyph**:
A single word's rendering codepoint (`codeV1`) into a page-specific QCF v1 font (`p{N}.ttf`, one font per page, 604 total, ~94MB). Not bundled in the binary: downloaded on first launch right after the Mushaf Local Store page data from the Quran Foundation CDN (`verses.quran.foundation/fonts/quran/hafs/v1/ttf/`, fallback `static.qurancdn.com`), cached under `documentDirectory/qcf-fonts/v1/`, and registered per page with `Font.loadAsync` on first view (`src/services/qcfFonts`). The Pager renders words by codepoint into these fonts, not by drawing Uthmani Unicode text directly. `codeV1` values must come from the same data generation as the fonts (both from Quran.com / Quran Foundation CDNs) — a mismatched source produces garbled glyphs.
_Avoid_: word text, glyph text (these suggest plain Unicode, not codepoint-into-font rendering)

**Mushaf data version**:
A version constant that stamps the Mushaf Local Store when built. Bumped deliberately in app code only when the underlying page data changes (font files are versioned separately by `QCF_FONTS_VERSION`) (e.g. a glyph correction ships) — not on every app release. On launch, a version mismatch between the stored value and the app's expected value triggers a full rebuild of the Local Store.

**Werd status — completed vs. finished**:
A single werd (revision unit) is `completed` once the user finishes reviewing it. The whole `RevisionPlan` is `finished` once its last werd is completed — a distinct, terminal, plan-level state, not just another werd-level outcome. UI built against `revisionSession.status` must treat `finished` as `completed`'s superset state (same visual treatment as completed, plus plan-level affordances like "View Plan"), not a sibling to toggle between.
_Avoid_: "done" (ambiguous between the two), treating `finished` as a fourth interchangeable status alongside `pending`/`completed`

**Locator maps**:
The three lookups the Mushaf Local Store derives while building itself, analogous in shape to the server's Mushaf Locator Cache but sourced from the CDN response instead: ayah→page, surah metadata (Arabic name, ayah count, start/end page), and page→surah ranges. Once built, these are the app's single source of truth for page/surah/ayah lookups, replacing the hand-ported `src/content/page_data.ts` / `surah_data.ts` / `juz_data.ts` files.
