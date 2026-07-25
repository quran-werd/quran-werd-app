# Design System Documentation
## Quran Memorization App (Hifz Tracker)

> RTL Arabic mobile app rendered inside a 375×812 px phone frame on a desktop canvas.  
> Direction is `rtl` throughout unless otherwise noted.

---

## 1. Design Tokens

### 1.1 Color Palette

#### Core Background / Surface Colors

| Token name | Hex / RGBA | Semantic role | Used on |
|---|---|---|---|
| `--background` | `#0C1220` | App background (darkest navy) | Page background, phone frame fill |
| `--card` | `#131D30` | Card / sheet surface | BottomNav, bottom sheets, surah cards, settings cards |
| `--secondary` | `#1C2840` | Secondary surface | Input backgrounds, muted containers |
| `--accent` | `#2A3D5C` | Accent surface / switch track off | Switch background (off) |
| `#182640` | — | Elevated card variant | Surah card gradient start, delete modal, plan goal card |
| `#0F1829` | — | Slightly darker navy | Gradient end for ward card |
| `rgba(12,18,32,0.6)` | — | Inset sub-card | Range sub-cards inside surah cards, werd expanded content |
| `rgba(8,14,24,0.6–0.78)` | — | Modal/sheet backdrop overlay | GoToSheet backdrop, RangesSheet backdrop, delete confirm backdrop |
| `#182640` (solid) | — | Delete confirmation modal | Centered modal background |

#### Primary (Gold) Colors

| Token name | Hex / RGBA | Semantic role | Used on |
|---|---|---|---|
| `--primary` | `#C49A3C` | Gold — primary accent | Active nav icons, range badges, ward indicator dot, primary CTA buttons, highlighted text |
| `#D4A843` | — | Gold highlight | Gradient start on primary buttons |
| `#B08830` | — | Gold shadow | Gradient end on primary buttons (3-stop) |
| `#E8C06A` | — | Gold shimmer | Accent bar gradient center |
| `rgba(196,154,60,0.07–0.22)` | — | Gold tint on backgrounds | Radial glow overlays on home/plan/memorizations screens |
| `rgba(196,154,60,0.08–0.18)` | — | Gold wash | Verse highlight background (pending), ward verse highlight, CTA button inactive bg |
| `rgba(196,154,60,0.10–0.35)` | — | Gold border variants | Card borders at various opacity levels |
| `--border` | `rgba(196,154,60,0.18)` | Default border | Theme token, used via `border-border` |
| `--ring` | `rgba(196,154,60,0.4)` | Focus ring | Theme token |

#### Text Colors

| Token name | Hex / RGBA | Semantic role | Used on |
|---|---|---|---|
| `--foreground` | `#EDE7DC` | Primary text (warm off-white) | Headings, body text, verse text in sheets |
| `--muted-foreground` | `#8A9AB8` | Secondary / muted text (cool blue-grey) | Subtitles, metadata labels, inactive nav labels, placeholder text |
| `#C4BCAE` | — | Dimmed foreground | "To" verse text in range cards (slightly dimmer than primary) |
| `#8B6914` | — | Mushaf brown | Page header labels, verse number badges on mushaf page, page footer |
| `rgba(139,105,20,0.6–0.7)` | — | Faded mushaf brown | Page footer number, divider lines on mushaf page |
| `#5C3D0A` | — | Deep mushaf brown | BasmalaSvg fill color |
| `#1A100A` | — | Near-black (mushaf text) | Arabic verse text on cream mushaf background |

#### Semantic / State Colors

| Token | Hex / RGBA | Semantic role | Used on |
|---|---|---|---|
| `--destructive` | `#d4183d` | Destructive / danger | Delete button text and icon, delete modal icon |
| `#E05A5A` | — | Destructive text (settings) | "Sign out" row text in settings |
| Range highlight — green | `rgba(100,160,110,0.15–0.2)` | Selected range background | Highlighted verse rows in quran viewer |
| Range endpoint — green | `rgb(60,130,80)` | Range start/end badge text | Verse number badges at range endpoints |
| Range border — green | `rgba(100,160,110,0.8)` | Range endpoint badge border | Verse number circle border |
| Merge success — green | `#3DA65A` / `#62C87A` | Merge notification accent bar | Merge success toast gradient |
| Green fill bg | `rgba(80,160,100,0.15)` | Merge notification icon bg | Merge notification icon circle |
| `rgba(212,24,61,0.08–0.18)` | — | Delete button bg/border | Danger delete button in range cards and sheets |

#### Mushaf Page Colors

| Hex | Semantic role |
|---|---|
| `#FBF5E8` | Mushaf page cream — gradient top |
| `#F5ECD8` | Mushaf page parchment — gradient bottom |

---

### 1.2 Typography

#### Font Families

| Variable | Family | Weights loaded | Used for |
|---|---|---|---|
| `'Amiri Quran'` | Amiri Quran (Google Fonts) | 400 | Quran verse text (highest fidelity) |
| `'Amiri'` | Amiri (Google Fonts) | 400, 700 | Arabic display headings, surah names, mushaf page headers, sheet titles |
| `'Cairo'` | Cairo (Google Fonts) | 300, 400, 600, 700 | UI labels, metadata, nav labels, buttons, inputs |

**Google Fonts import in `fonts.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700&display=swap');
```

#### Text Styles

