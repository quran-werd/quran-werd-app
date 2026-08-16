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
A single word's rendering codepoint (`codeV1`) into a page-specific QCF v1 font (`assets/fonts/qcf/v1/p{N}.ttf`, one font per page, 604 total, already bundled). The Pager renders words by codepoint into these fonts, not by drawing Uthmani Unicode text directly. `codeV1` values must come from the same data generation as the bundled fonts (Quran.com CDN) — a mismatched source produces garbled glyphs.
_Avoid_: word text, glyph text (these suggest plain Unicode, not codepoint-into-font rendering)

**Mushaf data version**:
A version constant that stamps the Mushaf Local Store when built. Bumped deliberately in app code only when the underlying data or bundled fonts change (e.g. a glyph correction ships) — not on every app release. On launch, a version mismatch between the stored value and the app's expected value triggers a full rebuild of the Local Store.

**Locator maps**:
The three lookups the Mushaf Local Store derives while building itself, analogous in shape to the server's Mushaf Locator Cache but sourced from the CDN response instead: ayah→page, surah metadata (Arabic name, ayah count, start/end page), and page→surah ranges. Once built, these are the app's single source of truth for page/surah/ayah lookups, replacing the hand-ported `src/content/page_data.ts` / `surah_data.ts` / `juz_data.ts` files.
