# Add Memorization Screen (Quran Viewer) — Complete Design Specification

> Full-screen (no BottomNav). `direction: rtl`. Background `#0C1220`. Contains: App Bar, Notifications Overlay, Mushaf Page Card, Bottom Toolbar. Two bottom sheets (GoToSheet, RangesSheet) slide up over the screen.

---

## Root Container

`flex flex-col h-full overflow-hidden`, `background: #0C1220`, `position: relative`

---

## 1. App Bar

`flex items-center justify-between px-16px pt-40px pb-12px flex-shrink-0`  
`border-bottom: 1px solid rgba(196,154,60,0.1)`

### 1a. Close Button (right side, RTL leading)

`36×36px (w-9 h-9)`, `border-radius: 50% (rounded-full)`, `flex items-center justify-center`

| Property | Value |
|---|---|
| Background | `rgba(138,154,184,0.1)` |
| Icon | X SVG `20×20px (w-5 h-5)`, path `M18 6L6 18M6 6l12 12`, `stroke: #8A9AB8`, `strokeWidth: 1.5`, `strokeLinecap: round` |

### 1b. Screen Title (center)

| Property | Value |
|---|---|
| Text | `إضافة محفوظات` |
| Font | Amiri, 18px, weight 700 |
| Color | `#EDE7DC` |

### 1c. Right-side controls (left side, RTL trailing)

`flex items-center gap-8px`

#### Undo Button
`32×32px (w-8 h-8)`, `border-radius: 50% (rounded-full)`, `flex items-center justify-center`, `transition-opacity`

| State | Background | Opacity |
|---|---|---|
| Active | `rgba(138,154,184,0.08)` | 1 |
| Disabled (no history) | `rgba(138,154,184,0.08)` | 0.3 |

Icon: Undo arrow SVG `16×16px (w-4 h-4)`, `stroke: #8A9AB8`, `strokeWidth: 1.4`

#### Redo Button
Same dimensions and states as Undo.

Icon: Redo arrow SVG `16×16px (w-4 h-4)`, `stroke: #8A9AB8`, `strokeWidth: 1.4`

#### Ranges Badge Button
`flex items-center gap-6px px-12px py-6px rounded-xl (12px)`

| State | Background | Border | Icon color | Text |
|---|---|---|---|---|
| Empty (0 ranges) | `rgba(138,154,184,0.08)` | `1px solid rgba(138,154,184,0.15)` | `#8A9AB8` | *(no count label)* |
| Has ranges | `rgba(196,154,60,0.12)` | `1px solid rgba(196,154,60,0.3)` | `#C49A3C` | Arabic count, e.g. `١` |

Icon: Open book SVG `16×16px (w-4 h-4)`, paths for book silhouette, `stroke: currentColor`, `strokeWidth: 1.5`

Count label (when > 0): Cairo, 11px, weight 700, color `#C49A3C`

---

## 2. Notifications Overlay Layer

`position: absolute`, `top: 10px right: 12px left: 12px`, `z-index: 40`  
`flex flex-col gap-8px`, `pointer-events: none`

Both toasts share entrance/exit animation:  
`motion.div` — `opacity 0→1, y -16→0, scale 0.95→1`, spring `damping 26 stiffness 320`  
Exit: `opacity 0, y -12, scale 0.95`

---

### Toast A — Pending Range Notification
Shown when a verse has been tapped as the range start (pendingStart state).

`pointer-events: auto`, `border-radius: 14px`, `overflow: hidden`

| Property | Value |
|---|---|
| Background | `linear-gradient(135deg, rgba(30,22,8,0.97) 0%, rgba(20,15,5,0.97) 100%)` |
| `backdrop-filter` | `blur(12px)` |
| `box-shadow` | `0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(196,154,60,0.35)` |

**Gold accent bar** (top): `height: 3px`, `background: linear-gradient(90deg, #C49A3C, #E8C06A, #C49A3C)`

**Content row:** `padding: 10px 14px`, `flex items-center gap-10px`