| Style name | Font | Size | Weight | Line-height | Letter-spacing | Used on |
|---|---|---|---|---|---|---|
| Home greeting | Amiri | 26px | 700 | 1.4 | — | "السلام عليكم" heading on home |
| Ward card surah name | Amiri | 34px | 700 | 1.2 | — | "سورة البقرة" in home ward card |
| Completion message | Amiri | 22px | 700 | 1.5 | — | "أتممت ورد اليوم" |
| Screen title (Memorizations) | Amiri | 28px | 700 | 1.3 | — | "محفوظاتي" |
| Screen title (small) | Amiri | 22–26px | 700 | — | — | Plan screen, settings screen |
| Sheet/modal heading | Amiri | 20px | 700 | — | — | Bottom sheet titles |
| Surah card name | Amiri | 20px | 700 | 1.2 | — | Surah name in collapsible card |
| Surah list row name | Amiri | 17px | 700 | — | — | GoToSheet surah list |
| App bar heading | Amiri | 18px | 700 | — | — | QuranViewer / ReviewSession app bar |
| Review session surah name | Amiri | 16px | 700 | — | — | Center header in review session |
| Werd surah name | Amiri | 16px | 700 | — | — | Plan list werd header row |
| Mushaf page header surah | Amiri | 15px | 700 | — | — | Surah label in mushaf page header |
| Mushaf page header juz | Amiri | 13px | 700 | — | — | Juz label in mushaf page header |
| Verse text (quran viewer) | 'Amiri Quran','Amiri' | 20px | 400 | 2.0 | 0.01em | Verse rows in quran viewer |
| Verse text (review session) | 'Amiri Quran','Amiri' | 21px | 400 | 2.5 | — | Flowing text in review session mushaf |
| Verse text (range cards) | 'Amiri Quran','Amiri' | 15px | 400 | 1.6 | — | "From / to" verse preview in range cards |
| Verse text (plan expanded) | 'Amiri Quran','Amiri' | 14px | 400 | 1.6 | — | Werd expanded verse preview |
| Body / UI label large | Cairo | 16px | 500–600 | 1.5 | — | Button labels, settings row labels, CTA buttons |
| Body / UI label | Cairo | 15px | 400–600 | — | — | Settings row labels, ward card stat values |
| Subtitle / meta | Cairo | 14px | 400 | — | — | Ward card subtitle, home date, form labels |
| Small label | Cairo | 13px | 400–600 | — | — | Review session page/juz line, sheet subtitle, tooltip text |
| Extra small | Cairo | 12px | 400–700 | — | — | GoToSheet surah verse/page, range verse count, page counter, settings sublabels |
| Tiny | Cairo | 11px | 400–700 | — | — | Nav labels, sheet subtitles, range badge text, section labels, settings version |
| Micro | Cairo | 10px | 700 | — | — | Verse number badges (in quran viewer), week day buttons, "من/إلى" labels |
| Micro tiny | Cairo | 9px | 700 | — | — | Daily pages label in weekly mode |
| Date / status label | Cairo | 0.875rem (14px) | 400 | — | 0.08em | "ورد اليوم" with `letterSpacing: 0.08em` |
| Section labels (settings) | Cairo | 11px | 700 | — | 0.07em | Settings section headers (e.g. "التخصيص", "التنبيهات") |

---

### 1.3 Spacing Scale

Base unit: **4px**

| Value | Used for |
|---|---|
| 2px | Tight icon gaps, badge padding inline, progress bar height |
| 3px | Sheet handle bar height, accent gradient bar height, BottomNav home indicator height |
| 4px | Small gap between items, avatar inset |
| 6px | Small padding, gap between buttons in plan goal card |
| 8px | Standard gap (settings modal text gap, sublabel margin), small padding blocks |
| 10px | Notification padding, plan list gap between werds |
| 12px | Gap between elements in rows, sheet search input padding |
| 14px | Settings row horizontal padding, card padding |
| 16px | Horizontal page padding (settings), card inner padding, button vertical padding on CTAs |
| 18px | BottomNav tab horizontal padding, settings top margin for cards |
| 20px | Horizontal padding in sheets, plan header horizontal padding |
| 22px | Settings section label top padding |
| 24px | Confirmation modal padding, home ward card inner padding |
| 28px | Settings sign-out top margin |
| 32px | Plan empty state icon size reference |
| 48px | Settings bottom scroll padding |

---

### 1.4 Border Radius Values

| Token / value | Used on |
|---|---|
| `9999px` / `rounded-full` | Icon buttons (36×36 / 32×32 / 24×24 circles), nav badge, progress bar, verse number badges (22×22), avatar (46×46), week day buttons, toggle thumb (21×21), ward indicator dot |
| `24px` / `rounded-2xl` | Bottom sheets top corners, mushaf page card, home ward card, primary CTA button, empty state CTA, home review button, BottomNav container |
| `20px` | Notification toasts (`borderRadius: 14px` — see below) |
| `16px` / `rounded-xl` | GoToSheet surah row badges, bottom toolbar secondary action buttons (9×9 rounded-xl), range save button, memorization "add" button, settings confirm/cancel buttons, RangesSheet save button |
| `14px` | Notification toasts, plan werd cards, segmented control outer, settings card (`borderRadius: 14px`) |
| `12px` | Ranges sheet search input (`rounded-xl` = 12px), surah card pill badge |
| `10px` | Plan werd expanded inner card, Settings time-picker pill |
| `9px` | Segmented control outer (settings theme toggle) |
| `8px` | Plan goal card input field, plan update button, week-day toggle button |
| `7px` | Segmented control inner segments, mode toggle button |
| `4px` | BottomNav bottom indicator (rounded-full narrow bar) |
| `44px` | Phone frame outer (mobile mockup container: `rounded-[44px]`) |

