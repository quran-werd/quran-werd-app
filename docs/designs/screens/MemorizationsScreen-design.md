# محفوظاتي Screen — Complete Design Specification

> Tab screen (BottomNav present). Root direction: `rtl` (inherited from phone frame). Background: `#0C1220`. Two mutually exclusive top-level content states — **Empty** (`displayData.length === 0`) and **Populated** (`displayData.length > 0`). SurahCards have **Collapsed** and **Expanded** sub-states. A **Delete Confirmation Modal** overlays the entire screen when `pendingDelete` is non-null.

---

## Root Container

```
display: flex          /* flex-1 flex flex-col */
flex: 1
flex-direction: column
overflow: hidden
position: relative
```

---

## Ambient Glow Overlay (non-interactive)

```
position: absolute
inset: 0
pointer-events: none
background: radial-gradient(ellipse 70% 30% at 50% 0%,
  rgba(196,154,60,0.05) 0%,
  transparent 60%)
```

---

## 1. Header Block

```
padding: 40px 24px 16px    /* pt-10 px-6 pb-4 */
position: relative
z-index: 10
flex-shrink: 0
```

### 1a. Header inner row

```
display: flex
align-items: flex-start    /* items-start */
justify-content: space-between
```

---

### 1b. Left text column (in RTL = right-reading-order leading side)

Contains: screen title + conditional subtitle.

#### Screen Title `<h1>`

| Property    | Value        |
| ----------- | ------------ |
| Text        | `محفوظاتي`   |
| Font family | Amiri, serif |
| Font size   | 28px         |
| Font weight | 700          |
| Line-height | 1.3          |
| Color       | `#EDE7DC`    |

#### Subtitle `<p>` — visible only when `displayData.length > 0`

| Property      | Value                                                     |
| ------------- | --------------------------------------------------------- |
| Text pattern  | `[totalVerses] آية · [surahCount] سورة`                   |
| Example texts | `٥٨ آية · ٥ سورة` / `٧ آية · ١ سورة` / `١٢٠ آية · ٣ سورة` |
| Font family   | Cairo, sans-serif                                         |
| Font size     | 13px                                                      |
| Font weight   | 400                                                       |
| Color         | `#8A9AB8`                                                 |
| Margin-top    | 2px                                                       |

Separator in text string: `·` (space + U+00B7 MIDDLE DOT + space)

`totalVerses` = sum of `rangeCount(range)` across all ranges of all surah entries.  
`surahCount` = `displayData.length`.

---

### 1c. "إضافة" Button — right side (RTL trailing = left side visually)

```
display: flex
align-items: center
gap: 6px              /* gap-1.5 */
padding: 8px 16px     /* py-2 px-4 */
border-radius: 12px   /* rounded-xl */
transition-opacity
hover: opacity 0.8
background: rgba(196,154,60,0.12)
border: 1px solid rgba(196,154,60,0.25)
cursor: pointer
```

**Plus icon SVG:**

```
viewBox: 0 0 24 24
fill: none
width: 16px           /* w-4 h-4 */
height: 16px
color: #C49A3C
```

```
path d: M12 5v14M5 12h14
stroke: currentColor
strokeWidth: 2
strokeLinecap: round
```

**Label span:**

| Property    | Value             |
| ----------- | ----------------- |
| Text        | `إضافة`           |
| Font family | Cairo, sans-serif |
| Font size   | 13px              |
| Font weight | 600               |
| Color       | `#C49A3C`         |

---

### 1d. Divider line (below header row)

```
margin-top: 16px      /* mt-4 */
height: 1px
background: rgba(196,154,60,0.18)   /* bg-border — CSS var --border */
```

---

## 2. Scrollable Content Area

```
flex: 1
overflow-y: auto
padding: 0 24px 8px   /* px-6 pb-2 */
position: relative
z-index: 10
scrollbar-width: none
```

`AnimatePresence mode="wait"` wraps both state views.

---

## State A — Empty State

Condition: `displayData.length === 0`

`motion.div key="empty"`:

