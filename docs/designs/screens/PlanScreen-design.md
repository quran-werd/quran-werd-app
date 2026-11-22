# Plan Screen — Complete Design Specification

> Tab screen (BottomNav present). Root `direction: rtl` inherited from phone frame. Background `#0C1220`. Two mutually-exclusive top-level states: **Empty** (`memorizations.length === 0`) and **Populated** (`memorizations.length > 0`). The populated state contains a **Goal Card** (Daily / Weekly sub-modes) and a **Werd List**. Werd cards each have **Collapsed** and **Expanded** sub-states.

---

## Root Container

```
display: flex
flex-direction: column
height: 100%          /* h-full */
background: #0C1220
```

---

## 1. Header

```
flex-shrink: 0
padding: 40px 20px 12px    /* pt-10 px-5 pb-3 */
position: relative
border-bottom: 1px solid rgba(196,154,60,0.1)
```

### 1a. Ambient glow (decorative, non-interactive)

```
position: absolute
top: 0
left: 50%
transform: translateX(-50%)
width: 200px
height: 60px
background: radial-gradient(ellipse, rgba(196,154,60,0.07) 0%, transparent 70%)
pointer-events: none
```

### 1b. Header inner row

```
display: flex
align-items: baseline
justify-content: space-between
```

### 1c. Screen Title

| Property    | Value          |
| ----------- | -------------- |
| Text        | `خطة المراجعة` |
| Font family | Amiri, serif   |
| Font size   | 22px           |
| Font weight | 700            |
| Line-height | 1.2            |
| Color       | `#EDE7DC`      |
| Position    | relative       |

### 1d. Werd Count Label

Visibility rule: shown only when **populated** AND `awrad.length > 0`.

| Property    | Value                                                             |
| ----------- | ----------------------------------------------------------------- |
| Text        | Dynamic: `[Arabic numeral] ورد` — e.g. `١٤ ورد`, `٣ ورد`, `١ ورد` |
| Font family | Cairo, sans-serif                                                 |
| Font size   | 11px                                                              |
| Font weight | 400 (unset / normal)                                              |
| Color       | `#8A9AB8`                                                         |
| Position    | relative                                                          |

---

## State A — Empty State

Condition: `memorizations.length === 0`

```
flex: 1
display: flex
flex-direction: column
align-items: center
justify-content: center
padding: 0 32px      /* px-8 */
gap: 24px            /* gap-6 */
```

---

### A1. Decorative Circle

```
width: 100px
height: 100px
border-radius: 50%
background: rgba(196,154,60,0.06)
border: 1px solid rgba(196,154,60,0.15)
display: flex
align-items: center
justify-content: center
position: relative
```

**Dashed outer ring** (child, `position: absolute`):

```
inset: -8px
border-radius: 50%
border: 1px dashed rgba(196,154,60,0.12)
```

**Scroll / receipt SVG icon:**

```
width: 44px
height: 44px
viewBox: 0 0 48 48
fill: none
```

SVG paths:

| Path / element    | `d` or coords                                                  | Stroke                 | strokeWidth | Extra                   |
| ----------------- | -------------------------------------------------------------- | ---------------------- | ----------- | ----------------------- |
| Main receipt body | `M8 40V12a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v28l-8-4-8 4-8-4-8 4z` | `rgba(196,154,60,0.5)` | 1.5         | `strokeLinejoin: round` |
| Top line          | `M16 18h16`                                                    | `rgba(196,154,60,0.4)` | 1.5         | `strokeLinecap: round`  |
| Short line        | `M16 24h10`                                                    | `rgba(196,154,60,0.4)` | 1.5         | `strokeLinecap: round`  |

---

### A2. Text Block

```
text-align: center
```

**Heading:**

| Property      | Value                  |
| ------------- | ---------------------- |
| Text          | `لم يتم توليد خطة بعد` |
| Font family   | Amiri, serif           |
| Font size     | 20px                   |
| Font weight   | 700                    |
| Color         | `#EDE7DC`              |
| Margin-bottom | 8px                    |

**Body paragraph:**

| Property                | Value                                  |
| ----------------------- | -------------------------------------- |
| Line 1                  | `أضف محفوظاتك أولاً من شاشة المحفوظات` |
| Line 2 (after `<br />`) | `ثم قم بتوليد خطة المراجعة`            |
| Font family             | Cairo, sans-serif                      |
| Font size               | 13px                                   |
| Font weight             | 400                                    |
| Line-height             | 1.7                                    |
| Color                   | `#8A9AB8`                              |