---

### 1.5 Shadow / Elevation Styles

| Name | Value | Used on |
|---|---|---|
| Phone frame shadow | `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,154,60,0.12)` | 375×812 mobile frame |
| Mushaf page shadow | `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)` | Cream mushaf page card |
| Home ward card shadow | `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(196,154,60,0.12)` | Main ward card on home |
| Surah card expanded shadow | `0 8px 28px rgba(0,0,0,0.35)` | Expanded surah card |
| Surah card default shadow | `0 4px 14px rgba(0,0,0,0.22)` | Collapsed surah card |
| Primary CTA button shadow | `0 4px 20px rgba(196,154,60,0.30)` | "ابدأ المراجعة" button |
| Save button shadow | `0 4px 16px rgba(196,154,60,0.25)` | RangesSheet save button |
| Delete modal shadow | `0 24px 60px rgba(0,0,0,0.6)` | Delete confirmation modal |
| Notification toast shadow | `0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(196,154,60,0.35)` | Pending range notification |
| Merge notification shadow | `0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(80,160,100,0.3)` | Merge success notification |
| Review session finish button | `0 3px 12px rgba(196,154,60,0.3)` | "إنهاء المراجعة" button |
| Toggle thumb shadow | `0 1px 4px rgba(0,0,0,0.3)` | Settings toggle knob |
| Today's werd card shadow | `0 4px 20px rgba(196,154,60,0.12)` | First werd item in plan list |

---

### 1.6 Breakpoints

This UI has **no responsive breakpoints**. It renders as a fixed `375px × 812px` phone mockup, horizontally centered on any screen. The outer container is `min-h-screen flex items-center justify-center p-4`.

---

## 2. Components

### 2.1 Bottom Navigation Bar (`BottomNav`)

**Container:**
- `background: rgba(19,29,48,0.97)` with `backdropFilter: blur(12px)`
- `border: 1px solid rgba(196,154,60,0.1)`
- `borderRadius: 16px` (Tailwind `rounded-2xl`)
- `margin: 0 16px 16px` (mx-4 mb-4)
- 4 tabs: الرئيسية, المحفوظات, الخطة, الإعدادات

**Tab item:**
- `flex-col items-center gap-1 px-3 py-1`
- Icon: `20×20px` custom SVG
- Label: Cairo, 10px, weight 600 (active) or 400 (inactive)
- Color active: `#C49A3C`; inactive: `#8A9AB8` at opacity 0.45

**Home indicator bar:**
- Width: `112px` (w-28), height: `3px`, `rounded-full`, `background: rgba(255,255,255,0.15)`
- Centered below tabs, `pb-1`

**Nav icons (custom SVGs, 20×20 viewBox 24×24):**
- Stroke width: 1.5px
- Active fill: `rgba(196,154,60,0.15)` for home icon, `rgba(196,154,60,0.08)` for book icon
- Active stroke: `#C49A3C`; inactive stroke: `#8A9AB8`

---

### 2.2 Icon Buttons (circular)

| Size | Dimensions | Background | Used for |
|---|---|---|---|
| Large | `36×36px` rounded-full | `rgba(138,154,184,0.1)` | App bar back/close button |
| Medium | `32×32px` rounded-full | `rgba(138,154,184,0.08)` | Undo/redo buttons |
| Small | `24×24px` rounded-full | `rgba(255,255,255,0.07)` | Dismiss notification button |

Icon color: `#8A9AB8` (muted). Disabled state: `opacity: 0.3`.

---

### 2.3 Primary CTA Button

```
height: auto (py-4)
width: 100% (full width)
borderRadius: 24px (rounded-2xl)
background: linear-gradient(135deg, #D4A843 0%, #C49A3C 50%, #B08830 100%)
color: #0C1220
font: Cairo, 17px, weight 600
boxShadow: 0 4px 20px rgba(196,154,60,0.30)
active transform: scale(0.98)
transition: all 200ms
```

**Disabled / empty state variant:**
```
background: rgba(138,154,184,0.15)
color: #8A9AB8
boxShadow: none
```

---

### 2.4 Secondary / Outlined Button

```
borderRadius: 12px (rounded-xl)
background: rgba(196,154,60,0.12)
border: 1px solid rgba(196,154,60,0.25)
color: #C49A3C
font: Cairo, 13px, weight 600
padding: 8px 16px (py-2 px-4)
gap: 6px (gap-1.5)
```

Used for: "إضافة" button in memorizations header.

---

### 2.5 Ghost Button (toolbar actions)

```
borderRadius: 12px (rounded-xl)
background: rgba(138,154,184,0.1)
border: 1px solid rgba(138,154,184,0.15)
color: #8A9AB8
font: Cairo, 12px, weight 400
padding: 8px 12px (py-2 px-3)
gap: 6px (gap-1.5)
```

Active/with-count variant:
```
background: rgba(196,154,60,0.12)
border: 1px solid rgba(196,154,60,0.3)
color: #C49A3C
```

---

### 2.6 Page Navigation Buttons (prev/next)

```
size: 36×36px (w-9 h-9)
borderRadius: 12px (rounded-xl)
background: rgba(138,154,184,0.1)
icon: 20×20px chevron, color #EDE7DC, stroke 1.5
disabled: opacity 0.3
```

---

### 2.7 VerseRow (quran viewer interactive row)

```
width: 100%
padding: 8px 20px (px-5 py-2)
text-align: right
transition: background-color 150ms
borderRight: 3px solid [state-dependent]
```

