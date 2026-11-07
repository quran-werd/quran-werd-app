# QA Tracker

Manual test log for every screen/component in the app. Branch: `ui-refactor-test`.

Each row is one tested scenario and its result in plain words. "No issues"
means it was actually exercised and worked. "Not tested" means it hasn't
been touched yet. Issue numbers link to the Issues table at the bottom.

---

## Progress overview

| Screen | Status |
|---|---|
| AuthScreen | Not started |
| HomeScreen | Not started |
| MyMemorizationsScreen | In progress |
| MemorizationScreen (QuranPager, selection) | In progress |
| PlanScreen | Not started |
| SettingsScreen | Not started |
| RevisionScreen (QuranPager, read) | Not started |
| Shared components | Not started |

---

## AuthScreen

| # | Scenario | Result |
|---|---|---|
| 1 | Google sign-in button works | Not tested |
| 2 | Mock sign-in (dev) works | Not tested |
| 3 | Sign-in failure shows error, no crash | Not tested |
| 4 | Layout OK on small/large screens | Not tested |
| 5 | Already-signed-in skips this screen | Not tested |

## HomeScreen

| # | Scenario | Result |
|---|---|---|
| 1 | Greeting/date shows correctly | Not tested |
| 2 | Today's werd card shows correct surah/range/status | Not tested |
| 3 | "Start revision" opens RevisionScreen at right page | Not tested |
| 4 | Empty state (no werd yet) | Not tested |
| 5 | Card updates after completing a werd | Not tested |
| 6 | Bottom nav tabs all work | Not tested |

## MyMemorizationsScreen

| # | Scenario | Result |
|---|---|---|
| 1 | Surah list + progress bars show correct counts | No issues — spot-checked several surahs' memorized/total against canonical verse counts |
| 2 | Expand a surah row | No issues — shows the memorized range, verse snippets, and a delete button |
| 3 | "Add" button opens the verse-selection screen | No issues |
| 4 | Empty state (nothing memorized) | Not tested — needs a clean account |
| 5 | Delete a range, with confirm prompt | Not tested — holding off, would delete real dev data |
| 6 | Header's total ayat/surah count matches the data | No issues — cross-checked directly against the database (15 surahs, 369 verses); my first pass misread the surah-count digit as 10 instead of 15, which was my mistake, not a bug |

## MemorizationScreen (verse selection)

| # | Scenario | Result |
|---|---|---|
| 1 | Bismillah shown once per surah, including surahs whose verse 1 spans multiple lines | **Issue found → fixed** (#2) |
| 2 | At-Tawbah shows no Bismillah | **Issue found → fixed** (#1) |
| 3 | Tap-tap range select, start-first | No issues |
| 4 | Single verse select / deselect / remove on third tap | No issues |
| 5 | Cross-surah range select | No issues |
| 6 | Range selection crossing a page boundary | No issues |
| 7 | Adjacent-range merge, toast shown | Saw it fire once; couldn't reliably reproduce via scripted taps to confirm it fires on *every* merge — needs a human re-check, not marked as a confirmed issue |
| 8 | Undo/redo, including after a merge | No issues |
| 9 | Jump to page — valid page, and invalid (0, 605) | No issues — invalid pages correctly rejected with an alert |
| 10 | Jump to chapter — tap in list, and via search | No issues |
| 11 | Selection sheet — verse counts, delete a row | No issues |
| 12 | Selection sheet — Save button | Not tested — writes to the real backend |
| 13 | Swipe performance across many pages | No issues observed |

## PlanScreen

| # | Scenario | Result |
|---|---|---|
| 1 | Capacity card shows/edits correctly | Not tested |
| 2 | Upcoming werd list order | Not tested |
| 3 | Completed werd row styling | Not tested |
| 4 | Empty state | Not tested |
| 5 | Create/edit/delete round-trips to backend | Not tested |

## SettingsScreen

| # | Scenario | Result |
|---|---|---|
| 1 | User card shows correct account | Not tested |
| 2 | Notification toggle + time picker persist | Not tested |
| 3 | Other toggles persist | Not tested |
| 4 | App version/info correct | Not tested |
| 5 | Sign-out returns to AuthScreen, clears session | Not tested |

## RevisionScreen (read mode)

| # | Scenario | Result |
|---|---|---|
| 1 | Opens at correct page for the werd | Not tested |
| 2 | Swipe through full werd range | Not tested |
| 3 | "Complete" button enables only at last page | Not tested |
| 4 | Completing navigates to Home + updates card | Not tested |
| 5 | No selection UI shown in this mode | Not tested |
| 6 | Bismillah correctness (shares code with selection mode) | Not tested here specifically, but fix in #1/#2 applies to both modes |

## Shared components

| # | Scenario | Result |
|---|---|---|
| 1 | Button variants (primary/ghost/disabled/loading) | Not tested |
| 2 | BottomSheet open/close/backdrop/swipe-down | Not tested |
| 3 | Toast variants + auto-dismiss timing | Not tested |
| 4 | DeleteConfirmationModal cancel/confirm | Not tested |
| 5 | BottomNav active state, hidden on MemorizationScreen | Not tested |
| 6 | Badge renders correctly everywhere used | Not tested |
| 7 | VerseRangeRow consistent in both places it's used | Not tested |

## App-wide

| # | Scenario | Result |
|---|---|---|
| 1 | Cold-start Mushaf build progress screen | Not tested |
| 2 | Deep links (home/memorization/plan/revision) | Not tested |
| 3 | Daily notification fires + opens right screen | Not tested |
| 4 | RTL layout correctness throughout | Not tested |
| 5 | Network-loss handling per screen | Not tested |

---

## Issues

| # | Issue | Fix | Status |
|---|---|---|---|
| 1 | Bismillah shown twice on Al-Fatiha; wrongly shown on At-Tawbah | `Line.tsx` excludes chapters 1 & 9 from the decorative Bismillah | Fixed — `f6b5c8a` |
| 2 | Bismillah/header repeated on every line of a long verse 1 (e.g. An-Nisa; 27 surahs affected) | Added a `wordPosition === 1` check so only the verse's true first line counts as the surah start | Fixed — `1fc55bf`, regression tests in `7084ca9` |

<!-- Add new rows here as new issues are found. -->