```
initial:    { opacity: 0, y: 16 }
animate:    { opacity: 1, y: 0 }
exit:       { opacity: 0 }
transition: { duration: 0.35 }
```

```
display: flex
flex-direction: column
align-items: center
justify-content: center
padding-top: 64px     /* pt-16 */
gap: 20px             /* gap-5 */
```

---

### A1. Icon Container

```
width: 80px           /* w-20 */
height: 80px          /* h-20 */
border-radius: 16px   /* rounded-2xl */
display: flex
align-items: center
justify-content: center
background: rgba(196,154,60,0.08)
border: 1px solid rgba(196,154,60,0.15)
```

**Open book SVG:**

```
viewBox: 0 0 48 48
fill: none
width: 40px           /* w-10 */
height: 40px          /* h-10 */
```

SVG elements:

| Element             | Coords / d                                                          | Stroke    | strokeWidth | Extra                                                  |
| ------------------- | ------------------------------------------------------------------- | --------- | ----------- | ------------------------------------------------------ |
| Book body path      | `M24 10C24 10 16 7 8 9v28c8-2 16 1 16 1s8-3 16-1V9c-8-2-16 1-16 1z` | `#C49A3C` | 1.5         | `strokeLinejoin: round`, `fill: rgba(196,154,60,0.08)` |
| Centre spine        | `x1=24 y1=10 x2=24 y2=38`                                           | `#C49A3C` | 1.5         | `strokeLinecap: round`                                 |
| Left accent line 1  | `x1=12 y1=15 x2=20 y2=14`                                           | `#C49A3C` | 1           | `strokeLinecap: round`, `opacity: 0.6`                 |
| Left accent line 2  | `x1=12 y1=20 x2=20 y2=19`                                           | `#C49A3C` | 1           | `strokeLinecap: round`, `opacity: 0.6`                 |
| Right accent line 1 | `x1=28 y1=14 x2=36 y2=15`                                           | `#C49A3C` | 1           | `strokeLinecap: round`, `opacity: 0.6`                 |
| Right accent line 2 | `x1=28 y1=19 x2=36 y2=20`                                           | `#C49A3C` | 1           | `strokeLinecap: round`, `opacity: 0.6`                 |

---

### A2. Text Block

```
text-align: center
padding: 0 16px       /* px-4 */
```

**Heading `<p>`:**

| Property    | Value                   |
| ----------- | ----------------------- |
| Text        | `لم تُضِف محفوظاتك بعد` |
| Font family | Amiri, serif            |
| Font size   | 22px                    |
| Font weight | 700                     |
| Line-height | 1.5                     |
| Color       | `#EDE7DC`               |

**Body `<p>`:**

| Property                | Value                            |
| ----------------------- | -------------------------------- |
| Line 1                  | `ابدأ بتحديد الآيات التي تحفظها` |
| Line 2 (after `<br />`) | `مباشرة من صفحات المصحف`         |
| Font family             | Cairo, sans-serif                |
| Font size               | 14px                             |
| Font weight             | 400                              |
| Line-height             | 1.7                              |
| Color                   | `#8A9AB8`                        |
| Margin-top              | 8px                              |

---

### A3. CTA Button

```
padding: 14px 32px    /* py-3.5 px-8 */
border-radius: 16px   /* rounded-2xl */
transition: all 200ms
active: scale(0.97)   /* active:scale-[0.97] */
font-family: Cairo, sans-serif
font-size: 15px
font-weight: 600
color: #0C1220
background: linear-gradient(135deg, #D4A843 0%, #C49A3C 100%)
box-shadow: 0 4px 16px rgba(196,154,60,0.25)
border: none
cursor: pointer
```

Text: `أضف أول محفوظاتك`

---

## State B — Populated List

Condition: `displayData.length > 0`

`motion.div key="list"`:

```
initial:    { opacity: 0 }
animate:    { opacity: 1 }
exit:       { opacity: 0 }
transition: { duration: 0.2 }
```

```
/* space-y-3 pb-4 */
padding-bottom: 16px
```