| Element | Spec |
|---|---|
| Icon circle | `32×32px`, `border-radius: 50%`, `background: rgba(196,154,60,0.15)`, `border: 1px solid rgba(196,154,60,0.35)` |
| Pulsing dot inside | `8×8px`, `border-radius: 50%`, `background: #C49A3C`, `animation: pulse 1.2s infinite` |
| Subtitle text | `تحديد نطاق — [اسم السورة]` e.g. `تحديد نطاق — الفاتحة` |
| Subtitle font | Cairo, 11px, weight 400, color `rgba(196,154,60,0.7)`, `margin-bottom: 1px` |
| Body text | `من الآية [رقم] · انقر على آية أخرى لإتمام النطاق` e.g. `من الآية ١ · انقر على آية أخرى لإتمام النطاق` |
| Body font | Amiri Quran / Amiri, 13px, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`, color `#EDE7DC` |

**Dismiss (X) button** (inside toast, `pointer-events: auto`):  
`24×24px`, `border-radius: 50%`, `flex items-center justify-center`, `background: rgba(255,255,255,0.07)`, `border: none`, `color: #8A9AB8`  
Icon: X SVG `12×12px`, path `M18 6L6 18M6 6l12 12`, `strokeWidth: 2.5`, `strokeLinecap: round`

---

### Toast B — Merge Success Notification
Shown for 2800ms after two overlapping ranges are auto-merged.

`pointer-events: auto`, `border-radius: 14px`, `overflow: hidden`

| Property | Value |
|---|---|
| Background | `linear-gradient(135deg, rgba(8,22,12,0.97) 0%, rgba(5,18,8,0.97) 100%)` |
| `backdrop-filter` | `blur(12px)` |
| `box-shadow` | `0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(80,160,100,0.3)` |

**Green accent bar** (top): `height: 3px`, `background: linear-gradient(90deg, #3DA65A, #62C87A, #3DA65A)`

**Content row:** `padding: 10px 14px`, `flex items-center gap-10px`

| Element | Spec |
|---|---|
| Icon circle | `32×32px`, `border-radius: 50%`, `background: rgba(80,160,100,0.15)`, `border: 1px solid rgba(80,160,100,0.35)` |
| Checkmark icon | `15×15px`, `color: #62C87A`, path `M5 13l4 4L19 7`, `strokeWidth: 2.5`, `strokeLinecap: round` |
| Subtitle text | `تم الدمج` |
| Subtitle font | Cairo, 11px, weight 400, color `rgba(80,160,100,0.8)`, `margin-bottom: 1px` |
| Body text | `تم دمج النطاق مع محفوظاتك السابقة` |
| Body font | Cairo, 13px, weight 400, color `#EDE7DC` |

---

## 3. Mushaf Page Card

`AnimatePresence mode="wait"` — `motion.div key={pageIdx}`:  
Entrance: `opacity 0, x -20 → opacity 1, x 0`, `duration: 0.2s`  
Exit: `opacity 1, x 0 → opacity 0, x 20`, `duration: 0.2s`

`flex-1 overflow-y-auto mx-12px my-8px rounded-2xl`, `scrollbar-width: none`

| Property | Value |
|---|---|
| Background | `linear-gradient(180deg, #FBF5E8 0%, #F5ECD8 100%)` |
| `box-shadow` | `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)` |

### 3a. Page Header Row
`flex items-center justify-between px-20px py-12px`  
`border-bottom: 1px solid rgba(139,105,20,0.2)`

| Element | Text example | Font | Size | Weight | Color |
|---|---|---|---|---|---|
| Juz label (left) | `الجزء ١` | Amiri | 13px | 700 | `#8B6914` |
| Surah name (right) | `سورة الفاتحة` | Amiri | 15px | 700 | `#8B6914` |

### 3b. Basmala Banner
Shown only when `page.verses[0].verseNum === 1` (surah starts on this page).

`mx-20px my-16px py-12px rounded-xl (12px) text-center flex items-center justify-center`

| Property | Value |
|---|---|
| Background | `rgba(139,105,20,0.06)` |
| Border | `1px solid rgba(139,105,20,0.15)` |
| Content | `<BasmalaSvg color="#5C3D0A" />` — 200×41px inline SVG Bismillah calligraphy |

### 3c. Verse Rows
`py-8px` wrapper around all verse rows.

