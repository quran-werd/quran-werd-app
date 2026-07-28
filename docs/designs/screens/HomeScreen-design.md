# Home Screen — Complete Design Specification

> Fixed 375×812 px phone frame, `direction: rtl`, `font-family: 'Cairo', sans-serif` as base. Two visual states: **Pending** (ward not yet reviewed) and **Completed** (ward done for today).

---

## Phone Frame (outer shell)

| Property | Value |
|---|---|
| Width × Height | 375 × 812 px |
| `border-radius` | 44px |
| Background | `#0C1220` (via `bg-background` token) |
| `box-shadow` | `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,154,60,0.12)` |
| `direction` | `rtl` |
| Outer wrapper | `min-h-screen`, `flex items-center justify-center`, `p-16px`, `bg-background` |

---

## Ambient Glow Overlay

Single `div`, `position: absolute`, `inset: 0`, `pointer-events: none`:

```
background: radial-gradient(ellipse 60% 50% at 50% 0%,
  rgba(196,154,60,0.07) 0%,
  transparent 70%)
```

---

## 1. Status Bar Row

**Container:** `flex items-center justify-between`, `px-24px pt-16px pb-8px`, `position: relative z-10`

### 1a. Time label (right side, RTL leading)
| Property | Value |
|---|---|
| Text | `9:41` |
| Font | Cairo, 12px (`text-xs`), weight 400 |
| Color | `#8A9AB8` |

### 1b. Battery icon (left side, RTL trailing)
Inline HTML `div` — no SVG:

| Property | Value |
|---|---|
| Outer shell | `width: 16px`, `height: 10px`, `border-radius: 4px (rounded-sm)`, `border: 1px solid #8A9AB8` |
| Inner fill bar | `position: absolute`, `inset: 2px`, `right: 6px` (leaving gap on left), `background: #8A9AB8`, `border-radius: 2px` |
| Cap nub | `position: absolute`, `right: -3px`, `top: 3px`, `width: 2px`, `height: 4px`, `background: #8A9AB8`, `border-radius: 0 2px 2px 0` |

---

## 2. Date + Greeting Block

**Container:** `px-28px pt-24px pb-8px`, `position: relative z-10`

### 2a. Date line
| Property | Value |
|---|---|
| Text | Dynamic — e.g. `الأحد، ٢٧ يوليو` (Arabic locale `ar-SA`, weekday long + day numeric + month long) |
| Font | Cairo, 14px (`text-sm`), weight 400 |
| Color | `#8A9AB8` (via `text-muted-foreground`) |
| Margin-bottom | 4px (`mb-1`) |

### 2b. Greeting heading
| Property | Value |
|---|---|
| Line 1 text | `السلام عليكم،` |
| Line 2 text | `عبد الرحمن` |
| Font | Amiri, 26px, weight 700, `line-height: 1.4` |
| Line 1 color | `#EDE7DC` (via `text-foreground`) |
| Line 2 color | `#C49A3C` (inline `color` override on `<span>`) |

---

## 3. Horizontal Divider

`height: 1px`, `background: rgba(196,154,60,0.18)` (via `bg-border` token), `margin: 12px 28px` (Tailwind `mx-7 my-3`)

---

## 4. "ورد اليوم" Label

**Container:** `px-28px mb-12px`, `position: relative z-10`

| Property | Value |
|---|---|
| Text | `ورد اليوم` |
| Font | Cairo, 14px (`text-sm`), weight 400 |
| Color | `#8A9AB8` (via `text-muted-foreground`) |
| `letter-spacing` | `0.08em` |

---

## 5. Ward Card

**Container:** `px-24px`, `position: relative z-10`, `flex-1 flex flex-col`

**Card shell:** `position: relative`, `border-radius: 16px (rounded-2xl)`, `overflow: hidden`, `flex-shrink: 0`

| Property | Value |
|---|---|
| Background | `linear-gradient(145deg, #182640 0%, #131D30 60%, #0F1829 100%)` |
| Border | `1px solid rgba(196,154,60,0.22)` |
| `box-shadow` | `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(196,154,60,0.12)` |

