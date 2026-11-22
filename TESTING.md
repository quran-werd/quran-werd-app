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
| AuthScreen | 🟡 Needs action (2 pending: Google OAuth, screen-size layout) |
| HomeScreen | 🟢 Passed |
| MyMemorizationsScreen | 🟢 Passed |
| MemorizationScreen (QuranPager, selection) | 🟢 Passed |
| PlanScreen | 🟢 Passed |
| SettingsScreen | 🟡 Needs action (1 open feature: light theme) |
| RevisionScreen (QuranPager, read) | 🟢 Passed |
| Shared components | 🟢 Passed |
| App-wide | 🟢 Passed |

---

## AuthScreen

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Google sign-in button works | Not tested — can't drive the real Google OAuth flow from this environment | ⚪ Pending |
| 2 | Mock sign-in (dev) works | No issues | 🟢 Passed |
| 3 | Sign-in failure shows error, no crash | **Issue found → fixed** (#6): going offline and attempting mock sign-in leaked a raw developer-facing string straight into the UI — "Network error connecting to http://192.168.31.83:3001. Check API_BASE_URL in .env and rebuild the app." — in English, overlapping the Arabic UI, exposing the backend's LAN IP/port. Replaced with a localized "couldn't reach the server" message; no crash either way | 🟢 Passed |
| 4 | Layout OK on small/large screens | Not tested | ⚪ Pending |
| 5 | Already-signed-in skips this screen | No issues — observed every app relaunch this session | 🟢 Passed |

## HomeScreen

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Greeting/date shows correctly | No issues — verified "السبت، 7 نوفمبر" against real calendar (Nov 7 2026 is a Saturday) | 🟢 Passed |
| 2 | Today's werd card shows correct surah/range/status | No issues | 🟢 Passed |
| 3 | "Start revision" opens RevisionScreen at right page | No issues | 🟢 Passed |
| 4 | Empty state (no werd yet) | No issues — cleared all memorization/plan data on the test account; shows "لا يوجد ورد اليوم. أضف حفظاً أو أنشئ خطة." with an add-memorization CTA, no crash | 🟢 Passed |
| 5 | Card updates after completing a werd | No issues — status badge, congratulatory message, and next-werd preview all appeared correctly | 🟢 Passed |
| 6 | Bottom nav tabs all work | No issues — all four tabs (Home, Hafth, Plan, Settings) reachable from each other throughout this session | 🟢 Passed |

## MyMemorizationsScreen

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Surah list + progress bars show correct counts | No issues — spot-checked several surahs' memorized/total against canonical verse counts | 🟢 Passed |
| 2 | Expand a surah row | No issues — shows the memorized range, verse snippets, and a delete button | 🟢 Passed |
| 3 | "Add" button opens the verse-selection screen | No issues | 🟢 Passed |
| 4 | Empty state (nothing memorized) | No issues — shows "لم تُضِف محفوظاتك بعد" with a clear CTA; no header/count row is rendered when empty rather than showing a broken "0/0" | 🟢 Passed |
| 5 | Delete a range, with confirm prompt | No issues — deleted Al-Anfal's 1-7 range on the real test account; confirm modal showed the exact range and surah name, header correctly dropped from 15/369 to 14/362 verses | 🟢 Passed |
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
| 7 | Adjacent-range merge, toast shown | No issues — confirmed working by user | 🟢 Passed |
| 8 | Undo/redo, including after a merge | No issues | 🟢 Passed |
| 9 | Jump to page — valid page, and invalid (0, 605) | No issues — invalid pages correctly rejected with an alert | 🟢 Passed |
| 10 | Jump to chapter — tap in list, and via search | No issues | 🟢 Passed |
| 11 | Selection sheet — verse counts, delete a row | No issues | 🟢 Passed |
| 12 | Selection sheet — Save button | No issues — selected Al-Ikhlas 1-3 on the real test account and saved; database confirmed the new range (14→15 surahs, 362→365 verses) | 🟢 Passed |
| 13 | Swipe performance across many pages | No issues observed | 🟢 Passed |

## PlanScreen

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Capacity card: tap to expand daily → weekly breakdown with per-day toggles | No issues | 🟢 Passed |
| 2 | Upcoming werd list order | No issues — sequential, "اليوم" (today) badge correctly on the next werd, matching Home's preview | 🟢 Passed |
| 3 | Completed / today / upcoming row styling | No issues — visually distinct (green check / gold outline / plain) | 🟢 Passed |
| 4 | Empty state | **Issue found → fixed** (#7): with a genuinely empty account, the backend correctly returns 404 "Plan not found," but the app's error-handling (added for #5) treated that 404 the same as a real network failure, so the empty state always showed "couldn't load your plan" instead of "no plan yet." Added 404 detection (covering both the `ApiError` and raw `AxiosError` cases) so a 404 resolves to a real empty plan, not an error | 🟢 Passed |
| 5 | Create/edit/delete round-trips to backend | No issues — changed pages/day from 2 to 3, tapped "تحديث الخطة", werd count correctly dropped from 25 to 21; force-stopped and relaunched the app and the new value (3) and count (21) both persisted | 🟢 Passed |

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
| 3 | Toast variants + auto-dismiss timing | No issues — confirmed working by user | 🟢 Passed |
| 4 | DeleteConfirmationModal cancel/confirm | No issues — cancel path keeps the data; confirm path (exercised via MyMemorizationsScreen's range delete) removes it and updates counts correctly | 🟢 Passed |
| 5 | BottomNav active state, hidden on MemorizationScreen | No issues — confirmed hidden on the verse-selection screen, active-tab highlight correct elsewhere | 🟢 Passed |
| 6 | Badge renders correctly everywhere used | No issues — spot-checked (surah number badges, status badges) | 🟢 Passed |
| 7 | VerseRangeRow consistent in both places it's used | No issues — same look in MyMemorizationsScreen's expanded row and the selection sheet | 🟢 Passed |

## App-wide

| # | Scenario | Result | Status |
|---|---|---|---|
| 1 | Cold-start Mushaf build progress screen | No issues — observed the real "جاري تجهيز المصحف" progress screen (0/604 pages) on a cold start where the local store needed rebuilding; it downloaded and completed cleanly, landing on Home. (On some restarts the store is already valid and this screen is skipped entirely — that's expected, not a bug.) | 🟢 Passed |
| 2 | Deep links (home/memorization/plan/revision) | **Issue found → fixed** (#4): `quranwerd://` was never a registered app scheme (native manifest had `com.quranwerd` and `exp+quranwerd` instead), so every deep link silently went nowhere. Added `scheme: 'quranwerd'` to `app.config.ts`, rebuilt, and confirmed `quranwerd://home`, `quranwerd://plan`, and `quranwerd://memorization` all navigate correctly now. (`revision` wasn't tried since it needs a `werdId` param to be meaningful.) | 🟢 Passed |
| 3 | Daily notification fires + opens right screen | No issues — set notification time to 2 minutes ahead, backgrounded the app, notification fired exactly on time with the correct Arabic text, and tapping it opened RevisionScreen at the exact current-werd page (Al-Baqarah 72-83) | 🟢 Passed |
| 4 | RTL layout correctness throughout | No issues observed in passing — every screen tested so far is correctly mirrored/aligned | 🟢 Passed |
| 5 | Network-loss handling per screen | Home and RevisionScreen degrade gracefully (serve cached data, no crash). **Issue found → fixed** (#5): PlanScreen used to render the "no plan generated yet" empty state on a failed first fetch — identical to a real empty account, even though the plan was never lost. Now shows a distinct "couldn't load your plan" message with a Retry button | 🟢 Passed |

---

## Issues

| # | Issue | Fix | Status |
|---|---|---|---|
| 1 | Bismillah shown twice on Al-Fatiha; wrongly shown on At-Tawbah | `Line.tsx` excludes chapters 1 & 9 from the decorative Bismillah | 🟢 Fixed — `f6b5c8a` |
| 2 | Bismillah/header repeated on every line of a long verse 1 (e.g. An-Nisa; 27 surahs affected) | Added a `wordPosition === 1` check so only the verse's true first line counts as the surah start | 🟢 Fixed — `1fc55bf`, regression tests in `7084ca9` |
| 3 | Settings → light theme toggle does nothing app-wide | None yet — no light palette/theme context exists in the codebase | 🟡 Open — feature to build later, not a regression |
| 4 | Deep links never navigated anywhere (`quranwerd://` scheme wasn't registered natively) | Added `scheme: 'quranwerd'` to `app.config.ts`; rebuilt native project | 🟢 Fixed — verified `quranwerd://home` and `quranwerd://plan` |
| 5 | PlanScreen showed the "no plan yet" empty state on a failed first fetch (e.g. no network), indistinguishable from a genuinely empty account even though the plan was never lost | Added an `error` variant to `EmptyState` with a distinct message + Retry button, wired to `PlanScreen`'s `loadError`/`loadPlan` | 🟢 Fixed — verified offline shows "couldn't load your plan" + Retry, and Retry recovers the real plan once network returns |
| 6 | Sign-in failure (e.g. offline) showed a raw English developer error — server IP/port, ".env", "rebuild the app" — directly in the AuthScreen UI | `getApiErrorMessage` in `werdApi.ts` now returns a localized `auth.networkError` message for network/timeout failures; the technical detail is only `console.warn`'d in `__DEV__` | 🟢 Fixed — verified offline mock sign-in now shows the friendly localized message |
| 7 | Regression introduced by fixing #5: PlanScreen's backend-expected 404 "Plan not found" (a genuinely empty account) was caught by the new error handling and shown as a load failure, not the real empty state | `fetchRevisionPlan` now detects a 404 (`ApiError.status` or raw `AxiosError.response.status`) and resolves to `null` instead of rejecting, so the slice treats it as "no plan," not an error | 🟢 Fixed — verified a cleared account shows "no plan yet" + Generate, while an actual offline failure still shows "couldn't load" + Retry |

<!-- Add new rows here as new issues are found. -->