Each `VerseRow` — see full spec below.

### 3d. Page Number Footer
`text-center py-12px`  
`border-top: 1px solid rgba(139,105,20,0.15)`

| Property | Value |
|---|---|
| Text | Arabic numeral of page number, e.g. `١` |
| Font | Cairo, 12px, weight 400 |
| Color | `rgba(139,105,20,0.7)` |

---

## VerseRow — All States

`button`, `w-full text-right px-20px py-8px transition-colors duration-150 position-relative`

| State | Background | Right border |
|---|---|---|
| `normal` | `transparent` | `3px solid transparent` |
| `pending` | `rgba(196,154,60,0.08)` | `3px solid rgba(196,154,60,0.7)` |
| `inRange` | `rgba(100,160,110,0.15)` | `3px solid transparent` |
| `rangeStart` | `rgba(100,160,110,0.15)` | `3px solid transparent` |
| `rangeEnd` | `rgba(100,160,110,0.15)` | `3px solid transparent` |
| `rangeSingle` | `rgba(100,160,110,0.15)` | `3px solid transparent` |

**Verse text:**
| Property | Value |
|---|---|
| Font | Amiri Quran / Amiri, 20px, weight 400 |
| `line-height` | 2.0 |
| Color | `#1A100A` |
| `letter-spacing` | 0.01em |

**Verse number badge** (inline after text):
`22×22px`, `border-radius: 50%`, `vertical-align: middle`, `display: inline-flex items-center justify-center`, `mx-4px`

| State | Background | Border | Color | Font |
|---|---|---|---|---|
| `normal` | transparent | `1px solid rgba(139,105,20,0.4)` | `#8B6914` | Cairo 10px weight 700 |
| `pending` | transparent | `1.5px solid rgba(196,154,60,0.7)` | `#C49A3C` | Cairo 10px weight 700 |
| `rangeStart` / `rangeEnd` / `rangeSingle` | `rgba(100,160,110,0.2)` | `1.5px solid rgba(100,160,110,0.8)` | `rgb(60,130,80)` | Cairo 10px weight 700 |

**Pending indicator dot** (pending state only):
`position: absolute top-8px left-12px`, `8×8px`, `border-radius: 50%`, `background: #C49A3C`, `animation: pulse 1.5s infinite`

---

## 4. Bottom Toolbar

`flex-shrink-0 flex items-center justify-between px-16px py-12px gap-8px`  
`border-top: 1px solid rgba(196,154,60,0.1)`

### 4a. Previous Page Button (right side, RTL leading)

`36×36px (w-9 h-9)`, `border-radius: 12px (rounded-xl)`, `flex items-center justify-center`, `transition-opacity`

| State | Background | Opacity |
|---|---|---|
| Active | `rgba(138,154,184,0.1)` | 1 |
| Disabled (page 0) | `rgba(138,154,184,0.1)` | 0.3 |

Icon: Chevron-right SVG `20×20px`, path `M9 18l6-6-6-6`, `stroke: #EDE7DC`, `strokeWidth: 1.5`

### 4b. Center Action Group

`flex items-center gap-8px flex-1 justify-center`

#### "انتقل" (Go To) Button
`flex items-center gap-6px px-12px py-8px rounded-xl (12px)`

| Property | Value |
|---|---|
| Background | `rgba(138,154,184,0.1)` |
| Border | `1px solid rgba(138,154,184,0.15)` |
| Icon | Search/magnifier SVG `16×16px`, circle + diagonal, `stroke: #8A9AB8`, `strokeWidth: 1.5` |
| Label text | `انتقل` |
| Label font | Cairo, 12px, weight 400, color `#8A9AB8` |

#### Page Counter
| Property | Value |
|---|---|
| Text | e.g. `١ / ١٣` (currentPage / totalPages) |
| Font | Cairo, 12px, weight 400 |
| Color | `rgba(196,154,60,0.7)` |

#### "التحديد" (Ranges) Button
`flex items-center gap-6px px-12px py-8px rounded-xl (12px)`