The `space-y-3` utility adds `margin-top: 12px` to every direct child except the first.

---

### Debug toggle button (developer-only, always visible in populated state)

```
/* text-[10px] text-muted-foreground underline opacity-30 w-full text-center pt-1 */
font-family: Cairo, sans-serif
font-size: 10px
color: rgba(138,154,184,…)   /* --muted-foreground resolved by Tailwind */
text-decoration: underline
opacity: 0.3
width: 100%
text-align: center
padding-top: 4px
```

Text: `عرض الحالة الفارغة`

Tapping sets `isEmpty = true`, which forces `displayData = []`, switching the view to Empty state.

---

### SurahCard wrapper (`motion.div`)

Each card:

```
initial:    { opacity: 0, y: 10 }
animate:    { opacity: 1, y: 0 }
transition: { delay: idx * 0.05, duration: 0.28 }
```

`idx` starts at 0. Example delays: card 0 = 0ms, card 1 = 50ms, card 2 = 100ms, …

---

## SurahCard Component

```
border-radius: 16px   /* rounded-2xl */
overflow: hidden
background: linear-gradient(145deg, #182640 0%, #131D30 100%)
border: 1px solid [see table]
box-shadow: [see table]
transition: border-color 0.25s, box-shadow 0.25s
```

Per state:

| State                      | Border                            | Box-shadow                    |
| -------------------------- | --------------------------------- | ----------------------------- |
| Collapsed (`isOpen=false`) | `1px solid rgba(196,154,60,0.14)` | `0 4px 14px rgba(0,0,0,0.22)` |
| Expanded (`isOpen=true`)   | `1px solid rgba(196,154,60,0.28)` | `0 8px 28px rgba(0,0,0,0.35)` |

---

### Gold hairline (top of every SurahCard)

```
/* h-px w-full */
height: 1px
width: 100%
background: linear-gradient(90deg, transparent, rgba(196,154,60,0.25), transparent)
```

---

### Card header `<button>` (tap to toggle expand/collapse)

```
/* w-full text-right px-4 pt-4 pb-3 flex items-center gap-3 */
width: 100%
text-align: right
padding: 16px 16px 12px 16px
display: flex
align-items: center
gap: 12px
background: transparent
border: none
cursor: pointer
```

---

#### Surah Number Badge

```
/* flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] */
flex-shrink: 0
width: 28px
height: 28px
border-radius: 50%
display: flex
align-items: center
justify-content: center
background: rgba(196,154,60,0.1)
color: #C49A3C
font-family: Cairo, sans-serif
font-size: 11px
font-weight: 700
```

Text: `toArabicNum(surah.surahNumber)` — e.g. `١`, `٢`, `١٨`, `٣٦`, `٦٧`

---

#### Surah Info Block

```
/* flex-1 text-right */
flex: 1
text-align: right
```

**Surah Name `<h2>`:**

| Property    | Value                                                                |
| ----------- | -------------------------------------------------------------------- |
| Text        | `surah.surahName` — e.g. `الفاتحة`, `البقرة`, `الكهف`, `يس`, `الملك` |
| Font family | Amiri, serif                                                         |
| Font size   | 20px                                                                 |
| Font weight | 700                                                                  |
| Line-height | 1.2                                                                  |
| Color       | `#EDE7DC`                                                            |

**Meta subtitle `<p>`:**

| Property    | Value             |
| ----------- | ----------------- |
| Font family | Cairo, sans-serif |
| Font size   | 11px              |
| Font weight | 400               |
| Color       | `#8A9AB8`         |
| Margin-top  | 2px               |

Text pattern: `[memorized] من [totalVerses] آية · [rangeCount] [نطاق/نطاقات]`

Range word pluralisation:

- `surah.ranges.length === 1` → `نطاق`
- `surah.ranges.length > 1` → `نطاقات`

Full text examples:

- `٧ من ٧ آية · ١ نطاق`
- `٢٠ من ٢٨٦ آية · ١ نطاق`
- `٤١ من ٢٨٦ آية · ٣ نطاقات`
- `٣٠ من ١١٠ آية · ٢ نطاقات`

