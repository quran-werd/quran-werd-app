# Home Screen — Design Specification

Screen dimensions: 375 × 812 px (mobile frame, `direction: rtl`)

---

## Screen Background

- **Color:** `#0C1220` (token `--background`)
- **Ambient overlay** (`position: absolute`, `inset: 0`, `pointer-events: none`):
  `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(196,154,60,0.07) 0%, transparent 70%)`

---

## 1. Status Bar Row

Layout: `flex`, `items-center`, `justify-between`
Padding: `px-24px`, `pt-16px`, `pb-8px`

### 1a. Clock (right / RTL start)

| Property | Value                    |
| -------- | ------------------------ |
| Text     | `9:41`                   |
| Font     | Cairo, 12 px, weight 400 |
| Color    | `#8A9AB8`                |

### 1b. Battery icon (left / RTL end)

| Part        | Value                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| Outer shell | 16 × 10 px, `border-radius: 2px`, `border: 1px solid #8A9AB8`                                                |
| Fill bar    | `position: absolute`, `inset: 2px`, `right: 6px`, `background: #8A9AB8`, `border-radius: 2px`                |
| Cap nub     | `position: absolute`, `right: -3px`, `top: 3px`, 2 × 4 px, `background: #8A9AB8`, `border-radius-right: 2px` |

---

## 2. Greeting Section

Padding: `px-28px`, `pt-24px`, `pb-8px`

### 2a. Date line

| Property      | Value                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Text          | Dynamic Arabic date, e.g. `الأربعاء، ٢٠ أغسطس` (`ar-SA` locale, weekday long + day numeric + month long) |
| Font          | Cairo, 14 px, weight 400                                                                                 |
| Color         | `#8A9AB8`                                                                                                |
| Margin-bottom | 4 px                                                                                                     |

### 2b. Greeting heading

| Property     | Value                                     |
| ------------ | ----------------------------------------- |
| Line 1 text  | `السلام عليكم،`                           |
| Line 2 text  | `عبد الرحمن`                              |
| Font         | Amiri, 26 px, weight 700, line-height 1.4 |
| Line 1 color | `#EDE7DC`                                 |
| Line 2 color | `#C49A3C`                                 |

---

## 3. Horizontal Divider

- Margin: `mx-28px`, `my-12px`
- Height: 1 px
- Background: `rgba(196,154,60,0.18)` (token `--border`)

---

## 4. Section Label

Padding: `px-28px`, `mb-12px`

| Property       | Value                    |
| -------------- | ------------------------ |
| Text           | `الورد الحالي`           |
| Font           | Cairo, 14 px, weight 400 |
| Color          | `#8A9AB8`                |
| Letter-spacing | `0.08em`                 |

---

## 5. Current Werd Card

Outer container: `px-24px`, `flex-1 flex flex-col`

### Card Shell

| Property      | Value                                                              |
| ------------- | ------------------------------------------------------------------ |
| Border-radius | 16 px                                                              |
| Background    | `linear-gradient(145deg, #182640 0%, #131D30 60%, #0F1829 100%)`   |
| Border        | `1px solid rgba(196,154,60,0.22)`                                  |
| Box-shadow    | `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(196,154,60,0.12)` |
| Overflow      | hidden                                                             |

**Top shimmer line** — `position: absolute`, `top: 0`, `left: 0`, `right: 0`, height 1 px:
`linear-gradient(90deg, transparent, rgba(196,154,60,0.35), transparent)`

**Geometric star** — `position: absolute`, `left: -32px`, `bottom: -32px`, 224 × 224 px, `opacity: 0.60`.
SVG nested rects + radial lines, `stroke: #C49A3C`, element-level `opacity: 0.07`, `strokeWidth: 0.8`.

**Card inner padding:** `p-24px` (all sides)

---

### 5a. Status Pill

Position: row, `flex items-center justify-between`, `mb-20px`. Pill sits on the right (RTL start). Animated with `AnimatePresence mode="wait"`.

#### State — Pending (`لم يبدأ`)

| Property         | Value                                  |
| ---------------- | -------------------------------------- |
| Text             | `لم يبدأ`                              |
| Font             | Cairo, 12 px, weight 600               |
| Color            | `#8A9AB8`                              |
| Background       | `rgba(138,154,184,0.12)`               |
| Border-radius    | 9999 px                                |
| Padding          | `px-12px py-4px`                       |
| Gap (dot → text) | 6 px                                   |
| Dot              | 6 × 6 px circle, `background: #8A9AB8` |
| Animation in     | opacity 0→1, scale 0.85→1, 250 ms      |
| Animation out    | opacity 1→0, 250 ms                    |

#### State — Completed (`مكتمل`)

| Property          | Value                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------- |
| Text              | `مكتمل`                                                                               |
| Font              | Cairo, 12 px, weight 600                                                              |
| Color             | `#C49A3C`                                                                             |
| Background        | `rgba(196,154,60,0.15)`                                                               |
| Border-radius     | 9999 px                                                                               |
| Padding           | `px-12px py-4px`                                                                      |
| Gap (icon → text) | 6 px                                                                                  |
| Icon              | Checkmark SVG, 14 × 14 px, `stroke: currentColor`, stroke-width 2, rounded caps/joins |
| Animation in      | opacity 0→1, scale 0.85→1, 250 ms                                                     |
| Animation out     | opacity 1→0, 250 ms                                                                   |

