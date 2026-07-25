# وِرد — Project Reference Document

> This document is a comprehensive reference of all decisions made during the planning phase of the project.
> It covers the product vision, tech stack, database schema, API endpoints, screens, business rules, and development phases.
> When implementing any feature, refer to this document first.

---

## 1. Product Overview

### App Name
**وِرد**

### Problem
It is difficult to find someone available to listen to your Quran memorization, especially for people who memorize scattered verses (not necessarily full surahs — they might memorize the beginning and end of a surah but not the middle).

### Solution
A mobile app that lets users define their memorized verse ranges and review them independently, with a daily revision plan and (post-MVP) speech-to-text correction.

### Target Audience
All Quran memorizers — children and adults, whether they memorize full surahs or scattered verses.

---

## 2. Tech Stack

### Frontend
- React Native (iOS + Android)
- Lokalise for i18n — Arabic only for now, but all UI strings must use Lokalise keys from day one
- RTL layout throughout
- Framer Motion for animations

### Backend
- Node.js + Express + Mongoose
- Hosted on Render

### Database
- MongoDB Atlas

### Auth
- Google Login (MVP)
- Passkey + Apple Login + WhatsApp OTP (post-MVP)

### Quran Data
- Fetched from `https://api.qurancdn.com`
- Cached locally on device after first fetch

### Notifications
- Local notifications scheduled on device

### Quran Recitation (Riwaya)
- Hafs only

---

## 3. Design System

### Theme
- Dark Navy + Gold
- Background: `#0C1220`
- Primary accent (Gold): `#C49A3C`
- Card surface: `#131D30`
- Primary text: `#EDE7DC` (warm off-white)
- Muted text: `#8A9AB8` (cool blue-grey)
- Destructive: `#d4183d`

### Typography
- **Amiri Quran** — Quran verse text
- **Amiri** — Arabic display headings, surah names, screen titles, sheet titles
- **Cairo** — All UI labels, buttons, metadata, nav labels

### Direction
- Global `direction: rtl` on all screens
- Exception: time input display uses `direction: ltr` for HH:MM format

### Bottom Navigation (4 tabs)
- الرئيسية (Home)
- المحفوظات (Memorizations)
- الخطة (Plan)
- الإعدادات (Settings)
- Active color: `#C49A3C` / Inactive: `#8A9AB8`
- Present on: Home, Memorizations, Plan, Settings
- Not present on: QuranViewer (MemorizationScreen), ReviewSession (RevisionScreen)

---

## 4. Database Schema

### Users
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "googleId": "string",
  "createdAt": "Date"
}
```

### Memorizations
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "ranges": {
    "2": [
      { "from": 1, "to": 20 },
      { "from": 50, "to": 70 }
    ],
    "3": [
      { "from": 1, "to": 15 }
    ]
  }
}
```
- Key is surah number as string
- Each surah has an array of non-overlapping, non-adjacent ranges
- Ranges are always merged on insert (see Business Rules)

### RevisionPlan
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "dailyCapacity": 20,
  "awrad": [
    {
      "_id": "ObjectId",
      "order": 1,
      "surah": 2,
      "range": { "from": 1, "to": 20 }
    }
  ]
}
```
- `awrad` is an ordered array of revision units
- Each werd is independent — no mixing of surahs per day
- If a range exceeds dailyCapacity, it is split into multiple awrad

### RevisionLog
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "werdId": "ObjectId",
  "status": "completed | skipped",
  "date": "Date"
}
```
- Tracks what the user actually did each day
- Next werd is always calculated from the last completed werdId using the order field — never stored

---

## 5. API Endpoints

### Auth
```
POST /auth/google          # Google OAuth login → return JWT
POST /auth/logout
GET  /auth/me
```

### Memorizations
```
GET    /memorizations
POST   /memorizations/range                        # Triggers merge logic on backend
DELETE /memorizations/range/:surah/:from/:to
```

### Revision Plan
```
GET  /revision-plan
POST /revision-plan/generate
PUT  /revision-plan/capacity                       # Updates dailyCapacity and regenerates full plan
```

### Revision Log
```
GET  /revision-log/today                           # Calculates next werd automatically
POST /revision-log/complete
POST /revision-log/skip
```

