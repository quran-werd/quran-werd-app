# Handoff: multi-range verse selection testing

Branch: `ui-refactor-test` (branched from `ui-refactor` at `dd24448`).

## What was fixed

Multi-range selection on the memorization selection screen:

1. **End-first range in one surah** (tap 1:6, then 1:5) was stored inverted. The card showed "6 to 5" with 0 verses and the save payload was inverted. Ranges are now always stored start-first.
2. **End-first range across surahs** (tap 2:3, then 1:7) selected 291 verses (all of Fatiha plus Baqarah 3–286). It now selects 4.
3. **Range spanning 3+ surahs** (112:1 → 114:6) skipped the middle surah (al-Falaq). There is now one range per surah, and middle surahs are included in full.
4. **Merging with an end-first range**: single verses inside it weren't absorbed, so the sheet count and the toolbar count disagreed, and the merge toast fired late. It now merges correctly.

Changes:
- `src/components/QuranPager/utils/verseSelection.utils.ts`:
  - New `orderVerseKeys`.
  - `splitRangeBySurah` now orders the keys and loops over every surah in the range.
  - `getVersesInRange` builds on `splitRangeBySurah`.
  - `mergeOverlappingRanges` sorts by each range's lowest verse.
- `src/features/Memorization/memorizationSelectionSlice.ts`: `addVerseRange` orders the keys before splitting.
- `jest.config.js`: maps `immer` to its CJS build. Without this, any test that imports a slice fails under jest-expo.
- Tests: `__tests__/verseSelection.utils.test.ts`, `__tests__/memorizationSelectionSlice.test.ts` (17 tests).

```bash
npx jest __tests__/verseSelection.utils.test.ts __tests__/memorizationSelectionSlice.test.ts
```

## Verified in the iOS simulator

| Scenario | Result |
|---|---|
| 1:6 → 1:5 | 1 range, 2 verses (5–6) |
| 2:3 → 1:7 | 2 ranges, 4 verses |
| 114:6 → 112:1 (page 604) | 3 ranges, 15 verses (4 + 5 + 6) |
| Page 3: singles 2:7 and 2:9, then 2:12 → 2:6 | merged into 2:6–2:12 (7 verses); sheet and toolbar agree |
| Adjacent merge, undo/redo, add/remove a single verse, delete in the sheet | OK |

## Still to test

- Whether the merge toast appears on *every* merge, or just some. Confirmed it fires on at least one case (two adjacent single-verse taps). Couldn't cleanly re-test multiple non-adjacent singles merging via a middle tap — see note below.

## Verified in the Android emulator (2026-11-04)

Same branch, tested via `adb` scripted taps against a Windows machine (no Mac/iOS simulator available there) after pulling the server's `refactor` branch forward 8 commits to pick up `AUTH_MOCK_GOOGLE` support (not present when this handoff was first written) and fixing a stale local `AUTH_MOCK_LOGIN` wiring.

| Scenario | Result |
|---|---|
| 1:7 → 2:1-3 (cross-surah, start-first) | 2 ranges, 4 verses, stored start-first — matches the already-verified end-first case |
| Undo then redo on the above | Undo cleared the whole selection in one step (not incremental); redo fully restored both ranges correctly |
| 2:4 → 2:8 (crosses the page 2/3 boundary, same surah) | 1 range, 5 verses — merged correctly across the page break |

## New observation: scripted-tap unreliability near the pending banner

When a verse tap starts a pending range, a "حدد نهاية النطاق" banner slides in at the top and pushes all page content down (~140px). A second tap issued at the *same* screen coordinate right after lands on a different verse than intended, because the content has shifted. This produced confusing results in scripted testing (e.g. a confirmed single-verse selection appearing to vanish when a new tap-pair was issued nearby). This is very likely a scripted-tap artifact (instant taps at fixed coordinates, not a real timed human gesture) rather than an app bug, but it's worth a human re-check of "add several single verses in sequence, including near a just-selected one" on a real device/simulator, since the shift itself is real and a fast human tap could plausibly hit it too.

## Known UX issues (not fixed)

- Taps take 1–4 s to render.
- A tap inside an existing multi-verse range is silently ignored when no verse is pending.
- The "pending" toast covers the top ~2 lines of the page.
- Jump sheet: pressing Return already navigates and clears the field, so tapping "انتقل" afterwards shows an "invalid input" alert.
- The sheet's Save button sits in the same strip as the toolbar buttons. A tap made while the sheet is still closing can hit Save. **While testing, take a screenshot before every toolbar tap, and don't press Save** (it writes to the backend).
- There is no "clear all" control. The selection persists after closing the screen.

## Backend note

During testing, Save was pressed once by accident for 1:7 and 2:1–3. Those verses were already memorized, but check the backend for duplicate rows or changed timestamps.

## Setup on a new machine

1. App `.env` (gitignored): `API_BASE_URL=http://localhost:3001`.
2. Backend (`quran-werd-server`): `nvm use 22 && npm start`. It crashes on Node 26 (`SlowBuffer` error). It runs on port 3001.
3. App: `npx expo run:ios` (needs Xcode; tested on an iPhone 17 Pro simulator).
4. Selection screen: Memorization tab → Add button.