| State | Background | Right border |
|---|---|---|
| `normal` | transparent | `3px solid transparent` |
| `pending` | `rgba(196,154,60,0.08)` | `3px solid rgba(196,154,60,0.7)` |
| `inRange` | `rgba(100,160,110,0.15)` | `3px solid transparent` |
| `rangeStart` / `rangeEnd` / `rangeSingle` | `rgba(100,160,110,0.15)` | `3px solid transparent` |

**Verse text:** Amiri Quran, 20px, line-height 2.0, `#1A100A`, letter-spacing 0.01em

**Verse number badge (inline):**
```
size: 22×22px
borderRadius: 50%
verticalAlign: middle
font: Cairo, 10px, weight 700
```
| State | Background | Border | Color |
|---|---|---|---|
| normal | transparent | `1px solid rgba(139,105,20,0.4)` | `#8B6914` |
| pending | transparent | `1.5px solid rgba(196,154,60,0.7)` | `#C49A3C` |
| endpoint | `rgba(100,160,110,0.2)` | `1.5px solid rgba(100,160,110,0.8)` | `rgb(60,130,80)` |

**Pending indicator dot:** `8×8px` circle, `#C49A3C`, top-left, `animation: pulse 1.5s infinite`

---

### 2.8 Mushaf Page Card

```
borderRadius: 16px (rounded-2xl)
background: linear-gradient(180deg, #FBF5E8 0%, #F5ECD8 100%)
boxShadow: 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)
margin: 8px 12px (my-2 mx-3)
overflow: hidden
scrollbarWidth: none
```

**Page header row (inside):**
```
padding: 12px 20px (px-5 py-3)
borderBottom: 1px solid rgba(139,105,20,0.2)بب
flex justify-between
```

**Basmala banner:**
```
margin: 16px 20px (mx-5 my-4)
padding: 12px vertical (py-3)
borderRadius: 12px
background: rgba(139,105,20,0.06)
border: 1px solid rgba(139,105,20,0.15)
flex items-center justify-center
```

**Page number footer:**
```
borderTop: 1px solid rgba(139,105,20,0.12–0.15)
text-center py-3
font: Cairo, 12px, color rgba(139,105,20,0.6–0.7)
```

---

### 2.9 SurahCard (memorizations list)

```
borderRadius: 16px (rounded-2xl)
background: linear-gradient(145deg, #182640 0%, #131D30 100%)
border: 1px solid [open ? rgba(196,154,60,0.28) : rgba(196,154,60,0.14)]
boxShadow: [open ? 0 8px 28px rgba(0,0,0,0.35) : 0 4px 14px rgba(0,0,0,0.22)]
transition: border-color 0.25s, box-shadow 0.25s
overflow: hidden
```

**Top gold hairline:**
```
height: 1px
background: linear-gradient(90deg, transparent, rgba(196,154,60,0.25), transparent)
```

**Header button (toggle):**
```
padding: 16px top, 12px bottom, 16px horizontal (px-4 pt-4 pb-3)
flex items-center gap-3 text-right
```

**Surah number badge:**
```
size: 28×28px (w-7 h-7)
borderRadius: 50%
background: rgba(196,154,60,0.1)
color: #C49A3C
font: Cairo, 11px, weight 700
```

**Progress bar:**
```
height: 3px
borderRadius: 9999px
track: rgba(196,154,60,0.1)
fill gradient (≥90%): linear-gradient(90deg, #C49A3C, #D4B86A)
fill gradient (<90%): linear-gradient(90deg, rgba(196,154,60,0.45), rgba(196,154,60,0.75))
transition: width 700ms
```

**Chevron icon:** 16×16px, `#8A9AB8`, rotates 180° when open (transition 0.3s)

---

### 2.10 RangeCard (inside SurahCard)

```
borderRadius: 12px (rounded-xl)
background: rgba(12,18,32,0.6)
border: 1px solid rgba(196,154,60,0.10)
padding: 12px top, 8px bottom (pt-3 pb-2 px-3)
```

**Verse number circle (from):**
```
size: 24×24px (w-6 h-6)
borderRadius: 50%
background: rgba(196,154,60,0.12)
color: #C49A3C, 10px, weight 700
```

**Verse number circle (to):**
```
size: 24×24px
background: rgba(138,154,184,0.1)
color: #8A9AB8
```

**Footer row (delete):**
```
padding: 8px 12px (px-3 py-2)
borderTop: 1px solid rgba(196,154,60,0.08)
flex justify-between
```

**Delete button:**
```
padding: 4px 10px (px-2.5 py-1)
borderRadius: 8px (rounded-lg)
background: rgba(212,24,61,0.08)
border: 1px solid rgba(212,24,61,0.18)
icon: 12×12px trash, color #d4183d
label: Cairo, 11px, color #d4183d
```

---

### 2.11 Bottom Sheet (GoToSheet / RangesSheet)

```
position: absolute, bottom 0, left 0, right 0
zIndex: 50
direction: rtl
background: #131D30
border: 1px solid rgba(196,154,60,0.15) [no bottom border]
borderRadius: 24px 24px 0 0
maxHeight: 70–75%
flex-col
```

**Drag handle:**
```
width: 40px (w-10), height: 4px (h-1)
borderRadius: 9999px
background: rgba(255,255,255,0.15)
centered, pt-3 pb-2
```

**Backdrop:** `rgba(8,14,24,0.6–0.65)` with `backdropFilter: blur(4px)`

**Sheet title:** Amiri, 20px, weight 700, `#EDE7DC`