| State | Background | Border | Icon color | Text | Text weight | Text color |
|---|---|---|---|---|---|---|
| Empty | `rgba(138,154,184,0.1)` | `1px solid rgba(138,154,184,0.15)` | `#8A9AB8` | `التحديد` | 400 | `#8A9AB8` |
| Has ranges | `rgba(196,154,60,0.12)` | `1px solid rgba(196,154,60,0.3)` | `#C49A3C` | `التحديد (١)` etc. | 600 | `#C49A3C` |

Icon: Clipboard-check SVG `16×16px`, `stroke: currentColor`, `strokeWidth: 1.5`

### 4c. Next Page Button (left side, RTL trailing)

Same size and style as Previous button.

| State | Background | Opacity |
|---|---|---|
| Active | `rgba(138,154,184,0.1)` | 1 |
| Disabled (last page) | `rgba(138,154,184,0.1)` | 0.3 |

Icon: Chevron-left SVG `20×20px`, path `M15 18l-6-6 6-6`, `stroke: #EDE7DC`, `strokeWidth: 1.5`

---

## GoToSheet (Bottom Sheet)

Triggered by tapping "انتقل".

`AnimatePresence` — `motion.div`: `y 100%→0`, spring `damping 32 stiffness 320`

**Backdrop:** `position: absolute inset-0 z-40`, `opacity 0→1 duration 0.2s`
- Background: `rgba(8,14,24,0.6)`
- `backdrop-filter: blur(4px)`

**Sheet panel:** `position: absolute bottom-0 left-0 right-0 z-50`, `direction: rtl`

| Property | Value |
|---|---|
| Background | `#131D30` |
| Border | `1px solid rgba(196,154,60,0.15)` (no bottom border) |
| `border-radius` | `24px 24px 0 0` |
| `max-height` | `70%` |
| `display` | `flex flex-col` |

**Drag handle:** `flex justify-center pt-12px pb-8px flex-shrink-0`  
`40×4px (w-10 h-1)`, `border-radius: 9999px`, `background: rgba(255,255,255,0.15)`

**Sheet header area:** `px-20px pb-12px flex-shrink-0`

Sheet title:
| Property | Value |
|---|---|
| Text | `الانتقال إلى` |
| Font | Amiri, 20px, weight 700 |
| Color | `#EDE7DC` |
| `margin-bottom` | 12px |

**Search input container:** `flex items-center gap-8px px-12px py-8px rounded-xl (12px)`
- Background: `rgba(255,255,255,0.05)`
- Border: `1px solid rgba(196,154,60,0.15)`
- Icon: magnifier SVG `16×16px`, `color: #8A9AB8`
- Input: Cairo, 14px, `color: #EDE7DC`, `background: transparent`, `direction: rtl`, `text-align: right`
- Placeholder: `ابحث باسم السورة أو رقمها...`

**Note text below search:**
| Property | Value |
|---|---|
| Text | `* النموذج يتضمن الصفحات ١-٣ فقط (الفاتحة والبقرة ١-٢٠)` |
| Font | Cairo, 10px, weight 400 |
| Color | `#8A9AB8`, opacity 0.6 |

**Surah list** (`flex-1 overflow-y-auto px-16px pb-24px scrollbar-none`):

Each row: `button w-full flex items-center gap-12px py-12px border-bottom text-right hover:opacity-70`  
`border-color: rgba(196,154,60,0.08)`

| Element | Spec |
|---|---|
| Number badge | `32×32px`, `border-radius: 50%`, `background: rgba(196,154,60,0.1)`, `color: #C49A3C`, Cairo 11px weight 700 |
| Surah name | Amiri, 17px, weight 700, color `#EDE7DC` |
| Meta subtitle | e.g. `٧ آية · ص ١` | Cairo, 11px, weight 400, color `#8A9AB8` |
| Trailing chevron | `16×16px`, path `M15 18l-6-6 6-6`, `color: #8A9AB8`, `strokeWidth: 1.5` |

---

## RangesSheet (Bottom Sheet)

Triggered by tapping "التحديد" button.

`AnimatePresence` — same entrance animation as GoToSheet.

**Backdrop:** `position: absolute inset-0 z-40`  
Background: `rgba(8,14,24,0.65)`, `backdrop-filter: blur(4px)`