---

### A3. CTA Button — `توليد الخطة`

```
font-family: Cairo, sans-serif
font-size: 15px
font-weight: 600
color: #0C1220
padding: 13px 32px
border-radius: 14px
border: none
cursor: pointer
background: linear-gradient(135deg, #D4A843 0%, #C49A3C 100%)
box-shadow: 0 6px 20px rgba(196,154,60,0.3)
```

Text: `توليد الخطة`

---

## State B — Populated

Condition: `memorizations.length > 0`

```
flex: 1
display: flex
flex-direction: column
overflow: hidden
min-height: 0    /* min-h-0 */
```

---

## 2. Goal Card

```
flex-shrink: 0
margin: 12px 16px 0   /* mx-4 mt-3 */
border-radius: 16px   /* rounded-2xl */
overflow: hidden
background: #131D30
border: 1px solid rgba(196,154,60,0.18)
```

### 2a. Top gradient bar

```
height: 2px
background: linear-gradient(90deg, transparent, #C49A3C 40%, transparent)
```

### 2b. Card body

```
padding: 7px 10px
```

### 2c. Input Row

```
display: flex
align-items: center
justify-content: space-between
gap: 10px
```

---

#### Input Container (number field + mode-toggle button)

Positioned with `margin-left: auto` (pushes to the right in LTR flex — sits on the left visually in RTL reading order).

```
display: inline-flex
align-items: center
padding: 12px 10px
border-radius: 8px
background: rgba(8,14,24,0.7)
border: 1px solid [see table below]
transition: border-color 0.2s
```

Border color by mode:

| Mode     | Border color            |
| -------- | ----------------------- |
| `daily`  | `rgba(196,154,60,0.2)`  |
| `weekly` | `rgba(196,154,60,0.35)` |

---

##### Number Input

```
type: number
min: 0.5
step: 0.5
width: 36px
background: transparent
border: none
outline: none
font-family: Cairo, sans-serif
font-size: 14px
font-weight: 700
color: #EDE7DC
text-align: center
padding: 0
```

Default values:

| Mode     | Default value |
| -------- | ------------- |
| `daily`  | `2`           |
| `weekly` | `10`          |

Pressing Enter triggers the same action as the "تحديث الخطة" button.

---

##### Mode Toggle Button

```
display: flex
align-items: center
gap: 5px
flex-shrink: 0
padding: 4px 8px
border-radius: 7px
cursor: pointer
transition: all 0.18s
border: 1px solid [see table]
background: [see table]
```

States:

| Mode shown                         | Label text     | Background               | Border                  | Text color | Icon color |
| ---------------------------------- | -------------- | ------------------------ | ----------------------- | ---------- | ---------- |
| `daily` (tap → switches to weekly) | `صفحة / يوم`   | `rgba(138,154,184,0.08)` | `rgba(138,154,184,0.2)` | `#8A9AB8`  | `#8A9AB8`  |
| `weekly` (tap → switches to daily) | `صفحة / أسبوع` | `rgba(196,154,60,0.12)`  | `rgba(196,154,60,0.4)`  | `#C49A3C`  | `#C49A3C`  |

Label span:

```
font-family: Cairo, sans-serif
font-size: 12px
font-weight: 400
white-space: nowrap
color: [per state above]
```

**Sliders / filter SVG icon:**

```
viewBox: 0 0 16 16
fill: none
width: 13px
height: 13px
flex-shrink: 0
color: [per state above]
```

SVG elements (all `stroke: currentColor`, `strokeWidth: 1.5`, `strokeLinecap: round`):

| Element              | Coords                                   |
| -------------------- | ---------------------------------------- |
| Top line             | `x1=2 y1=4 x2=14 y2=4`                   |
| Middle line          | `x1=2 y1=8 x2=14 y2=8`                   |
| Bottom line          | `x1=2 y1=12 x2=14 y2=12`                 |
| Top circle (knob)    | `cx=10 cy=4 r=2` — `fill: currentColor`  |
| Middle circle (knob) | `cx=5 cy=8 r=2` — `fill: currentColor`   |
| Bottom circle (knob) | `cx=10 cy=12 r=2` — `fill: currentColor` |

---

#### "تحديث الخطة" / "✓ تم" Button

```
flex-shrink: 0
font-family: Cairo, sans-serif
font-size: 11px
font-weight: 700
padding: 13px 12px
border-radius: 8px
cursor: pointer
transition: all 0.22s
border: 1px solid [see table]
```

Two states (`saved` toggles to `false` after 2200 ms):