**Search input container:**
```
padding: 8px 12px (px-3 py-2)
borderRadius: 12px (rounded-xl)
background: rgba(255,255,255,0.05)
border: 1px solid rgba(196,154,60,0.15)
flex items-center gap-2
```

**Search input:**
```
font: Cairo, 14px, #EDE7DC
background: transparent, no outline
placeholder: "ابحث باسم السورة أو رقمها..."
```

---

### 2.12 Delete Confirmation Modal

```
width: 300px
position: absolute, centered (top 50%, left 50%, translate -50% -50%)
zIndex: 51
borderRadius: 16px
padding: 24px
background: #182640
border: 1px solid rgba(196,154,60,0.2)
boxShadow: 0 24px 60px rgba(0,0,0,0.6)
direction: rtl
```

**Danger icon circle:**
```
size: 48×48px (w-12 h-12)
borderRadius: 50%
background: rgba(212,24,61,0.1)
border: 1px solid rgba(212,24,61,0.25)
icon: 24×24px trash, color #d4183d
```

**Action buttons row:**
```
flex gap-3 mt-6
```

Cancel:
```
flex-1 py-3 rounded-xl
background: rgba(138,154,184,0.1)
border: 1px solid rgba(138,154,184,0.15)
color: #8A9AB8
font: Cairo, 14px, weight 600
```

Confirm delete:
```
flex-1 py-3 rounded-xl
background: rgba(212,24,61,0.15)
border: 1px solid rgba(212,24,61,0.25)
color: #d4183d
font: Cairo, 14px, weight 600
```

---

### 2.13 Notification Toasts (QuranViewer overlay)

**Pending range toast:**
```
borderRadius: 14px
background: linear-gradient(135deg, rgba(30,22,8,0.97) 0%, rgba(20,15,5,0.97) 100%)
backdropFilter: blur(12px)
boxShadow: 0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(196,154,60,0.35)
```

Gold accent bar (top): `height: 3px, background: linear-gradient(90deg, #C49A3C, #E8C06A, #C49A3C)`

Content padding: `10px 14px`

Icon circle: `32×32px, background: rgba(196,154,60,0.15), border: 1px solid rgba(196,154,60,0.35)`

Pulsing dot inside: `8×8px, background: #C49A3C`

**Merge success toast:**
```
borderRadius: 14px
background: linear-gradient(135deg, rgba(8,22,12,0.97) 0%, rgba(5,18,8,0.97) 100%)
backdropFilter: blur(12px)
boxShadow: 0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(80,160,100,0.3)
```

Green accent bar: `height: 3px, background: linear-gradient(90deg, #3DA65A, #62C87A, #3DA65A)`

Icon circle: `32×32px, background: rgba(80,160,100,0.15), border: 1px solid rgba(80,160,100,0.35)`

---

### 2.14 Settings Toggle

```
width: 46px, height: 27px
borderRadius: 14px
padding: 3px
```

Off state:
```
background: rgba(42,61,92,0.9)
border: 1px solid rgba(138,154,184,0.18)
thumb position: flex-start
```

On state:
```
background: linear-gradient(135deg, #C49A3C, #A07A28)
border: 1px solid rgba(196,154,60,0.45)
thumb position: flex-end
```

Thumb: `21×21px, borderRadius: 50%, background: #EDE7DC, boxShadow: 0 1px 4px rgba(0,0,0,0.3)`

Transition: `all 0.22s`

---

### 2.15 Segmented Control (settings theme toggle)

```
outer: background rgba(8,14,24,0.8), borderRadius 9px, padding 3px, gap 2px
       border: 1px solid rgba(196,154,60,0.12)
segment inactive: background transparent, border 1px transparent, color #8A9AB8, weight 400
segment active:   background rgba(196,154,60,0.18), border 1px rgba(196,154,60,0.32), color #C49A3C, weight 600
padding per segment: 5px 11px, borderRadius 7px
font: Cairo, 12px
```

---

### 2.16 Settings Row

```
padding: 14px 16px
flex justify-between items-center
direction: rtl
gap: 12px
```

Label: Cairo, 15px, weight 500, `#EDE7DC`
Sublabel: Cairo, 12px, `rgba(138,154,184,0.6)`
Destructive label: `#E05A5A`

**SettingsCard container:**
```
background: rgba(19,29,48,0.85)
borderRadius: 14px
border: 1px solid rgba(196,154,60,0.1)
overflow: hidden
```

**Row divider:** `height: 1px, background: rgba(196,154,60,0.08), margin: 0 16px`

**Section label:**
```
font: Cairo, 11px, weight 700, color rgba(138,154,184,0.55)
letterSpacing: 0.07em
padding: 22px top, 8px bottom, 4px horizontal
```

---

### 2.17 Plan Goal Card

```
borderRadius: 16px (rounded-2xl)
background: #131D30
border: 1px solid rgba(196,154,60,0.18)
margin: 12px 16px (mx-4 mt-3)
```

Top gradient bar: `height: 2px, linear-gradient(90deg, transparent, #C49A3C 40%, transparent)`

Inner padding: `7px 10px` all sides

Input field:
```
width: 36px
font: Cairo, 14px, weight 700, #EDE7DC
background: transparent, no border, no outline
text-align: center
```

Input container:
```
padding: 12px 10px
borderRadius: 8px
background: rgba(8,14,24,0.7)
border: 1px solid rgba(196,154,60,0.2–0.35) [depends on mode]
```