**Sheet panel:** `position: absolute bottom-0 left-0 right-0 z-50`, `direction: rtl`

| Property | Value |
|---|---|
| Background | `#131D30` |
| Border | `1px solid rgba(196,154,60,0.15)` (no bottom border) |
| `border-radius` | `24px 24px 0 0` |
| `max-height` | `75%` |
| `display` | `flex flex-col` |

**Drag handle:** same as GoToSheet

**Sheet header:** `px-20px pb-12px flex-shrink-0`

Title:
| Property | Value |
|---|---|
| Text | `نطاقات الحفظ` |
| Font | Amiri, 20px, weight 700 |
| Color | `#EDE7DC` |

Subtitle (when ranges > 0):
| Property | Value |
|---|---|
| Text | e.g. `٣ نطاقات · ٢٠ آية` |
| Font | Cairo, 12px, weight 400 |
| Color | `#8A9AB8` |
| `margin-top` | 3px |

### RangesSheet — Empty state
`flex flex-col items-center justify-center py-40px gap-12px`

Icon: circle SVG `48×48px`, `stroke: rgba(196,154,60,0.25)` + plus cross `stroke: rgba(196,154,60,0.4)`

Text:
| Property | Value |
|---|---|
| Line 1 | `لم تحدد أي نطاق بعد` |
| Line 2 | `انقر على آيات المصحف لتحديد محفوظاتك` |
| Font | Cairo, 14px, weight 400 |
| Color | `#8A9AB8` |
| `text-align` | center |

### RangesSheet — Populated list
`flex-1 overflow-y-auto px-16px pb-8px scrollbar-none`

Grouped by surah. For each surah group:

**Surah header:**
| Property | Value |
|---|---|
| Text | `سورة [اسم السورة]` e.g. `سورة الفاتحة` |
| Font | Amiri, 16px, weight 700 |
| Color | `#C49A3C` |
| `margin-bottom` | 8px |

Each range card: `border-radius: 12px (rounded-xl)`, `overflow: hidden`, `background: rgba(12,18,32,0.7)`, `border: 1px solid rgba(196,154,60,0.12)`

Card body `p-12px`:

**Range label row** (`flex items-center justify-between mb-8px`):
- Verse count: Cairo, 11px, color `#8A9AB8`, e.g. `٢٠ آية`
- Range label + dot (right): `الآية ١ — ٢٠`, Cairo, 12px, weight 600, color `rgb(60,130,80)` + `12×12px` circle `background: rgba(100,160,110,0.4)`, `border: 1px solid rgb(100,160,110)`

**From verse row** (`flex items-baseline gap-6px mb-4px`):
- Label: `من` or `الآية`, Cairo 10px, `#8A9AB8`
- Verse text: Amiri Quran/Amiri, 15px, color `#EDE7DC`, truncated

**To verse row** (when range spans > 1 verse):
- Label: `إلى`, Cairo 10px, `#8A9AB8`
- Verse text: Amiri Quran/Amiri, 15px, color `#C4BCAE`, truncated

**Delete button** in each range card:
`flex items-center gap-4px px-10px py-4px rounded-lg (8px)`  
`background: rgba(212,24,61,0.08)`, `border: 1px solid rgba(212,24,61,0.18)`  
Icon: trash `12×12px`, color `#d4183d`  
Text: `حذف`, Cairo 11px, color `#d4183d`

### RangesSheet — Save Button
`w-full py-14px (py-3.5) rounded-2xl (24px) transition-all duration-200 active:scale-[0.98]`

| State | Background | Color | `box-shadow` | Text |
|---|---|---|---|---|
| Has ranges | `linear-gradient(135deg, #D4A843 0%, #C49A3C 100%)` | `#0C1220` | `0 4px 16px rgba(196,154,60,0.25)` | `حفظ [ن] نطاقات` e.g. `حفظ ٣ نطاقات` |
| Empty (disabled) | `rgba(138,154,184,0.15)` | `#8A9AB8` | none | `لا توجد نطاقات للحفظ` |

Font: Cairo, 16px, weight 600

---

## CSS Keyframe

```css
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
```
Used by pending range dot (1.5s on verse rows, 1.2s in notification toast).