**Top gold hairline** (absolute, `top:0 inset-x:0`, `height: 1px`):
```
background: linear-gradient(90deg, transparent, rgba(196,154,60,0.35), transparent)
```

**Geometric star decoration** (absolute, `left: -32px bottom: -32px`, `width: 224px height: 224px`, `opacity: 0.6`, `overflow: hidden`): `GeometricStar` SVG — nested rects + radial lines, `stroke: #C49A3C`, `opacity: 0.07`, `strokeWidth: 0.8`

**Card inner padding:** `p-24px` (`p-6`)

---

### 5a. Status Pill — "لم يبدأ" (Pending state)

`AnimatePresence mode="wait"` — `motion.div`, `opacity 0→1, scale 0.85→1, duration 0.25s`, `exit: opacity 0`

| Property | Value |
|---|---|
| Text | `لم يبدأ` |
| Layout | `flex items-center gap-6px px-12px py-4px` |
| `border-radius` | `9999px (rounded-full)` |
| Background | `rgba(138,154,184,0.12)` |
| Color | `#8A9AB8` |
| Font | Cairo, 12px (`text-xs`), weight 600 |
| Dot indicator | `width: 6px height: 6px`, `border-radius: 50%`, `background: #8A9AB8` |

### 5a. Status Pill — "مكتمل" (Completed state)

| Property | Value |
|---|---|
| Text | `مكتمل` |
| Layout | `flex items-center gap-6px px-12px py-4px` |
| `border-radius` | `9999px (rounded-full)` |
| Background | `rgba(196,154,60,0.15)` |
| Color | `#C49A3C` |
| Font | Cairo, 12px (`text-xs`), weight 600 |
| Icon | Checkmark SVG `14×14px (w-3.5 h-3.5)`, path `M5 13l4 4L19 7`, `stroke: currentColor`, `strokeWidth: 2`, `strokeLinecap: round` |

---

### 5b. Surah Name

| Property | Value |
|---|---|
| Text | `سورة البقرة` |
| Font | Amiri, 34px, weight 700, `line-height: 1.2` |
| Color | `#EDE7DC` (via `text-foreground`) |
| Margin-bottom | 4px (`mb-1`) |
| Margin-top from pill | 20px (`mb-5` on the pill row above) |

### 5c. Verse Range Subtitle

| Property | Value |
|---|---|
| Text | `الآيات ١ — ٢٠` |
| Font | Cairo, 14px, weight 400 |
| Color | `#8A9AB8` (via `text-muted-foreground`) |
| Margin-bottom | 20px (`mb-5`) |

### 5d. Inner Divider

`width: 100%`, `height: 1px`, `background: rgba(196,154,60,0.12)`, `margin-bottom: 20px (mb-5)`

### 5e. Stats Row (3 columns, right→left reading order)

**Container:** `flex items-center gap-16px justify-end`

Each stat: `div.text-center` inside a `div.flex.items-center.gap-16px`

Dividers between stats: `width: 1px height: 24px`, `background: rgba(196,154,60,0.15)`

| Column (right→left) | Label text | Value text |
|---|---|---|
| 1 (rightmost) | `عدد الآيات` | `٢٠` |
| 2 (middle) | `الجزء` | `الأول` |
| 3 (leftmost) | `الحزب` | `١` |

**Label style:**
| Property | Value |
|---|---|
| Font | Cairo, 11px, weight 400 |
| Color | `#8A9AB8` (via `text-muted-foreground`) |

**Value style:**
| Property | Value |
|---|---|
| Font | Cairo, 15px, weight 600 (`font-semibold`) |
| Color | `#EDE7DC` (via `text-foreground`) |

---

## 6. CTA / Completion Area

**Container:** `margin-top: 24px (mt-6)`, `flex-1 flex flex-col justify-start`

`AnimatePresence mode="wait"` wraps both states.

---

### State A — Pending (ward not done)

`motion.div`, `opacity 0→1, y 12→0`, `exit: opacity 0, y -8`, `duration: 0.3s`

#### 6a-1. Primary CTA Button