| State                         | Text          | Color     | Background                                  | Border                 | Box-shadow                        |
| ----------------------------- | ------------- | --------- | ------------------------------------------- | ---------------------- | --------------------------------- |
| Normal (`saved=false`)        | `تحديث الخطة` | `#0C1220` | `linear-gradient(135deg, #D4A843, #C49A3C)` | `transparent`          | `0 2px 8px rgba(196,154,60,0.25)` |
| Saved (`saved=true`, 2200 ms) | `✓ تم`        | `#3DA65A` | `rgba(61,166,90,0.12)`                      | `rgba(61,166,90,0.35)` | `none`                            |

---

### 2d. Day-picker row (Weekly mode only)

Visibility: Shown only when `mode === "weekly"`.

`AnimatePresence initial={false}` — `motion.div`:

```
initial:  { height: 0, opacity: 0 }
animate:  { height: "auto", opacity: 1 }
exit:     { height: 0, opacity: 0 }
transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
overflow: hidden
```

Inner wrapper: `padding-top: 6px`

**Separator line:**

```
height: 1px
margin-bottom: 6px
background: linear-gradient(90deg, transparent, rgba(196,154,60,0.15), transparent)
```

**Row:**

```
display: flex
align-items: center
gap: 5px
```

**Day buttons container:**

```
flex: 1
display: flex
gap: 3px
```

**7 day buttons** — rendered in array order (right→left in RTL layout):

| Array index | `key` | `label` | Full day name |
| ----------- | ----- | ------- | ------------- |
| 0           | `sat` | `س`     | السبت         |
| 1           | `sun` | `ح`     | الأحد         |
| 2           | `mon` | `ن`     | الاثنين       |
| 3           | `tue` | `ث`     | الثلاثاء      |
| 4           | `wed` | `ر`     | الأربعاء      |
| 5           | `thu` | `خ`     | الخميس        |
| 6           | `fri` | `ج`     | الجمعة        |

Default active days (initial `activeDays` Set): `sat`, `sun`, `mon`, `tue`, `wed`  
→ Buttons `س` `ح` `ن` `ث` `ر` start **active**; `خ` and `ج` start **inactive**.

Constraint: at least 1 day must remain active (tapping the last active day is ignored).

Each button:

```
flex: 1
aspect-ratio: 1
border-radius: 50%
display: flex
align-items: center
justify-content: center
font-family: Cairo, sans-serif
font-size: 10px
font-weight: 700
cursor: pointer
transition: all 0.18s
border: 1px solid [see table]
```

Per-state values:

| State    | Label color | Background                                  | Border color             |
| -------- | ----------- | ------------------------------------------- | ------------------------ |
| Active   | `#0C1220`   | `linear-gradient(135deg, #D4A843, #C49A3C)` | `rgba(196,154,60,0.5)`   |
| Inactive | `#8A9AB8`   | `rgba(138,154,184,0.08)`                    | `rgba(138,154,184,0.12)` |

**Daily pages label** (to the right of the buttons container, in RTL = rightmost / trailing):

```
font-family: Cairo, sans-serif
font-size: 9px
font-weight: 700
color: #C49A3C
flex-shrink: 0
```

Text: `[dailyLabel] صفحة / يوم`

`dailyLabel` computation:

- `dailyPages = weeklyGoal / activeDays.size`
- If `dailyPages % 1 === 0` → `toArabicNum(dailyPages)` (e.g. `٢`)
- Else → `toArabicNum(Math.floor(dailyPages)) + "½"` (e.g. `١½`)

Examples: `٢ صفحة / يوم`, `١½ صفحة / يوم`, `٣ صفحة / يوم`

---

## 3. Plan List

```
flex: 1
overflow-y: auto
padding: 8px 16px 16px    /* px-4 pt-2 pb-4 */
scrollbar-width: none
```

### 3a. Section label

```
font-family: Cairo, sans-serif
font-size: 11px
font-weight: 400
color: rgba(138,154,184,0.45)
letter-spacing: 0.04em
margin-bottom: 8px   /* mb-2 */
padding: 0 4px       /* px-1 */
```

Text: `قائمة الأوراد`

### 3b. Werd cards container

```
display: flex
flex-direction: column
gap: 6px
```

Each `motion.div` animates in:

```
initial:    { opacity: 0, y: 8 }
animate:    { opacity: 1, y: 0 }
transition: { delay: idx * 0.04, duration: 0.25 }
```

---

## WerdCard — All States

### Outer card wrapper (`motion.div`)