---

## 6. Business Rules

### Range Merging
- When adding a new range, check against existing ranges for that surah
- Overlapping ranges → merge into one
- Adjacent ranges (newRange.from === existing.to + 1 or vice versa) → merge
- Always sort ranges by `from` after merging
- Merging is always done on the backend — never trust the client
- Show a merge success toast notification to the user when merging happens

### Plan Generation
- Each werd covers one range only — no cross-surah mixing per day
- If range size ≤ dailyCapacity → one werd for the full range
- If range size > dailyCapacity → split into multiple awrad, each ≤ dailyCapacity
- If a range is smaller than dailyCapacity, it stays as one werd — no filling from another range/surah
- Awrad are ordered sequentially (order: 1, 2, 3, ...)
- Full plan is regenerated when dailyCapacity changes

### Daily Revision Logic
- If user skips a day → same werd repeats the next day
- If user completes all awrad → plan restarts from order: 1 (MVP behavior)
- Next werd = last completed werd order + 1 (calculated, never stored)

### Range Deletion (MVP)
- Only full range deletion is allowed in MVP
- Deletion requires a confirmation modal before proceeding
- Partial range editing (trimming a range) is a post-MVP feature

---

## 7. Screens

### AuthScreen
- App name "وِرد" with geometric ornament and gold underline accent
- Basmala (BasmalaSvg) displayed below the app name
- Subtitle: "رافقك في رحلة حفظ القرآن ومراجعته يوماً بيوم"
- Divider row with label "ابدأ رحلتك"
- Google Sign-In button (white background, LTR internally, official Google G logo)
- Legal note below button: "بالمتابعة فإنك توافق على شروط الاستخدام وسياسة الخصوصية"
- No BottomNav
- Entrance animations via Framer Motion (staggered opacity + y/scale transitions)

### HomeScreen
- Date + greeting (e.g. "السلام عليكم [name]")
- "ورد اليوم" label
- Ward Card showing: surah name, range, and completion status
- Primary CTA button "ابدأ المراجعة" → navigates to RevisionScreen
- If werd is completed → shows congratulations message "أتممت ورد اليوم" instead of the button
- BottomNav present

### MemorizationScreen / QuranViewer (Full-screen, no BottomNav)
- The user browses actual Quran pages (Pager — swipe to navigate, AnimatePresence slide transition)
- Mushaf page rendered on cream parchment card (`#FBF5E8 → #F5ECD8` gradient)
- The user taps directly on ayahs (VerseRows) to define ranges
- **Tap logic:**
  - 1st tap → opens a range (pending state), gold border on verse row, pulsing gold dot indicator, pending toast notification appears
  - 2nd tap on a different ayah → closes the range, green highlight appears on all verses in range at once
  - 2nd tap on same ayah → closes as single-ayah range
  - 3rd tap on same ayah → deletes the range entirely
- Merge success toast notification shown when ranges are auto-merged
- Bottom toolbar: "انتقل" button + "إظهار التحديد (N)" button (shows count, gold when active)
- Undo / Redo buttons in app bar

#### VerseRow States
| State | Background | Right border |
|-------|-----------|-------------|
| normal | transparent | transparent |
| pending | `rgba(196,154,60,0.08)` | `3px solid rgba(196,154,60,0.7)` |
| inRange / rangeStart / rangeEnd | `rgba(100,160,110,0.15)` | transparent |

#### Navigate Bottom Sheet ("انتقل")
- Jump to page: text input + "انتقل" button
- Choose surah: search field + list of all 114 surahs in Quran order
- Each surah row: number + name, below in muted text: ayah count + first page (e.g. "٢٨٦ آية - ص ٢")
- Currently open surah highlighted

#### Selections Bottom Sheet ("إظهار التحديد")
- Header: total ranges count + total ayah count
- Ranges grouped by surah with surah label per group
- Each range card: ayah range, ayah count, text snippet of first and last ayah
- Delete (X) button per range
- "حفظ المحفوظات" button fixed at bottom