Update button:
```
padding: 13px 12px
borderRadius: 8px
font: Cairo, 11px, weight 700
Saved state: background rgba(61,166,90,0.12), border 1px rgba(61,166,90,0.35), color #3DA65A
Normal state: background linear-gradient(135deg, #D4A843, #C49A3C), boxShadow 0 2px 8px rgba(196,154,60,0.25), color #0C1220
```

---

### 2.18 Werd Card (plan list item)

```
borderRadius: 14px
overflow: hidden
border: [isOpen or isToday ? rgba(196,154,60,0.28–0.45) : rgba(196,154,60,0.1)]
background: [isToday ? rgba(30,26,20,0.6) : #131D30]
boxShadow: [isToday ? 0 4px 20px rgba(196,154,60,0.12) : none]
```

Today's bar: `height: 2px, linear-gradient(90deg, transparent, #C49A3C 30%, #E8C06A 60%, transparent)`

Werd number badge: `36×36px, borderRadius: 50%`

- Today: `background rgba(212,200,185,0.1), border 1px rgba(212,200,185,0.22), color rgba(212,200,185,0.75)`
- Other: `background rgba(138,154,184,0.08), border 1px rgba(138,154,184,0.12), color #8A9AB8`

Today badge label: `font Cairo, 10px, weight 600, color rgba(212,200,185,0.75), background rgba(212,200,185,0.07), border 1px rgba(212,200,185,0.2), padding 1px 7px, borderRadius 20px`

---

### 2.19 User Avatar (Settings)

```
size: 46×46px
borderRadius: 50%
background: linear-gradient(135deg, rgba(196,154,60,0.25), rgba(196,154,60,0.08))
border: 1.5px solid rgba(196,154,60,0.3)
content: Arabic initial (أ)
font: Cairo, 18px, weight 700, color #C49A3C
```

---

### 2.20 Home Ward Card (stat metadata row)

3 columns separated by `1px × 24px` dividers:

- Divider: `background: rgba(196,154,60,0.15)`
- Label: Cairo, 11px, `text-muted-foreground`
- Value: Cairo, 15px, weight 600, `text-foreground`

---

## 3. Layout Structure

### 3.1 Overall Page Layout

All screens render inside a centered phone frame:

```
Outer: min-h-screen, flex, items-center, justify-center, p-4, bg-background
Frame: width 375px, height 812px, borderRadius 44px, direction rtl
       flex-col, overflow hidden
       boxShadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,154,60,0.12)
```

The frame contains:
1. A screen content area (`flex-1 flex flex-col overflow-hidden min-h-0`)
2. `BottomNav` (fixed to bottom, flex-shrink-0) — present on Home / Memorizations / Plan / Settings

Full-screen modal-style screens (QuranViewer, ReviewSession) replace the entire frame content and **do not include BottomNav**.

---

### 3.2 Screen List

#### Login Screen
- **Layout:** `flex-col flex-1 items-center`, `direction: rtl`, **no BottomNav**
- Full outer shell: `min-h-screen bg-background flex items-center justify-center p-4`, `font-family: 'Cairo', sans-serif`
- Phone frame: standard `375×812px`, `rounded-[44px]`, same shadow token as all screens
- Two ambient radial glow overlays (absolute, pointer-events-none):
  - Top: `radial-gradient(ellipse 70% 45% at 50% 0%, rgba(196,154,60,0.09) 0%, transparent 70%)`
  - Bottom: `radial-gradient(ellipse 60% 30% at 50% 100%, rgba(196,154,60,0.05) 0%, transparent 60%)`

**Upper section** — logo block, top `marginTop: 120px`, centered column:

| Element | Spec |
|---|---|
| Ornament container | `96×96px`, relative; outer glow ring (`inset: -10px, radial-gradient rgba(196,154,60,0.12)`); ring border (`1px solid rgba(196,154,60,0.22), borderRadius 50%`); inner disc (`inset: 10px, linear-gradient(145deg, rgba(196,154,60,0.18) → rgba(196,154,60,0.06)), border 1px solid rgba(196,154,60,0.3), borderRadius 50%`); `GeometricOrnament` SVG fills full container |
| Ornament entrance | `motion.div` — `opacity 0→1, scale 0.85→1, duration 0.7s, ease [0.16,1,0.3,1]` |
| App name "حافظ" | Amiri, 42px, weight 700, `#EDE7DC`, line-height 1, letter-spacing 0.01em, centered; `mb: 6px` |
| App name entrance | `motion.h1` — `opacity 0→1, y 12→0, delay 0.15s, duration 0.55s` |
| Gold underline accent | `width 40px, height 2px, borderRadius 9999px`; `linear-gradient(90deg, transparent, #C49A3C, transparent)`; `mb: 24px` |
| Underline entrance | `motion.div` — `scaleX 0→1, opacity 0→1, delay 0.3s, duration 0.5s` |
| Basmala (`BasmalaSvg`) | `160×33px` SVG (viewBox 176×36), fill `#C49A3C`, `opacity: 0.55`; `mb: 20px` |
| Basmala entrance | `motion.div` — `opacity 0→1, delay 0.25s, duration 0.6s` |
| Subtitle text | Cairo, 15px, weight 400, `#8A9AB8`, centered, line-height 1.7, maxWidth 260px; "رافقك في رحلة حفظ القرآن ومراجعته يوماً بيوم" |
| Subtitle entrance | `motion.p` — `opacity 0→1, y 8→0, delay 0.35s, duration 0.5s` |

**Lower section** — CTA block, `position: absolute, bottom 0, left/right 0`, `padding: 0 28px 64px`, column centered, `gap: 16px`:

