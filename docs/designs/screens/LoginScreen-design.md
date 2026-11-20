# Login Screen — Complete Design Specification

> Full-screen (no BottomNav). Rendered inside the 375×812 px phone frame. `direction: rtl`, base `font-family: 'Cairo', sans-serif`.

---

## Phone Frame (outer shell)

| Property | Value |
|---|---|
| Width × Height | 375 × 812 px |
| `border-radius` | 44px |
| Background | `#0C1220` (via `bg-background`) |
| `box-shadow` | `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,154,60,0.12)` |
| `direction` | `rtl` |
| Outer wrapper | `min-h-screen flex items-center justify-center p-16px bg-background` |

---

## Root Container

`position: relative`, `z-index: 10`, `flex flex-col flex-1 items-center`, `font-family: 'Cairo', sans-serif`

---

## Ambient Glow Overlays

Both `position: absolute inset-0 pointer-events-none`:

| Layer | Background |
|---|---|
| Top glow | `radial-gradient(ellipse 70% 45% at 50% 0%, rgba(196,154,60,0.09) 0%, transparent 70%)` |
| Bottom glow | `radial-gradient(ellipse 60% 30% at 50% 100%, rgba(196,154,60,0.05) 0%, transparent 60%)` |

---

## Logo Block

**Container:** `flex flex-col items-center`, `margin-top: 120px`

---

### 1. Geometric Ornament

`motion.div` — entrance: `opacity 0→1, scale 0.85→1`, `duration: 0.7s`, `ease: [0.16, 1, 0.3, 1]`

**Outer wrapper:** `width: 96px`, `height: 96px`, `position: relative`, `margin-bottom: 28px`

| Layer | Spec |
|---|---|
| Outer glow halo | `position: absolute`, `inset: -10px`, `border-radius: 50%`, `background: radial-gradient(circle, rgba(196,154,60,0.12) 0%, transparent 70%)`, `pointer-events: none` |
| Ring border | `position: absolute`, `inset: 0`, `border-radius: 50%`, `border: 1px solid rgba(196,154,60,0.22)` |
| Inner disc | `position: absolute`, `inset: 10px`, `border-radius: 50%`, `background: linear-gradient(145deg, rgba(196,154,60,0.18) 0%, rgba(196,154,60,0.06) 100%)`, `border: 1px solid rgba(196,154,60,0.3)` |
| SVG ornament | `viewBox="0 0 160 160"`, fills 96×96px container, `stroke: #C49A3C`, `strokeWidth: 0.7`, `fill: none` |

**SVG ornament layers (all centered at 80,80):**

| Shape | Points / dimensions | Opacity |
|---|---|---|
| Outer octagon | `0,-62 43.84,-43.84 62,0 43.84,43.84 0,62 -43.84,43.84 -62,0 -43.84,-43.84` | 0.18 |
| Rotated square | `-44,-44 88×88` rotated 45° | 0.14 |
| Straight square | `-44,-44 88×88` | 0.14 |
| Inner octagon | `0,-32 22.63,-22.63 32,0 …` | 0.22 |
| 8 radial spokes | from radius 32 to radius 62, at 0°/45°/90°/135°/180°/225°/270°/315° | 0.12, `strokeWidth: 0.5` |
| Centre diamond | `-14,-14 28×28` rotated 45° | 0.28 |

---

### 2. App Name

`motion.h1` — entrance: `opacity 0→1, y 12→0`, `delay: 0.15s`, `duration: 0.55s`, `ease: [0.16, 1, 0.3, 1]`

| Property | Value |
|---|---|
| Text | `حافظ` |
| Font | Amiri, 42px, weight 700 |
| `line-height` | 1 |
| `letter-spacing` | 0.01em |
| Color | `#EDE7DC` |
| `text-align` | center |
| `margin-bottom` | 6px |

---

### 3. Gold Underline Accent

`motion.div` — entrance: `scaleX 0→1, opacity 0→1`, `delay: 0.3s`, `duration: 0.5s`, `ease: [0.16, 1, 0.3, 1]`

