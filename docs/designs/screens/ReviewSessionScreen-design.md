# Review Session Screen — Complete Design Specification

> Full-screen (no BottomNav). `direction: rtl`. Background `#0C1220`. Touch swipe supported (50px threshold). Page range: 1–604. Initial page shown: 595.

---

## Root Container

`flex flex-col h-full overflow-hidden`, `background: #0C1220`

Touch events: `onTouchStart` captures `clientX`; `onTouchEnd` computes delta — delta > 50 → next page, delta < -50 → previous page.

Keyboard: `ArrowLeft` → next page, `ArrowRight` → previous page.

---

## 1. App Bar

`flex-shrink-0 flex items-center justify-between px-16px pt-40px pb-12px`  
`border-bottom: 1px solid rgba(196,154,60,0.1)`

### 1a. Close Button (right side, RTL leading)

`36×36px (w-9 h-9)`, `border-radius: 50% (rounded-full)`, `flex items-center justify-center`

| Property | Value |
|---|---|
| Background | `rgba(138,154,184,0.1)` |
| Icon | X SVG `20×20px (w-5 h-5)`, path `M18 6L6 18M6 6l12 12`, `stroke: #8A9AB8`, `strokeWidth: 1.5`, `strokeLinecap: round` |

### 1b. Center Header Block

`text-center`

**Page / Juz line:**
| Property | Value |
|---|---|
| Text | e.g. `صفحة ٥٩٥ · الجزء ٣٠` (dynamic) |
| Font | Cairo, 11px, weight 400 |
| Color | `#8A9AB8` |