| Element | Spec |
|---|---|
| Divider row | `flex items-center gap-3 w-full`; left line: `flex-1, height 1px, linear-gradient(to right, transparent, rgba(196,154,60,0.18))`; center label: Cairo 11px, `rgba(138,154,184,0.75)`, "ابدأ رحلتك", letter-spacing 0.06em; right line mirrors left |
| Divider entrance | `motion.div` — `opacity 0→1, delay 0.5s, duration 0.5s` |
| Google Sign-In button | `width: 100%, flex ltr items-center justify-center, gap 12px, padding 15px 24px, borderRadius 16px, background #FFFFFF, boxShadow: 0 2px 12px rgba(0,0,0,0.35) + 0 0 0 1px rgba(255,255,255,0.06)` |
| — Google logo | Official 4-colour Google SVG `G` mark, `20×20px` |
| — Button label | Cairo, 15px, weight 600, `#1A1A1A`; "تسجيل الدخول بحساب Google" |
| — Hover state | `background #F5F5F5`, `boxShadow: 0 4px 20px rgba(0,0,0,0.4) + 0 0 0 1px rgba(255,255,255,0.08)` |
| — Tap state | `motion.button whileTap scale 0.97` |
| Button entrance | `motion.button` — `opacity 0→1, y 16→0, delay 0.6s, duration 0.55s, ease [0.16,1,0.3,1]` |
| Legal note | Cairo, 11px, `rgba(138,154,184,0.75)`, centered, line-height 1.6; "بالمتابعة فإنك توافق على شروط الاستخدام وسياسة الخصوصية" |
| Legal entrance | `motion.p` — `opacity 0→1, delay 0.75s, duration 0.4s` |

---

#### Home Screen
- **Layout:** `flex-col`, no bottom nav override (nav present)
- Sections (top→bottom):
  1. Status bar mock (time "9:41" + battery icon) — `px-6 pt-4 pb-2`
  2. Date + greeting block — `px-7 pt-6 pb-2`
  3. Horizontal divider (`h-px bg-border mx-7`)
  4. "ورد اليوم" label — `px-7 mb-3`
  5. Ward Card (flex-shrink-0) — `px-6`
  6. CTA / completion state — `mt-6 flex-1`
- Radial gold glow overlay: `absolute inset-0`, `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(196,154,60,0.07) 0%, transparent 70%)`

#### Memorizations Screen
- **Layout:** `flex-col h-full overflow-hidden`
- Sections:
  1. Header with title + "إضافة" button — `px-6 pt-10 pb-4 flex-shrink-0`
  2. Divider `mt-4 h-px bg-border`
  3. Scrollable list of SurahCards — `flex-1 overflow-y-auto px-6 pb-2`
  4. Empty state (centered vertically in flex-1)
  5. Delete confirmation modal (absolute positioned, `z-51`)
- Background radial glow: `70% 30% ellipse at top`, `rgba(196,154,60,0.05)`

#### Add Memorization Screen (QuranViewer)
- **Full-screen** (no BottomNav)
- **Layout:** `flex-col h-full overflow-hidden`
- Sections:
  1. App bar — `px-4 pt-10 pb-3 flex-shrink-0`
  2. Notifications overlay layer — `absolute top-10 left/right 12px z-40`
  3. Mushaf page card — `flex-1 overflow-y-auto mx-3 my-2 rounded-2xl` (AnimatePresence slide transition)
  4. Bottom toolbar — `flex-shrink-0 px-4 py-3 gap-2 flex items-center justify-between`
  5. GoToSheet (absolute, bottom sheet)
  6. RangesSheet (absolute, bottom sheet)

#### Review Session Screen
- **Full-screen** (no BottomNav)
- **Layout:** `flex-col h-full overflow-hidden`
- Sections:
  1. App bar — `flex-shrink-0 px-4 pt-10 pb-3`
  2. Mushaf page (flowing text mode) — `flex-1 overflow-y-auto mx-3 my-2 rounded-2xl`
  3. Bottom toolbar — `flex-shrink-0 px-4 py-3 gap-2`
- Touch swipe gesture: 50px delta threshold on x axis

#### Plan Screen
- **Layout:** `flex-col h-full`
- Sections:
  1. Header — `flex-shrink-0 px-5 pt-10 pb-3`
  2. Goal Card — `flex-shrink-0 mx-4 mt-3 rounded-2xl`
  3. Wird list with section label — `flex-1 overflow-y-auto px-4 pt-2 pb-4`
  4. Summary footer (dashed card)
  5. Empty state (centered flex-1)

#### Settings Screen
- **Layout:** `flex-col h-full direction-rtl`
- Sections:
  1. Header — `pt-52px pb-10px px-20px`
  2. Scrollable body — `flex-1 overflow-y-auto px-16px pb-48px`
     - User card (SettingsCard + avatar row)
     - Section: التخصيص (theme segmented control)
     - Section: التنبيهات (notification toggle + time picker)
     - Section: التطبيق (rate, contact, version)
     - Sign out (separated by `mt-28px`)

---

### 3.3 Grid System

There is no explicit grid system. Layout is entirely Flexbox:
- Vertical: `flex-col` with `flex-1` for main content, `flex-shrink-0` for fixed headers/toolbars/navbars
- Horizontal: `flex items-center justify-between` for toolbar rows
- List spacing: Tailwind `space-y-3` (12px) for surah card list, inline `gap: 6px` for werd list

Horizontal margins follow these values:
- Screen edge padding: `px-4` (16px) for toolbars and tight screens, `px-5/6/7` (20/24/28px) for content areas

---