---

### 5b. Surah Name Heading

| Property      | Value                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| Text          | `سورة البقرة` / `سورة الكهف` / `سورة يس` / `سورة الملك` / `سورة الفاتحة` (dynamic, always prefixed with `سورة `) |
| Font          | Amiri, 34 px, weight 700, line-height 1.2                                                                        |
| Color         | `#EDE7DC`                                                                                                        |
| Margin-bottom | 4 px                                                                                                             |

---

### 5c. Verse Range

| Property      | Value                                                         |
| ------------- | ------------------------------------------------------------- |
| Text          | `الآيات ١ — ٢٠` (dynamic, Arabic-digit ayah numbers, em dash) |
| Font          | Cairo, 14 px, weight 400                                      |
| Color         | `#8A9AB8`                                                     |
| Margin-bottom | 20 px                                                         |

---

### 5d. Inner Gold Divider

- Width: 100%, height: 1 px
- Background: `rgba(196,154,60,0.12)`
- Margin-bottom: 20 px

---

### 5e. Stats Row

Layout: `flex`, `items-center`, `gap-16px`, `justify-end`

Three columns, right → left reading order, separated by two vertical dividers.

**Vertical dividers:**

- Width: 1 px, height: 24 px
- Background: `rgba(196,154,60,0.15)`

**Label (per column):**

- Font: Cairo, 11 px, weight 400, color `#8A9AB8`

**Value (per column):**

- Font: Cairo, 15 px, weight 600, color `#EDE7DC`
- Alignment: center

| Position  | Label        | Example value |
| --------- | ------------ | ------------- |
| Rightmost | `عدد الآيات` | `٢٠`          |
| Center    | `الجزء`      | `الأول`       |
| Leftmost  | `الحزب`      | `١`           |

**Dynamic values per werd:**

| Wird | Surah   | Ayah range | عدد الآيات | الجزء           | الحزب |
| ---- | ------- | ---------- | ---------- | --------------- | ----- |
| 1    | البقرة  | ١ — ٢٠     | ٢٠         | الأول           | ١     |
| 2    | البقرة  | ٢١ — ٤٠    | ٢٠         | الأول           | ١     |
| 3    | الكهف   | ١ — ١٠     | ١٠         | الخامس عشر      | ٢٩    |
| 4    | يس      | ١ — ٣٠     | ٣٠         | الثاني والعشرون | ٤٤    |
| 5    | الملك   | ١ — ٣٠     | ٣٠         | التاسع والعشرون | ٥٧    |
| 6    | الفاتحة | ١ — ٧      | ٧          | الأول           | ١     |

---

### 5f. CTA Divider

- Margin-top: 20 px
- Padding-top: 16 px
- Border-top: `1px solid rgba(196,154,60,0.12)`

---

### 5g. CTA Area — State: Pending

Rendered when `completedCount === 0`. Animated with `AnimatePresence mode="wait"`.
Animation in: opacity 0→1, y 8px→0, 250 ms. Animation out: opacity 1→0, y 0→-6px.

#### Start Button

| Property      | Value                                                            |
| ------------- | ---------------------------------------------------------------- |
| Text          | `ابدأ المراجعة`                                                  |
| Font          | Cairo, 16 px, weight 600                                         |
| Color         | `#0C1220`                                                        |
| Width         | 100%                                                             |
| Padding       | `py-12px`                                                        |
| Border-radius | 12 px                                                            |
| Background    | `linear-gradient(135deg, #D4A843 0%, #C49A3C 50%, #B08830 100%)` |
| Box-shadow    | `0 4px 16px rgba(196,154,60,0.28)`                               |
| Active state  | scale 0.98, transition 200 ms                                    |

---

### 5g. CTA Area — State: Completed

Rendered when `completedCount >= 1`. Animated with `AnimatePresence mode="wait"`.
Animation in: opacity 0→1, 250 ms. Animation out: opacity 1→0.

Layout: `flex`, `items-center`, `justify-center`, `gap-8px`, `py-8px`

#### Checkmark Badge

| Property   | Value                                                                              |
| ---------- | ---------------------------------------------------------------------------------- |
| Size       | 20 × 20 px                                                                         |
| Shape      | circle                                                                             |
| Background | `rgba(196,154,60,0.15)`                                                            |
| Border     | `1px solid rgba(196,154,60,0.4)`                                                   |
| Icon       | Checkmark SVG, 12 × 12 px, `stroke: #C49A3C`, stroke-width 2.5, rounded caps/joins |

#### Completion Message

| Property | Value                             |
| -------- | --------------------------------- |
| Text     | `أتممت ورد اليوم · بارك الله فيك` |
| Font     | Cairo, 14 px, weight 600          |
| Color    | `#C49A3C`                         |