`memorized` = sum of `(range.to - range.from + 1)` for all ranges in this surah.

---

#### Chevron Icon

```
viewBox: 0 0 24 24
fill: none
/* w-4 h-4 flex-shrink-0 transition-transform duration-300 */
width: 16px
height: 16px
flex-shrink: 0
color: #8A9AB8
transition: transform 300ms
```

| State     | Transform        |
| --------- | ---------------- |
| Collapsed | `rotate(0deg)`   |
| Expanded  | `rotate(180deg)` |

```
path d: M6 9l6 6 6-6
stroke: currentColor
strokeWidth: 1.5
strokeLinecap: round
strokeLinejoin: round
```

---

### Progress Bar

```
/* px-4 pb-3 */
padding: 0 16px 12px
```

Track:

```
/* h-[3px] rounded-full overflow-hidden */
height: 3px
border-radius: 9999px
overflow: hidden
background: rgba(196,154,60,0.1)
```

Fill:

```
/* h-full rounded-full transition-all duration-700 */
height: 100%
border-radius: 9999px
transition: width 700ms
width: ratio * 100%     (ratio = memorized / totalVerses, clamped to 1)
background: [see table]
```

Progress fill colour by completion ratio:

| Condition      | Background                                                             |
| -------------- | ---------------------------------------------------------------------- |
| `ratio < 0.9`  | `linear-gradient(90deg, rgba(196,154,60,0.45), rgba(196,154,60,0.75))` |
| `ratio >= 0.9` | `linear-gradient(90deg, #C49A3C, #D4B86A)`                             |

---

## SurahCard — Expanded Ranges Section

`AnimatePresence initial={false}` — `motion.div key="ranges"` (only rendered when `isOpen=true`):

```
initial:    { height: 0, opacity: 0 }
animate:    { height: "auto", opacity: 1 }
exit:       { height: 0, opacity: 0 }
transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
overflow:   hidden
```

**Ranges outer wrapper:**

```
/* px-3 pb-3 flex flex-col gap-2 */
padding: 0 12px 12px
display: flex
flex-direction: column
gap: 8px
border-top: 1px solid rgba(196,154,60,0.08)
```

**Inner spacer div** (first child, creates top padding inside the border):

```
/* pt-3 */
padding-top: 12px
```

Then each `<RangeCard>` is rendered in order.

---

## RangeCard Component

```
/* rounded-xl overflow-hidden */
border-radius: 12px
overflow: hidden
background: rgba(12,18,32,0.6)
border: 1px solid rgba(196,154,60,0.10)
```

---

### RangeCard Body

```
/* px-3 pt-3 pb-2 flex flex-col gap-2 */
padding: 12px 12px 8px
display: flex
flex-direction: column
gap: 8px
```

---

#### From Row — always rendered

```
/* flex items-baseline gap-2 */
display: flex
align-items: baseline
gap: 8px
```

**Verse number circle:**

```
/* flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] */
flex-shrink: 0
width: 24px
height: 24px
border-radius: 50%
display: flex
align-items: center
justify-content: center
background: rgba(196,154,60,0.12)
color: #C49A3C
font-family: Cairo, sans-serif
font-size: 10px
font-weight: 700
```

Text: `toArabicNum(range.from)` — e.g. `١`, `٢١`, `٥١`

**Label span:**

```
/* flex-shrink-0 text-[10px] */
flex-shrink: 0
font-family: Cairo, sans-serif
font-size: 10px
font-weight: 400
color: #8A9AB8
```

Text:

- `الآية` when `range.from === range.to` (single verse)
- `من` when `range.from !== range.to` (range)

**Verse text `<p>`:**

```
font-family: Amiri Quran, Amiri, serif
font-size: 15px
font-weight: 400
color: #EDE7DC
line-height: 1.6
flex: 1
overflow: hidden
white-space: nowrap
text-overflow: ellipsis
```

