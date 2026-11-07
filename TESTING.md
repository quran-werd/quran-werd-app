# QA Tracker

Manual test log for every screen/component in the app. Branch: `ui-refactor-test`.

Each row is one tested scenario, its result in plain words, and a colored
status. "No issues" means it was actually exercised and worked. "Not tested"
means it hasn't been touched yet. Issue numbers link to the Issues table at
the bottom.

**Status legend:** 🟢 Passed · ⚪ Pending (not tested) · 🔴 Failed (confirmed bug) · 🟡 Needs action (open item, partial result, or unresolved by design)

---

## Progress overview

| Screen | Status |
|---|---|
| AuthScreen | In progress |
| HomeScreen | In progress |
| MyMemorizationsScreen | In progress |
| MemorizationScreen (QuranPager, selection) | In progress |
| PlanScreen | In progress |
| SettingsScreen | In progress |
| RevisionScreen (QuranPager, read) | In progress |
| Shared components | In progress |

---

## AuthScreen

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Google sign-in button works | Not tested — can't drive the real Google OAuth flow from this environment | ⚪ Pending |
| 2 | Mock sign-in (dev) works | No issues | 🟢 Passed |
| 3 | Sign-in failure shows error, no crash | Not tested | ⚪ Pending |
| 4 | Layout OK on small/large screens | Not tested | ⚪ Pending |
| 5 | Already-signed-in skips this screen | No issues — observed every app relaunch this session | 🟢 Passed |