---

### 5h. Next Werd Section

Only rendered when `completedCount >= 1` **and** `completedCount < 6` (a next werd exists in the plan).
Hidden when all 6 werds are completed, or when the current werd is not yet done.

Animation in: opacity 0→1, y 10px→0, 300 ms, delay 150 ms.
Animation out: opacity 1→0, y 0→-6px.
Margin-top: 12 px.

#### Sub-divider

- Height: 1 px
- Background: `rgba(196,154,60,0.12)`
- Margin-bottom: 12 px

#### Section Label

| Property       | Value                    |
| -------------- | ------------------------ |
| Text           | `الورد التالي`           |
| Font           | Cairo, 10 px, weight 600 |
| Color          | `rgba(138,154,184,0.6)`  |
| Letter-spacing | `0.08em`                 |
| Margin-bottom  | 8 px                     |

#### Dashed Next-Werd Button

| Property      | Value                                     |
| ------------- | ----------------------------------------- |
| Width         | 100%                                      |
| Layout        | `flex`, `items-center`, `justify-between` |
| Padding       | `px-16px py-12px`                         |
| Border-radius | 12 px                                     |
| Border        | `1.5px dashed rgba(196,154,60,0.28)`      |
| Background    | `rgba(196,154,60,0.04)`                   |
| Active state  | opacity 0.60                              |

**Text block (right side, RTL start, `text-right`):**

Surah name:
| Property | Value |
|---|---|
| Text | `سورة البقرة` / `سورة الكهف` / etc. (dynamic, prefixed `سورة `) |
| Font | Amiri, 16 px, weight 700, line-height 1.3 |
| Color | `rgba(237,231,220,0.75)` |

Verse range:
| Property | Value |
|---|---|
| Text | `الآيات ٢١ — ٤٠` (dynamic, Arabic digits) |
| Font | Cairo, 11 px, weight 400 |
| Color | `rgba(138,154,184,0.7)` |
| Margin-top | 2 px |

**Chevron icon (left side, RTL end):**
| Property | Value |
|---|---|
| Size | 16 × 16 px |
| Path | `M15 18l-6-6 6-6` (left-pointing in LTR; reads as "forward" in RTL) |
| Stroke | `rgba(196,154,60,0.5)` |
| Stroke-width | 1.75 |
| Stroke caps/joins | round |
| flex-shrink | 0 |

---

## 6. Full State Matrix

| `completedCount` | Status pill       | Card surah   | Card ayahs | CTA                    | Next werd section          |
| ---------------- | ----------------- | ------------ | ---------- | ---------------------- | -------------------------- |
| 0                | `لم يبدأ` (slate) | سورة البقرة  | ١ — ٢٠     | `ابدأ المراجعة` button | **Hidden**                 |
| 1                | `مكتمل` (gold)    | سورة البقرة  | ١ — ٢٠     | Completion message     | سورة البقرة · ٢١–٤٠        |
| 2                | `مكتمل` (gold)    | سورة البقرة  | ٢١ — ٤٠    | Completion message     | سورة الكهف · ١–١٠          |
| 3                | `مكتمل` (gold)    | سورة الكهف   | ١ — ١٠     | Completion message     | سورة يس · ١–٣٠             |
| 4                | `مكتمل` (gold)    | سورة يس      | ١ — ٣٠     | Completion message     | سورة الملك · ١–٣٠          |
| 5                | `مكتمل` (gold)    | سورة الملك   | ١ — ٣٠     | Completion message     | سورة الفاتحة · ١–٧         |
| 6                | `مكتمل` (gold)    | سورة الفاتحة | ١ — ٧      | Completion message     | **Hidden** (plan complete) |

---

## 7. Transitions

| Element                     | Trigger                     | Animation                                                                             |
| --------------------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| Status pill swap            | `completedCount` crosses 0  | `AnimatePresence mode="wait"`: outgoing fades; incoming scales 0.85→1 + fades, 250 ms |
| CTA area swap               | `completedCount` crosses 0  | `AnimatePresence mode="wait"`: pending exits opacity+y; done enters opacity+y, 250 ms |
| Next werd section appear    | `nextWerd` becomes non-null | opacity 0→1, y 10→0, 300 ms, delay 150 ms                                             |
| Next werd section disappear | `nextWerd` becomes null     | opacity 1→0, y 0→-6, 300 ms                                                           |
| Card surah / range update   | `completedCount` increments | Instant React re-render (no transition)                                               |

---

## 8. Design Tokens

| Token                | Value                   |
| -------------------- | ----------------------- |
| `--background`       | `#0C1220`               |
| `--foreground`       | `#EDE7DC`               |
| `--muted-foreground` | `#8A9AB8`               |
| `--border`           | `rgba(196,154,60,0.18)` |
| `--card`             | `#131D30`               |
| `--primary`          | `#C49A3C`               |
| Gold dark            | `#B08830`               |
| Gold mid             | `#C49A3C`               |
| Gold light           | `#D4A843`               |
| Display font         | Amiri, serif            |
| Body / UI font       | Cairo, sans-serif       |