| Property | Value |
|---|---|
| Width | 40px |
| Height | 2px |
| `border-radius` | 9999px |
| Background | `linear-gradient(90deg, transparent, #C49A3C, transparent)` |
| `margin-bottom` | 24px |

---

### 4. Basmala SVG

`motion.div` — entrance: `opacity 0→1`, `delay: 0.25s`, `duration: 0.6s`

`margin-bottom: 20px`

`<BasmalaSvg color="#C49A3C" />` — inline SVG path calligraphy, `width: 200px height: 41px`, `viewBox="0 0 176 36"`, fill `currentColor` = `#C49A3C`

---

### 5. Tagline

`motion.p` — entrance: `opacity 0→1, y 8→0`, `delay: 0.35s`, `duration: 0.5s`, `ease: [0.16, 1, 0.3, 1]`

| Property | Value |
|---|---|
| Text | `رافقك في رحلة حفظ القرآن ومراجعته يوماً بيوم` |
| Font | Cairo, 15px, weight 400 |
| Color | `#8A9AB8` |
| `text-align` | center |
| `line-height` | 1.7 |
| `max-width` | 260px |

---

## CTA Block

`position: absolute`, `bottom: 0 left: 0 right: 0`, `padding: 0 28px 64px`, `flex flex-col items-center gap-16px`

---

### 6. Divider Row

`motion.div` — entrance: `opacity 0→1`, `delay: 0.5s`, `duration: 0.5s`

`display: flex`, `align-items: center`, `gap: 12px`, `width: 100%`

| Element | Spec |
|---|---|
| Left line | `flex: 1`, `height: 1px`, `background: linear-gradient(to right, transparent, rgba(196,154,60,0.18))` |
| Centre label text | `ابدأ رحلتك` |
| Centre label font | Cairo, 11px, weight 400 |
| Centre label color | `rgba(138,154,184,0.75)` |
| Centre label `letter-spacing` | 0.06em |
| Centre label `white-space` | nowrap |
| Right line | `flex: 1`, `height: 1px`, `background: linear-gradient(to left, transparent, rgba(196,154,60,0.18))` |

---

### 7. Google Sign-In Button

`motion.button` — entrance: `opacity 0→1, y 16→0`, `delay: 0.6s`, `duration: 0.55s`, `ease: [0.16, 1, 0.3, 1]`  
Tap interaction: `whileTap scale 0.97`

| Property | Value |
|---|---|
| Width | `100%` |
| `display` | `flex` |
| `align-items` | center |
| `justify-content` | center |
| `gap` | 12px |
| `padding` | 15px 24px |
| `border-radius` | 16px |
| Background | `#FFFFFF` |
| Border | none |
| `direction` | `ltr` |
| `box-shadow` | `0 2px 12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)` |
| Cursor | pointer |

**Google logo SVG** — `20×20px`, `viewBox="0 0 24 24"`, 4 path segments:

| Segment | Fill |
|---|---|
| Top-right (G top) | `#4285F4` |
| Bottom (G bottom) | `#34A853` |
| Left (G left) | `#FBBC05` |
| Top-left (G start) | `#EA4335` |

**Button label:**

| Property | Value |
|---|---|
| Text | `تسجيل الدخول بحساب Google` |
| Font | Cairo, 15px, weight 600 |
| Color | `#1A1A1A` |
| `letter-spacing` | 0.01em |

---

### 8. Legal Note

`motion.p` — entrance: `opacity 0→1`, `delay: 0.75s`, `duration: 0.4s`

| Property | Value |
|---|---|
| Text | `بالمتابعة فإنك توافق على شروط الاستخدام وسياسة الخصوصية` |
| Font | Cairo, 11px, weight 400 |
| Color | `rgba(138,154,184,0.75)` |
| `text-align` | center |
| `line-height` | 1.6 |

---

## Interaction

Tapping the Google Sign-In button calls `setScreen("home")` — navigates to Home screen.