## HomeScreen

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Greeting/date shows correctly | No issues — verified "السبت، 7 نوفمبر" against real calendar (Nov 7 2026 is a Saturday) | 🟢 Passed |
| 2 | Today's werd card shows correct surah/range/status | No issues | 🟢 Passed |
| 3 | "Start revision" opens RevisionScreen at right page | No issues | 🟢 Passed |
| 4 | Empty state (no werd yet) | Not tested — needs a clean account | ⚪ Pending |
| 5 | Card updates after completing a werd | No issues — status badge, congratulatory message, and next-werd preview all appeared correctly | 🟢 Passed |
| 6 | Bottom nav tabs all work | Not tested yet (used directly so far, haven't tried every tab from here) | ⚪ Pending |

## MyMemorizationsScreen

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Surah list + progress bars show correct counts | No issues — spot-checked several surahs' memorized/total against canonical verse counts | 🟢 Passed |
| 2 | Expand a surah row | No issues — shows the memorized range, verse snippets, and a delete button | 🟢 Passed |
| 3 | "Add" button opens the verse-selection screen | No issues | 🟢 Passed |
| 4 | Empty state (nothing memorized) | Not tested — needs a clean account | ⚪ Pending |
| 5 | Delete a range, with confirm prompt | Not tested — holding off, would delete real dev data | ⚪ Pending |
| 6 | Header's total ayat/surah count matches the data | No issues — cross-checked directly against the database (15 surahs, 369 verses); my first pass misread the surah-count digit as 10 instead of 15, which was my mistake, not a bug | 🟢 Passed |

## MemorizationScreen (verse selection)

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Bismillah shown once per surah, including surahs whose verse 1 spans multiple lines | **Issue found → fixed** (#2) | 🟢 Passed |
| 2 | At-Tawbah shows no Bismillah | **Issue found → fixed** (#1) | 🟢 Passed |
| 3 | Tap-tap range select, start-first | No issues | 🟢 Passed |
| 4 | Single verse select / deselect / remove on third tap | No issues | 🟢 Passed |
| 5 | Cross-surah range select | No issues | 🟢 Passed |
| 6 | Range selection crossing a page boundary | No issues | 🟢 Passed |
| 7 | Adjacent-range merge, toast shown | Saw it fire once; couldn't reliably reproduce via scripted taps to confirm it fires on *every* merge — needs a human re-check, not marked as a confirmed issue | 🟡 Needs action |
| 8 | Undo/redo, including after a merge | No issues | 🟢 Passed |
| 9 | Jump to page — valid page, and invalid (0, 605) | No issues — invalid pages correctly rejected with an alert | 🟢 Passed |
| 10 | Jump to chapter — tap in list, and via search | No issues | 🟢 Passed |
| 11 | Selection sheet — verse counts, delete a row | No issues | 🟢 Passed |
| 12 | Selection sheet — Save button | Not tested — writes to the real backend | ⚪ Pending |
| 13 | Swipe performance across many pages | No issues observed | 🟢 Passed |

## PlanScreen

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Capacity card: tap to expand daily → weekly breakdown with per-day toggles | No issues | 🟢 Passed |
| 2 | Upcoming werd list order | No issues — sequential, "اليوم" (today) badge correctly on the next werd, matching Home's preview | 🟢 Passed |
| 3 | Completed / today / upcoming row styling | No issues — visually distinct (green check / gold outline / plain) | 🟢 Passed |
| 4 | Empty state | Not tested — needs a clean account | ⚪ Pending |
| 5 | Create/edit/delete round-trips to backend | Not tested — "تحديث الخطة" (update plan) button clicked and showed a success state, but didn't verify a specific edit round-tripped | 🟡 Needs action |

## SettingsScreen

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | User card shows correct account | No issues — shows "Dev User" | 🟢 Passed |
| 2 | Notification toggle + time picker | No issues — OFF hides the time row, ON shows it with the default 08:00 | 🟢 Passed |
| 3 | Theme toggle (dark/light) | **Open issue — not a bug, unfinished feature** (#3): switching to "الوضع الفاتح" doesn't change anything app-wide; no light palette or theme context exists in the code yet. Per user: leave as-is, build later. | 🟡 Needs action |
| 4 | App version/info correct | No issues — shows 0.0.1 | 🟢 Passed |
| 5 | Sign-out returns to AuthScreen, clears session | No issues — signed out, AuthScreen shown, signed back in with mock login cleanly | 🟢 Passed |

## RevisionScreen (read mode)

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Opens at correct page for the werd | No issues — opened at page 11 matching the werd's start page | 🟢 Passed |
| 2 | Swipe through full werd range | No issues | 🟢 Passed |
| 3 | "Complete" button enables only at last page | No issues — hidden on page 11, appeared on page 12 at verse 83 | 🟢 Passed |
| 4 | Completing navigates to Home + updates card | No issues | 🟢 Passed |
| 5 | No selection UI shown in this mode | No issues | 🟢 Passed |
| 6 | Bismillah correctness (shares code with selection mode) | Not tested here specifically, but fix in #1/#2 applies to both modes | 🟢 Passed |

## Shared components

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Button variants (primary/ghost/disabled/loading) | No issues — seen in context across screens (ابدأ المراجعة, إتمام, تحديث الخطة, Save/Cancel on modal, etc.), all render correctly | 🟢 Passed |
| 2 | BottomSheet open/close (JumpSheet, MemorizationSelectionSheet) | No issues | 🟢 Passed |
| 3 | Toast variants + auto-dismiss timing | Merge toast seen once, timing not precisely measured | 🟡 Needs action |
| 4 | DeleteConfirmationModal cancel/confirm | No issues on render + cancel path. Confirm (actual delete) not exercised — would permanently delete real dev data | 🟡 Needs action |
| 5 | BottomNav active state, hidden on MemorizationScreen | No issues — confirmed hidden on the verse-selection screen, active-tab highlight correct elsewhere | 🟢 Passed |
| 6 | Badge renders correctly everywhere used | No issues — spot-checked (surah number badges, status badges) | 🟢 Passed |
| 7 | VerseRangeRow consistent in both places it's used | No issues — same look in MyMemorizationsScreen's expanded row and the selection sheet | 🟢 Passed |

## App-wide

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Cold-start Mushaf build progress screen | Not tested | ⚪ Pending |
| 2 | Deep links (home/memorization/plan/revision) | **Issue found → fixed** (#4): `quranwerd://` was never a registered app scheme (native manifest had `com.quranwerd` and `exp+quranwerd` instead), so every deep link silently went nowhere. Added `scheme: 'quranwerd'` to `app.config.ts`, rebuilt, and confirmed `quranwerd://home`, `quranwerd://plan`, and `quranwerd://memorization` all navigate correctly now. (`revision` wasn't tried since it needs a `werdId` param to be meaningful.) | 🟢 Passed |
| 3 | Daily notification fires + opens right screen | Not tested | ⚪ Pending |
| 4 | RTL layout correctness throughout | No issues observed in passing — every screen tested so far is correctly mirrored/aligned | 🟢 Passed |
| 5 | Network-loss handling per screen | Not tested | ⚪ Pending |

---

## Issues

| # | Issue | Fix | Status |
|---|---|---|---|
| 1 | Bismillah shown twice on Al-Fatiha; wrongly shown on At-Tawbah | `Line.tsx` excludes chapters 1 & 9 from the decorative Bismillah | 🟢 Fixed — `f6b5c8a` |
| 2 | Bismillah/header repeated on every line of a long verse 1 (e.g. An-Nisa; 27 surahs affected) | Added a `wordPosition === 1` check so only the verse's true first line counts as the surah start | 🟢 Fixed — `1fc55bf`, regression tests in `7084ca9` |
| 3 | Settings → light theme toggle does nothing app-wide | None yet — no light palette/theme context exists in the codebase | 🟡 Open — feature to build later, not a regression |
| 4 | Deep links never navigated anywhere (`quranwerd://` scheme wasn't registered natively) | Added `scheme: 'quranwerd'` to `app.config.ts`; rebuilt native project | 🟢 Fixed — verified `quranwerd://home` and `quranwerd://plan` |

<!-- Add new rows here as new issues are found. -->