### MyMemorizationsScreen
- Header with title "محفوظاتي" + "إضافة" secondary button
- Surahs displayed as collapsible Accordion cards (SurahCard) in Quran order
- Each SurahCard header shows: surah number badge, surah name, total memorized ayahs, progress bar
- Expanded SurahCard shows RangeCards for each range
- Each RangeCard shows: from ayah circle, to ayah circle, verse text snippets, delete button
- Delete requires confirmation modal (centered, not bottom sheet)
- Empty state with CTA to add first memorization
- BottomNav present

### RevisionScreen / ReviewSession (Full-screen, no BottomNav)
- Shows Quran pages for today's werd (Pager — swipe to navigate)
- Mushaf rendered in flowing text mode (not row-by-row)
- "إنهاء المراجعة" button appears only when user reaches the last page of the werd (`hasReachedWard`) → POST /revision-log/complete
- No permanent "تخطي" button visible during review
- Touch swipe gesture: 50px delta threshold on x axis

### PlanScreen
- Header with title
- Plan Goal Card: shows dailyCapacity input + update button (gold gradient), saved state (green)
- Segmented control for view mode: Daily / Weekly
- List of WerdCards in order
  - Today's werd highlighted with gold top bar and special styling
  - Each WerdCard is expandable (Accordion) to show verse preview
- Summary footer (dashed card) with plan totals
- Empty state when no plan generated yet
- BottomNav present

### SettingsScreen
- User card: avatar (Arabic initial), name, email
- Section "التخصيص": theme segmented control (فاتح / داكن / تلقائي)
- Section "التنبيهات": notification toggle + time picker pill
- Section "التطبيق": rate app, contact us, app version
- Sign out row (destructive color `#E05A5A`) separated with extra margin
- BottomNav present

---

## 8. MVP vs Post-MVP

### MVP Includes
- Google Login
- Quran browser (Pager, tap-to-select ranges)
- MyMemorizationsScreen (accordion view + delete with confirmation)
- Revision plan generation based on dailyCapacity (daily + weekly view)
- RevisionScreen ("إنهاء المراجعة" appears on last page)
- HomeScreen (ward card + start button)
- SettingsScreen (theme, notifications, sign out)
- Local daily notifications
- Arabic UI only

### Post-MVP
- Speech-to-text revision with word highlighting and real-time correction
- Progressive plan (speeds up after completing a full cycle)
- Detailed revision statistics
- Passkey authentication
- Apple Login
- WhatsApp OTP
- Partial range editing (trim a range)
- Multi-language support via Lokalise
- Spaced repetition algorithm

---

## 9. Development Phases

### Phase 1 — Setup ✅ (Done)
- Backend: Node.js + Express + Mongoose project setup, MongoDB Atlas connection, folder structure, JWT middleware, error handling
- Frontend: React Native project setup, folder structure, navigation, RTL, Lokalise, services layer, Framer Motion setup

### Phase 2 — Auth
**Backend:** User model, Google OAuth, `/auth/google`, `/auth/logout`, `/auth/me`
**Frontend:** AuthScreen (geometric ornament, Basmala, Google Sign-In, entrance animations), secure JWT storage, auto-redirect after login

### Phase 3 — Memorizations
**Backend:** Memorization model, `mergeRanges.js`, all `/memorizations` endpoints with validation
**Frontend:** MemorizationScreen (Pager + VerseRow tap-to-select + toast notifications + both bottom sheets), MyMemorizationsScreen (accordion SurahCards + RangeCards + delete confirmation modal)

### Phase 4 — Revision Plan
**Backend:** RevisionPlan model, `generatePlan.js`, all `/revision-plan` endpoints
**Frontend:** PlanScreen (Goal Card + daily/weekly segmented control + WerdCard accordion list)

### Phase 5 — Daily Revision
**Backend:** RevisionLog model, all `/revision-log` endpoints, plan restart logic
**Frontend:** HomeScreen (ward card + CTA + completion state), RevisionScreen (Pager + "إنهاء المراجعة" on last page)

### Phase 6 — Settings & Notifications
**Frontend:** SettingsScreen (theme, notifications time picker, sign out), local notification scheduling, deep-link from notification to RevisionScreen

### Phase 7 — Testing & Deployment
- Test all endpoints and business logic (especially merge and plan generation)
- Test on iOS and Android
- Test RTL on all screens
- Test all animations and transitions
- Deploy backend to Render
- Deploy to App Store and Google Play