## 4. Assets

### 4.1 Custom SVG Assets

| Asset | Export name | Description | Dimensions | Key colors |
|---|---|---|---|---|
| Bismillah calligraphy | `BasmalaSvg` | Inline SVG path-based Arabic calligraphy of Bismillah | 200×41 viewBox 176×36 | `currentColor` (passed as prop, defaults `#5C3D0A`) |
| Geometric star ornament | `GeometricStar` | Layered nested squares + radial lines forming Islamic geometric pattern | `viewBox="0 0 200 200"`, fills parent | stroke `#C49A3C`, opacity 0.07, strokeWidth 0.8 |

### 4.2 Nav Icons (inline SVGs, no external file)

All nav icons use `viewBox="0 0 24 24"`, rendered at `20×20px` (Tailwind `w-5 h-5`), stroke-only, strokeWidth 1.5:

| Icon | Screen | Description |
|---|---|---|
| Home | `home` | House silhouette with door cutout |
| Book | `memorizations` | Open book with two horizontal lines |
| Calendar | `plan` | Calendar grid with date lines |
| Settings | `settings` | Circle with sun/gear radial spokes |

### 4.3 Functional Inline SVGs

These are drawn inline throughout the code (no external files):

| Name | Size | Description |
|---|---|---|
| Search / magnifier | 16×16 or 24×24 | Circle + diagonal line |
| Chevron left | 16×16 | `<` chevron |
| Chevron right | 16×16 | `>` chevron |
| Chevron down | 24×24 | `∨` chevron (accordion toggle) |
| Close (X) | 24×24 | Crossed diagonal lines, stroke 1.5–2.5 |
| Checkmark | 24×24 | `✓` path: `M5 13l4 4L19 7`, stroke 2–2.5 |
| Trash | 24×24 | Bin with lid and two vertical lines |
| Undo | 16×16 | Curved arrow going left |
| Redo | 16×16 | Curved arrow going right |
| Plus (+) | 24×24 | `M12 5v14M5 12h14`, stroke 2 |
| Book (ranges badge) | 24×24 | Open book silhouette |
| Clipboard-check | 24×24 | Checkbox + document outline |
| External link | 16×16 | Arrow-out-of-box |
| Clock | 16×16 | Circle + clock hands |
| Sign out | 16×16 | Door with arrow |
| Plan filter / sliders | 16×16 | 3 horizontal lines with circles |
| Empty book (memorizations empty) | 48×48 | Open book with center spine + accent lines |
| Empty plan scroll | 48×48 | Scroll/receipt with horizontal lines |
| Battery | custom | 16×10px border with inner fill + cap nub |

### 4.4 Animations

| Name | Trigger | Implementation |
|---|---|---|
| Screen transition | Screen change (home/mem/plan/settings) | `motion.div opacity 0→1, duration 0.18s` |
| Bottom sheet slide | Sheet open/close | `motion.div y: 100%→0, spring damping 32 stiffness 320` |
| Accordion expand | SurahCard / WerdCard toggle | `motion.div height 0→auto, opacity 0→1, duration 0.28–0.3s, ease [0.4,0,0.2,1]` |
| Notification toast | PendingStart state change / merge | `motion.div y: -16→0, scale 0.95→1, spring damping 26 stiffness 320` |
| Completion badge | reviewCompleted toggle | `motion.div scale 0→1, spring stiffness 200 damping 15 delay 0.1` |
| Mushaf page slide (QuranViewer) | Page change | `motion.div opacity 0→1, x ±20→0, duration 0.2s` |
| Mushaf page slide (ReviewSession) | Page change | Custom variants: enter x:-28 opacity:0 → center x:0 opacity:1, duration 0.22s ease [0.4,0,0.2,1] |
| Finish button appear | `hasReachedWard` true | `motion.button opacity 0 scale 0.85 → 1, spring stiffness 260 damping 20` |
| Ward status badge | completed toggle | `AnimatePresence mode="wait", opacity+scale 0.85→1, duration 0.25s` |
| Pulse animation | Pending verse dot, notification gold dot | CSS `@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} } 1.2–1.5s infinite` |
| Notification time (merge) | Auto-dismiss after 2800ms | `setTimeout(() => setMergeMsg(false), 2800)` |

---

## 5. Additional Technical Notes

### 5.1 Direction
- **Global:** `direction: rtl` on phone frame and all screen roots
- **Exception:** Time input value display uses `direction: ltr` to preserve `HH:MM` format

### 5.2 Scrollbar
All scrollable containers use `scrollbarWidth: none` (Firefox) to hide scrollbars.

### 5.3 Backdrop Blur
Used consistently on:
- BottomNav: `backdropFilter: blur(12px)`
- Sheet backdrops: `backdropFilter: blur(4px)`
- Notification toasts: `backdropFilter: blur(12px)`
- Delete modal backdrop: `backdropFilter: blur(6px)`

### 5.4 Font Rendering
Fonts are imported via Google Fonts as `display=swap`. Fallback chains:
- Quran text: `'Amiri Quran', 'Amiri', serif`
- Arabic headings: `'Amiri', serif`
- UI text: `'Cairo', sans-serif`

### 5.5 Interaction States
- Buttons with `onClick`: `active:scale-[0.97–0.98]` via Tailwind or inline `transition-transform`
- Icon buttons: `transition-opacity`
- Nav items: `transition-opacity`
- Hover (desktop only): `hover:opacity-70` or `hover:opacity-80` on some action buttons
- Disabled: `opacity: 0.3` (page nav buttons, undo/redo)
