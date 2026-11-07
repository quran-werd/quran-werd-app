# QA Tracker

Manual test log for every screen/component in the app. Branch: `ui-refactor-test`.

**Status:** ⬜ not tested · ✅ passed · 🔴 failed (see Issues)

---

## Progress overview

| Screen | Status |
|---|---|
| AuthScreen | ⬜ |
| HomeScreen | ⬜ |
| MyMemorizationsScreen | ⬜ |
| MemorizationScreen (QuranPager, selection) | 🟡 partial |
| PlanScreen | ⬜ |
| SettingsScreen | ⬜ |
| RevisionScreen (QuranPager, read) | ⬜ |
| Shared components | ⬜ |

---

## AuthScreen

| # | Test | Status |
|---|---|---|
| 1 | Google sign-in button works | ⬜ |
| 2 | Mock sign-in (dev) works | ⬜ |
| 3 | Sign-in failure shows error, no crash | ⬜ |
| 4 | Layout OK on small/large screens | ⬜ |
| 5 | Already-signed-in skips this screen | ⬜ |

## HomeScreen

| # | Test | Status |
|---|---|---|
| 1 | Greeting/date shows correctly | ⬜ |
| 2 | Today's werd card shows correct surah/range/status | ⬜ |
| 3 | "Start revision" opens RevisionScreen at right page | ⬜ |
| 4 | Empty state (no werd yet) | ⬜ |
| 5 | Card updates after completing a werd | ⬜ |
| 6 | Bottom nav tabs all work | ⬜ |

## MyMemorizationsScreen

| # | Test | Status |
|---|---|---|
| 1 | Surah list + progress bars correct | ⬜ |
| 2 | Expand/collapse row shows memorized ranges | ⬜ |
| 3 | "Add" button opens selection screen | ⬜ |
| 4 | Empty state (nothing memorized) | ⬜ |
| 5 | Delete a range works, asks to confirm | ⬜ |
| 6 | Header totals match sum of rows | ⬜ |

## MemorizationScreen (verse selection)

| # | Test | Status |
|---|---|---|
| 1 | Bismillah shown once per surah, incl. long verse-1 surahs | ✅ |
| 2 | At-Tawbah has no Bismillah | ✅ |
| 3 | Basic tap-tap range select (start-first) | ⬜ |
| 4 | Single verse select / deselect / remove | ⬜ |
| 5 | Cross-surah range | ⬜ |
| 6 | Range crossing a page boundary | ⬜ |
| 7 | Adjacent-range merge + toast every time | ⬜ |
| 8 | Undo/redo (incl. after merge) | ⬜ |
| 9 | Jump to page (valid + invalid: 0, negative, >604) | ⬜ |
| 10 | Jump to chapter (tap + search) | ⬜ |
| 11 | Selection sheet: counts correct, delete row, Save | ⬜ |
| 12 | Swipe performance across pages | ⬜ |

## PlanScreen

| # | Test | Status |
|---|---|---|
| 1 | Capacity card shows/edits correctly | ⬜ |
| 2 | Upcoming werd list in correct order | ⬜ |
| 3 | Completed werd row styled distinctly | ⬜ |
| 4 | Empty state | ⬜ |
| 5 | Create/edit/delete round-trips to backend | ⬜ |

## SettingsScreen

| # | Test | Status |
|---|---|---|
| 1 | User card shows correct account | ⬜ |
| 2 | Notification toggle + time picker persist | ⬜ |
| 3 | Other toggles persist | ⬜ |
| 4 | App version/info correct | ⬜ |
| 5 | Sign-out returns to AuthScreen, clears session | ⬜ |

## RevisionScreen (read mode)

| # | Test | Status |
|---|---|---|
| 1 | Opens at correct page for the werd | ⬜ |
| 2 | Swipe through full werd range | ⬜ |
| 3 | "Complete" button enables only at last page | ⬜ |
| 4 | Completing navigates to Home + updates card | ⬜ |
| 5 | No selection UI shown in this mode | ⬜ |
| 6 | Bismillah correctness (spot-check) | ⬜ |

## Shared components

| # | Test | Status |
|---|---|---|
| 1 | Button variants (primary/ghost/disabled/loading) | ⬜ |
| 2 | BottomSheet open/close/backdrop/swipe-down | ⬜ |
| 3 | Toast variants + auto-dismiss timing | ⬜ |
| 4 | DeleteConfirmationModal cancel/confirm | ⬜ |
| 5 | BottomNav active state, hidden on MemorizationScreen | ⬜ |
| 6 | Badge renders correctly everywhere used | ⬜ |
| 7 | VerseRangeRow consistent in both places it's used | ⬜ |

## App-wide

| # | Test | Status |
|---|---|---|
| 1 | Cold-start Mushaf build progress screen | ⬜ |
| 2 | Deep links (home/memorization/plan/revision) | ⬜ |
| 3 | Daily notification fires + opens right screen | ⬜ |
| 4 | RTL layout correctness throughout | ⬜ |
| 5 | Network-loss handling per screen | ⬜ |

---

## Issues

| # | Issue | Fix | Status |
|---|---|---|---|
| 1 | Bismillah shown twice on Al-Fatiha; wrongly shown on At-Tawbah | `Line.tsx` excludes chapters 1 & 9 from the decorative Bismillah | ✅ `f6b5c8a` |
| 2 | Bismillah/header repeated on every line of a long verse 1 (e.g. An-Nisa, 27 surahs affected) | Added `wordPosition === 1` check so only the verse's true first line counts | ✅ `1fc55bf`, tests in `7084ca9` |