```
border-radius: 14px
overflow: hidden
transition: border-color 0.25s, box-shadow 0.25s
```

Three card states (determined by `isToday = idx === 0` and `isOpen = openAwrad.has(werd.num)`):

| State                                            | Background           | Border                            | Box-shadow                         |
| ------------------------------------------------ | -------------------- | --------------------------------- | ---------------------------------- |
| Today / collapsed (`isToday=true, isOpen=false`) | `rgba(30,26,20,0.6)` | `1px solid rgba(196,154,60,0.45)` | `0 4px 20px rgba(196,154,60,0.12)` |
| Today / open (`isToday=true, isOpen=true`)       | `rgba(30,26,20,0.6)` | `1px solid rgba(196,154,60,0.45)` | `0 4px 20px rgba(196,154,60,0.12)` |
| Other / open (`isToday=false, isOpen=true`)      | `#131D30`            | `1px solid rgba(196,154,60,0.28)` | `none`                             |
| Other / closed (`isToday=false, isOpen=false`)   | `#131D30`            | `1px solid rgba(196,154,60,0.1)`  | `none`                             |

Note: border formula in code: `rgba(196,154,60,${isToday ? "0.45" : "0.28"})` when `isOpen || isToday`, else `rgba(196,154,60,0.1)`.

---

### Today's highlight bar (first card only, `idx === 0`)

```
height: 2px
background: linear-gradient(90deg, transparent, #C49A3C 30%, #E8C06A 60%, transparent)
```

Only rendered when `isToday === true`.

---

### Header button (tap to toggle expand/collapse)

```
width: 100%
text-align: right
display: flex
align-items: center
gap: 12px
padding: 12px 14px
background: transparent
border: none
cursor: pointer
```

---

#### Werd Number Badge

```
width: 36px
height: 36px
border-radius: 50%
flex-shrink: 0
display: flex
align-items: center
justify-content: center
```

Per state:

| State           | Background               | Border                             |
| --------------- | ------------------------ | ---------------------------------- |
| `isToday=true`  | `rgba(212,200,185,0.1)`  | `1px solid rgba(212,200,185,0.22)` |
| `isToday=false` | `rgba(138,154,184,0.08)` | `1px solid rgba(138,154,184,0.12)` |

Number span:

```
font-family: Cairo, sans-serif
font-size: 12px
font-weight: 700
color: [per state below]
```

| State           | Color                    |
| --------------- | ------------------------ |
| `isToday=true`  | `rgba(212,200,185,0.75)` |
| `isToday=false` | `#8A9AB8`                |

Text content: `toArabicNum(werd.num)` — e.g. `١`, `٢`, `٣` … `١٤`

---

#### Werd Info Block

```
flex: 1
min-width: 0
text-align: right
```

**Surah name + "اليوم" badge row:**

```
display: flex
align-items: center
gap: 6px
margin-bottom: 2px
```

**Surah name `<p>`:**

```
font-family: Amiri, serif
font-size: 16px
font-weight: 700
```

| State           | Color                   |
| --------------- | ----------------------- |
| `isToday=true`  | `#EDE7DC`               |
| `isToday=false` | `rgba(237,231,220,0.8)` |

Text: `werd.surahName` — e.g. `الفاتحة`, `البقرة`, `آل عمران`

**"اليوم" badge** (only rendered when `isToday=true`):

```
font-family: Cairo, sans-serif
font-size: 10px
font-weight: 600
color: rgba(212,200,185,0.75)
background: rgba(212,200,185,0.07)
border: 1px solid rgba(212,200,185,0.2)
padding: 1px 7px
border-radius: 20px
flex-shrink: 0
```

Text: `اليوم`

**Verse range subtitle `<p>`:**

```
font-family: Cairo, sans-serif
font-size: 11px
font-weight: 400
```

| State           | Color                    |
| --------------- | ------------------------ |
| `isToday=true`  | `rgba(212,200,185,0.55)` |
| `isToday=false` | `#8A9AB8`                |

Text pattern: `الآيات [fromVerse] – [toVerse] · [verseCount] آية`

Examples:

- `الآيات ١ – ٧ · ٧ آية` (single surah covering all verses)
- `الآيات ١ – ٣٠ · ٣٠ آية`
- `الآيات ٢١ – ٥٠ · ٣٠ آية`

Middle separator character: `·` (U+00B7 MIDDLE DOT) surrounded by spaces

---

#### Chevron Icon

```
viewBox: 0 0 24 24
fill: none
width: 16px
height: 16px
flex-shrink: 0
color: #8A9AB8
transition: transform 0.3s
```