| Property | Value |
|---|---|
| Text | `ابدأ المراجعة` |
| Width | `100% (w-full)` |
| Padding | `py-16px (py-4)` |
| `border-radius` | `24px (rounded-2xl)` |
| Background | `linear-gradient(135deg, #D4A843 0%, #C49A3C 50%, #B08830 100%)` |
| Color | `#0C1220` |
| Font | Cairo, 17px, weight 600 |
| `box-shadow` | `0 4px 20px rgba(196,154,60,0.30)` |
| `transition` | `all 200ms` |
| Tap / active | `scale(0.98)` via `active:scale-[0.98]` |

#### 6a-2. Hint text below button

| Property | Value |
|---|---|
| Text | `يُستحسن التسميع في وقت الصباح` |
| Font | Cairo, 13px, weight 400 |
| Color | `#8A9AB8` (via `text-muted-foreground`) |
| Alignment | `text-center` |
| Margin-top | `12px (mt-3)` |

---

### State B — Completed (ward done today)

`motion.div`, `opacity 0→1, y 12→0`, `exit: opacity 0, y -8`, `duration: 0.35s`, `flex flex-col items-center gap-12px pt-8px`

#### 6b-1. Completion Badge Circle

`motion.div`, spring animation: `scale 0→1`, `stiffness: 200 damping: 15 delay: 0.1s`

| Property | Value |
|---|---|
| Size | `56×56px (w-14 h-14)` |
| `border-radius` | `50% (rounded-full)` |
| Background | `rgba(196,154,60,0.12)` |
| Border | `1.5px solid rgba(196,154,60,0.35)` |
| Icon | Checkmark SVG `28×28px (w-7 h-7)`, path `M5 13l4 4L19 7`, `stroke: #C49A3C`, `strokeWidth: 2`, `strokeLinecap: round` |

#### 6b-2. Completion Message

| Property | Value |
|---|---|
| Text | `أتممت ورد اليوم` |
| Font | Amiri, 22px, weight 700, `line-height: 1.5` |
| Color | `#EDE7DC` (via `text-foreground`) |
| Alignment | `text-center` |

#### 6b-3. Sub-message

| Property | Value |
|---|---|
| Text | `بارك الله فيك 🤲` |
| Font | Cairo, 15px, weight 400 |
| Color | `#8A9AB8` (via `text-muted-foreground`) |
| Alignment | `text-center` |

---

## 7. Bottom Navigation Bar

Rendered below the screen content (`flex-shrink-0`), outside the `flex-1` screen area.

**Container:** `mx-16px mb-16px`, `border-radius: 16px (rounded-2xl)`, `flex-shrink-0`

| Property | Value |
|---|---|
| Background | `rgba(19,29,48,0.97)` |
| `backdrop-filter` | `blur(12px)` |
| Border | `1px solid rgba(196,154,60,0.1)` |

**Tabs row:** `flex items-center justify-around px-8px py-12px`

Each tab: `flex flex-col items-center gap-4px px-12px py-4px`, `transition-opacity`

Active tab: `opacity: 1` · Inactive tab: `opacity: 0.45`

| Tab (right→left) | Label | Icon description | Active icon fill |
|---|---|---|---|
| الرئيسية (active on Home) | `الرئيسية` | House with door cutout | `rgba(196,154,60,0.15)` |
| المحفوظات | `المحفوظات` | Open book + two lines | `rgba(196,154,60,0.08)` |
| الخطة | `الخطة` | Calendar grid | none |
| الإعدادات | `الإعدادات` | Circle + sun spokes | none |

**Tab label style:**
| State | Font | Size | Weight | Color |
|---|---|---|---|---|
| Active | Cairo | 10px | 600 | `#C49A3C` |
| Inactive | Cairo | 10px | 400 | `#8A9AB8` |

**All nav icons:** `viewBox="0 0 24 24"`, rendered `20×20px (w-5 h-5)`, `stroke-width: 1.5`
- Active stroke: `#C49A3C`
- Inactive stroke: `#8A9AB8`

**Home indicator bar** (below tabs, centered):
`width: 112px (w-28)`, `height: 3px`, `border-radius: 9999px`, `background: rgba(255,255,255,0.15)`, `padding-bottom: 4px (pb-1)`