Text: `getVerseText(surahNumber, range.from)` — the Arabic text of the opening verse. Example: `بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ`

---

#### To Row — rendered only when `range.from !== range.to`

```
/* flex items-baseline gap-2 */
display: flex
align-items: baseline
gap: 8px
```

**Verse number circle:**

```
/* flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] */
flex-shrink: 0
width: 24px
height: 24px
border-radius: 50%
display: flex
align-items: center
justify-content: center
background: rgba(138,154,184,0.1)
color: #8A9AB8
font-family: Cairo, sans-serif
font-size: 10px
font-weight: 700
```

Text: `toArabicNum(range.to)` — e.g. `٧`, `٢٠`, `٥٠`

**Label span:**

```
flex-shrink: 0
font-family: Cairo, sans-serif
font-size: 10px
font-weight: 400
color: #8A9AB8
```

Text: `إلى`

**Verse text `<p>`:**

```
font-family: Amiri Quran, Amiri, serif
font-size: 15px
font-weight: 400
color: #C4BCAE
line-height: 1.6
flex: 1
overflow: hidden
white-space: nowrap
text-overflow: ellipsis
```

Text: `getVerseText(surahNumber, range.to)` — the Arabic text of the closing verse.

---

### RangeCard Footer

```
/* flex items-center justify-between border-t px-3 py-2 */
display: flex
align-items: center
justify-content: space-between
border-top: 1px solid rgba(196,154,60,0.08)
padding: 8px 12px
```

**Verse count label:**

| Property    | Value                                         |
| ----------- | --------------------------------------------- |
| Text        | `[count] آية` e.g. `٧ آية`, `٢٠ آية`, `١ آية` |
| Font family | Cairo, sans-serif                             |
| Font size   | 11px                                          |
| Font weight | 400                                           |
| Color       | `#8A9AB8`                                     |

`count` = `rangeCount(range)` = `range.to - range.from + 1`

**Delete `<button>`:**

```
/* flex items-center gap-1 px-2.5 py-1 rounded-lg */
display: flex
align-items: center
gap: 4px
padding: 4px 10px
border-radius: 8px
background: rgba(212,24,61,0.08)
border: 1px solid rgba(212,24,61,0.18)
cursor: pointer
```

Trash icon SVG:

```
viewBox: 0 0 24 24
fill: none
/* w-3 h-3 */
width: 12px
height: 12px
color: #d4183d
```

```
path d: M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6
stroke: currentColor
strokeWidth: 1.5
strokeLinecap: round
strokeLinejoin: round
```

Note: the `RangeCard` trash SVG has only one path (no separate inner vertical lines). The inner legs are implied by the main path `M19 6l-1 14H6L5 6`.

Label span:

| Property    | Value             |
| ----------- | ----------------- |
| Text        | `حذف`             |
| Font family | Cairo, sans-serif |
| Font size   | 11px              |
| Font weight | 400               |
| Color       | `#d4183d`         |

---

## Delete Confirmation Modal

Triggered when user taps the "حذف" button inside any RangeCard. Sets `pendingDelete = { surahNumber, rangeId }`.

`AnimatePresence` wraps two sibling `motion.div`s (backdrop + panel).

---

### Backdrop

`motion.div key="del-backdrop"`:

```
initial:    { opacity: 0 }
animate:    { opacity: 1 }
exit:       { opacity: 0 }
transition: { duration: 0.2 }
onClick:    dismisses modal (sets pendingDelete = null)
```

```
position: absolute
inset: 0
z-index: 50
background: rgba(8,14,24,0.78)
backdrop-filter: blur(6px)
```

---

### Modal Panel

`motion.div key="del-modal"`:

```
initial:    { opacity: 0, scale: 0.94 }
animate:    { opacity: 1, scale: 1 }
exit:       { opacity: 0, scale: 0.94 }
transition: { type: "spring", damping: 28, stiffness: 340 }
```

```
position: absolute
top: 50%
left: 50%
transform: translate(-50%, -50%)
z-index: 51
width: 300px
border-radius: 16px
padding: 24px
background: #182640
border: 1px solid rgba(196,154,60,0.2)
box-shadow: 0 24px 60px rgba(0,0,0,0.6)
direction: rtl
```