| State                      | Transform        |
| -------------------------- | ---------------- |
| Collapsed (`isOpen=false`) | `rotate(0deg)`   |
| Expanded (`isOpen=true`)   | `rotate(180deg)` |

SVG path:

```
d: M6 9l6 6 6-6
stroke: currentColor
strokeWidth: 1.5
strokeLinecap: round
strokeLinejoin: round
```

---

## WerdCard — Expanded Content

`AnimatePresence initial={false}` — `motion.div` (conditionally rendered when `isOpen=true`):

```
initial:    { height: 0, opacity: 0 }
animate:    { height: "auto", opacity: 1 }
exit:       { height: 0, opacity: 0 }
transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] }
overflow:   hidden
```

**Outer padding wrapper:**

```
padding: 0 12px 12px
border-top: 1px solid rgba(196,154,60,0.08)
```

**Inner card:**

```
margin-top: 10px
border-radius: 10px
overflow: hidden
background: rgba(12,18,32,0.6)
border: 1px solid rgba(196,154,60,0.08)
```

**Verse preview block:**

```
padding: 10px 12px
display: flex
flex-direction: column
gap: 8px
background: rgba(15,12,8,0.45)
```

---

### From Row (always rendered)

```
display: flex
align-items: baseline
gap: 8px
```

**Verse number circle:**

```
flex-shrink: 0
width: 24px
height: 24px
border-radius: 50%
display: flex
align-items: center
justify-content: center
background: rgba(196,154,60,0.12)
font-family: Cairo, sans-serif
font-size: 10px
font-weight: 700
color: #C49A3C
```

Text: `toArabicNum(werd.fromVerse)` — e.g. `١`, `٢١`

**Label span:**

```
flex-shrink: 0
font-family: Cairo, sans-serif
font-size: 10px
font-weight: 400
color: #8A9AB8
```

Text:

- `الآية` — when `isSingle=true` (`werd.fromVerse === werd.toVerse`)
- `من` — when `isSingle=false` (range)

**Verse text `<p>`:**

```
font-family: Amiri Quran, Amiri, serif
font-size: 14px
font-weight: 400
color: #EDE7DC
line-height: 1.6
flex: 1
overflow: hidden
white-space: nowrap
text-overflow: ellipsis
```

Text: `getVerseText(werd.surahNum, werd.fromVerse)` — first verse of the werd

---

### To Row (rendered only when `isSingle=false`, i.e. `fromVerse ≠ toVerse`)

```
display: flex
align-items: baseline
gap: 8px
```

**Verse number circle:**

```
flex-shrink: 0
width: 24px
height: 24px
border-radius: 50%
display: flex
align-items: center
justify-content: center
background: rgba(138,154,184,0.1)
font-family: Cairo, sans-serif
font-size: 10px
font-weight: 700
color: #8A9AB8
```

Text: `toArabicNum(werd.toVerse)` — e.g. `٧`, `٣٠`

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
font-size: 14px
font-weight: 400
color: #C4BCAE
line-height: 1.6
flex: 1
overflow: hidden
white-space: nowrap
text-overflow: ellipsis
```

Text: `getVerseText(werd.surahNum, werd.toVerse)` — last verse of the werd

---

## 4. Summary Footer Card

Visibility: Rendered below the werd cards list when `awrad.length > 0`.

```
margin-top: 16px    /* mt-4 */
padding: 12px 0     /* py-3 */
border-radius: 12px /* rounded-xl */
text-align: center
background: rgba(138,154,184,0.04)
border: 1px dashed rgba(138,154,184,0.1)
```

**Summary text `<p>`:**

```
font-family: Cairo, sans-serif
font-size: 12px
font-weight: 400
color: rgba(138,154,184,0.5)
```

Text pattern: `ستُنهي كل محفوظاتك خلال [N] يوم بهذه الخطة`

Where `[N]` = `toArabicNum(awrad.length)`.

Examples:

- `ستُنهي كل محفوظاتك خلال ١٤ يوم بهذه الخطة`
- `ستُنهي كل محفوظاتك خلال ٣ يوم بهذه الخطة`
- `ستُنهي كل محفوظاتك خلال ١ يوم بهذه الخطة`

---

## 5. Bottom Navigation Bar

See `HomeScreen-design.md §7`. Active tab on this screen: **الخطة** (tab index 2, middle-left).

Active indicator: gold dot `6×6px` `border-radius: 50%` `background: #C49A3C` centered below the الخطة icon.