**Surah name line:**
| Property | Value |
|---|---|
| Text | e.g. `سورة الأعلى` (dynamic — current page's main surah) |
| Font | Amiri, 16px, weight 700 |
| Color | `#EDE7DC` |

### 1c. Ward Indicator Pill (left side, RTL trailing)

`flex items-center gap-4px px-10px py-4px rounded-xl (12px)`

| Property | Value |
|---|---|
| Background | `rgba(196,154,60,0.1)` |
| Border | `1px solid rgba(196,154,60,0.2)` |
| Dot | `6×6px (w-1.5 h-1.5)`, `border-radius: 50%`, `background: #C49A3C` |
| Label text | `الورد` |
| Label font | Cairo, 10px, weight 600 |
| Label color | `#C49A3C` |

---

## 2. Mushaf Page Card

`AnimatePresence mode="wait" custom={dir}` — `motion.div key={currentPageNum}`:

Custom variants:
- **Enter:** `x: dir × -28, opacity: 0`
- **Center:** `x: 0, opacity: 1`
- **Exit:** `x: dir × 28, opacity: 0`

`transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] }`

`flex-1 overflow-y-auto mx-12px my-8px rounded-2xl (16px)`, `scrollbar-width: none`

| Property | Value |
|---|---|
| Background | `linear-gradient(180deg, #FBF5E8 0%, #F5ECD8 100%)` |
| `box-shadow` | `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)` |

### 2a. Page Header Row
`flex items-center justify-between px-20px py-12px`  
`border-bottom: 1px solid rgba(139,105,20,0.2)`

| Element | Text example | Font | Size | Weight | Color |
|---|---|---|---|---|---|
| Juz label (left) | `الجزء ٣٠` | Amiri | 13px | 700 | `#8B6914` |
| Surah name (right) | `سورة الأعلى` | Amiri | 15px | 700 | `#8B6914` |

### 2b. Basmala Banner
Shown only when `page.verses[0].verseNum === 1`.

`mx-20px my-16px py-12px rounded-xl text-center flex items-center justify-center`

| Property | Value |
|---|---|
| Background | `rgba(139,105,20,0.06)` |
| Border | `1px solid rgba(139,105,20,0.15)` |
| Content | `<BasmalaSvg color="#5C3D0A" />` — 200×41px Bismillah calligraphy SVG |

### 2c. Flowing Verse Text Block

`px-20px pb-16px`

| Property | Value |
|---|---|
| Font | Amiri Quran / Amiri, 21px, weight 400 |
| `line-height` | 2.5 |
| `text-align` | justify |
| `direction` | rtl |
| Color | `#1A100A` |

Each verse is an inline `<span>` pair:

**Verse text span:**
- Normal verse: `background: transparent`, no border-radius, no padding
- Ward verse (highlighted): `background: rgba(196,154,60,0.18)`, `border-radius: 3px`, `padding-inline: 2px`

**Verse number span** (after each verse text):

| Property | Value |
|---|---|
| Text | `﴿[Arabic numeral]﴾` e.g. `﴿١﴾` |
| Font | Cairo, 13px, weight 400 |
| Color | `#8B6914` |
| `vertical-align` | middle |
| `line-height` | 1 |

### 2d. Page Number Footer

`text-center pb-12px`  
`border-top: 1px solid rgba(139,105,20,0.12)`

| Property | Value |
|---|---|
| Text | `─── [Arabic page number] ───` e.g. `─── ٥٩٥ ───` |
| Font | Cairo, 12px, weight 400 |
| Color | `rgba(139,105,20,0.6)` |

---

## 3. Bottom Toolbar

`flex-shrink-0 flex items-center justify-between px-16px py-12px gap-8px`  
`border-top: 1px solid rgba(196,154,60,0.1)`

### 3a. Previous Page Button (right side, RTL leading)

`36×36px (w-9 h-9)`, `border-radius: 12px (rounded-xl)`, `flex items-center justify-center`

| State | Background | Opacity |
|---|---|---|
| Active | `rgba(138,154,184,0.1)` | 1 |
| Disabled (page 1) | `rgba(138,154,184,0.1)` | 0.3 |

Icon: Chevron-right SVG `20×20px`, path `M9 18l6-6-6-6`, `stroke: #EDE7DC`, `strokeWidth: 1.5`

### 3b. Center Group

`flex-1 flex items-center justify-center gap-12px`

#### Page Counter
| Property | Value |
|---|---|
| Text | e.g. `٥٩٥ / ٦٠٤` (currentPage / 604) |
| Font | Cairo, 12px, weight 400 |
| Color | `#8A9AB8` |

#### "إنهاء المراجعة" Button
Shown via `AnimatePresence` only when `currentPageNum >= 3` (hasReachedWard).

`motion.button` — entrance/exit: `opacity 0→1, scale 0.85→1`, spring `stiffness 260, damping 20`

`flex items-center gap-6px px-16px py-8px rounded-xl (12px)`  
`active:scale-[0.97] transition-transform`

| Property | Value |
|---|---|
| Background | `linear-gradient(135deg, #D4A843, #C49A3C)` |
| Color | `#0C1220` |
| Font | Cairo, 13px, weight 600 |
| `box-shadow` | `0 3px 12px rgba(196,154,60,0.3)` |
| Icon | Checkmark SVG `16×16px (w-4 h-4)`, path `M5 13l4 4L19 7`, `stroke: currentColor`, `strokeWidth: 2`, `strokeLinecap: round` |
| Label text | `إنهاء المراجعة` |

**Hidden state** (before reaching ward page): button not rendered.

### 3c. Next Page Button (left side, RTL trailing)

Same size and style as Previous button.

| State | Background | Opacity |
|---|---|---|
| Active | `rgba(138,154,184,0.1)` | 1 |
| Disabled (page 604) | `rgba(138,154,184,0.1)` | 0.3 |

Icon: Chevron-left SVG `20×20px`, path `M15 18l-6-6 6-6`, `stroke: #EDE7DC`, `strokeWidth: 1.5`

---

## Ward Verse Highlight Logic

Verses belonging to the current ward (surah 2, verses 1–20) are rendered with:
- `background: rgba(196,154,60,0.18)`
- `border-radius: 3px`
- `padding-inline: 2px`

All other verses have `background: transparent`.