---

#### Modal — Danger Icon Circle

```
/* w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto */
width: 48px
height: 48px
border-radius: 50%
display: flex
align-items: center
justify-content: center
margin-bottom: 16px
margin-left: auto
margin-right: auto
background: rgba(212,24,61,0.1)
border: 1px solid rgba(212,24,61,0.25)
```

Trash SVG inside:

```
viewBox: 0 0 24 24
fill: none
/* w-6 h-6 */
width: 24px
height: 24px
color: #d4183d
```

SVG elements:

| Element         | Coords / d                           | Stroke       | strokeWidth | Extra                                           |
| --------------- | ------------------------------------ | ------------ | ----------- | ----------------------------------------------- |
| Main path       | `M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6` | currentColor | 1.5         | `strokeLinecap: round`, `strokeLinejoin: round` |
| Left inner leg  | `x1=10 y1=11 x2=10 y2=17`            | currentColor | 1.5         | `strokeLinecap: round`                          |
| Right inner leg | `x1=14 y1=11 x2=14 y2=17`            | currentColor | 1.5         | `strokeLinecap: round`                          |

(The modal trash icon includes the two inner vertical lines; the RangeCard footer trash icon does not — confirmed by source.)

---

#### Modal — Title `<p>`

| Property    | Value        |
| ----------- | ------------ |
| Text        | `حذف النطاق` |
| Font family | Amiri, serif |
| Font size   | 20px         |
| Font weight | 700          |
| Line-height | 1.4          |
| Color       | `#EDE7DC`    |
| Text-align  | center       |

---

#### Modal — Body `<p>`

```
font-family: Cairo, sans-serif
font-size: 13px
color: #8A9AB8
text-align: center
margin-top: 8px
line-height: 1.7
```

Text is composed of three parts:

1. Static prefix span: `سيُحذف نطاق الآيات`
2. Dynamic gold range span (rendered when `pendingRange` is defined):
   ```
   color: #C49A3C
   font-weight: 600
   ```
   Text: `[from] — [to]` (space-padded) — e.g. `١ — ٢٠`, `٢١ — ٥٠`
3. Static suffix: `من سورة [surahName] بشكل نهائي` — e.g. `من سورة الفاتحة بشكل نهائي`, `من سورة البقرة بشكل نهائي`

Full assembled example:  
`سيُحذف نطاق الآيات ١ — ٢٠ من سورة البقرة بشكل نهائي`

---

#### Modal — Action Buttons Row

```
/* flex gap-3 mt-6 */
display: flex
gap: 12px
margin-top: 24px
```

**Cancel button — `تراجع`:**

```
/* flex-1 py-3 rounded-xl */
flex: 1
padding: 12px 0
border-radius: 12px
font-family: Cairo, sans-serif
font-size: 14px
font-weight: 600
background: rgba(138,154,184,0.1)
color: #8A9AB8
border: 1px solid rgba(138,154,184,0.15)
cursor: pointer
```

Text: `تراجع`  
Action: `setPendingDelete(null)` (dismisses modal, no deletion)

**Confirm delete button — `حذف`:**

```
/* flex-1 py-3 rounded-xl */
flex: 1
padding: 12px 0
border-radius: 12px
font-family: Cairo, sans-serif
font-size: 14px
font-weight: 600
background: rgba(212,24,61,0.15)
color: #d4183d
border: 1px solid rgba(212,24,61,0.25)
cursor: pointer
```

Text: `حذف`  
Action: `confirmDelete()` — removes the range from state, removes the surah entry entirely if it has no remaining ranges, then closes modal.

---

## Bottom Navigation Bar

See `HomeScreen-design.md §7`. Active tab on this screen: **المحفوظات** (tab index 1, second from right in RTL order).

Active indicator: gold dot `6×6px`, `border-radius: 50%`, `background: #C49A3C`, centered below the المحفوظات icon.
