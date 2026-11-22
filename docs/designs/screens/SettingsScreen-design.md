# Settings Screen — Complete Design Specification

> Tab screen (BottomNav present). `direction: rtl`. Background `#0C1220`. Contains: Header, scrollable body with 4 SettingsCard sections + sign-out. Notification toggle reveals an animated time-picker row.

---

## Root Container

`flex flex-col h-full`, `background: #0C1220`, `direction: rtl`

---

## 1. Header

`padding: 52px 20px 10px`, `flex-shrink: 0`  
`border-bottom: 1px solid rgba(196,154,60,0.07)`

### Screen Title

| Property | Value |
|---|---|
| Text | `الإعدادات` |
| Font | Cairo, 21px, weight 700 |
| Color | `#EDE7DC` |

---

## 2. Scrollable Body

`flex-1 overflow-y-auto`, `padding: 0 16px 48px`

---

## SettingsCard — Shared Component

`background: rgba(19,29,48,0.85)`, `border-radius: 14px`, `border: 1px solid rgba(196,154,60,0.1)`, `overflow: hidden`

**SettingsRowDivider** (between rows inside a card):  
`height: 1px`, `background: rgba(196,154,60,0.08)`, `margin: 0 16px`

**SettingsSectionLabel** (above each card group):  
`font: Cairo 11px weight 700`, `color: rgba(138,154,184,0.55)`, `letter-spacing: 0.07em`  
`padding: 22px 4px 8px`, `direction: rtl`

**SettingsRow** (each row inside a card):  
`display: flex, align-items: center, justify-content: space-between`  
`padding: 14px 16px`, `width: 100%`, `direction: rtl`, `gap: 12px`

Row label: Cairo, 15px, weight 500, color `#EDE7DC` (or `#E05A5A` if destructive)  
Row sublabel (optional): Cairo, 12px, `rgba(138,154,184,0.6)`

---

## Section 1 — User Card

`margin-top: 18px, margin-bottom: 4px`

Contains one SettingsCard with a single tappable row.

**User row:** `display: flex, align-items: center, gap: 14px, padding: 16px, width: 100%, direction: rtl`

### Avatar
| Property | Value |
|---|---|
| Size | `46×46px` |
| `border-radius` | 50% |
| Background | `linear-gradient(135deg, rgba(196,154,60,0.25), rgba(196,154,60,0.08))` |
| Border | `1.5px solid rgba(196,154,60,0.3)` |
| `flex-shrink` | 0 |

**Initial inside avatar:**
| Property | Value |
|---|---|
| Text | `أ` |
| Font | Cairo, 18px, weight 700 |
| Color | `#C49A3C` |

### User Name + Sublabel (flex-1, text-right)

**Name:**
| Property | Value |
|---|---|
| Text | `أحمد` |
| Font | Cairo, 16px, weight 700 |
| Color | `#EDE7DC` |
| Margin | 0 |

**Sublabel:**
| Property | Value |
|---|---|
| Text | `تعديل الملف الشخصي` |
| Font | Cairo, 12px, weight 400 |
| Color | `rgba(138,154,184,0.6)` |
| Margin | 0 |

### Trailing Chevron (ChevronLeft)
`14×14px`, `viewBox="0 0 16 16"`, path `M10 4L6 8l4 4`, `stroke: #8A9AB8`, `strokeWidth: 1.5`, `strokeLinecap: round`

---

## Section 2 — التخصيص

**SettingsSectionLabel:** `التخصيص`

Contains one SettingsCard with one row.

**Row label:** `الثيم` — Cairo, 15px, weight 500, color `#EDE7DC`

**Segmented Control** (theme toggle):

Outer container: `display: flex, background: rgba(8,14,24,0.8), border-radius: 9px, padding: 3px, gap: 2px`  
`border: 1px solid rgba(196,154,60,0.12)`

Two segments: `الوضع الداكن` and `الوضع الفاتح`

Each segment: `padding: 5px 11px, border-radius: 7px`, `font: Cairo 12px`, `transition: all 0.18s`

| State | Background | Border | Color | Weight |
|---|---|---|---|---|
| Active | `rgba(196,154,60,0.18)` | `1px solid rgba(196,154,60,0.32)` | `#C49A3C` | 600 |
| Inactive | `transparent` | `1px solid transparent` | `#8A9AB8` | 400 |

Default active: `الوضع الداكن` (dark)

---

## Section 3 — التنبيهات

**SettingsSectionLabel:** `التنبيهات`

Contains one SettingsCard with 1–2 rows.

### Row 1 — تنبيه المراجعة اليومية

**Row label:** `تنبيه المراجعة اليومية` — Cairo, 15px, weight 500, color `#EDE7DC`

**SettingsToggle:**

Outer: `width: 46px, height: 27px, border-radius: 14px, padding: 3px, transition: all 0.22s`

| State | Background | Border | Thumb position |
|---|---|---|---|
| Off | `rgba(42,61,92,0.9)` | `1px solid rgba(138,154,184,0.18)` | `justify-content: flex-start` |
| On | `linear-gradient(135deg, #C49A3C, #A07A28)` | `1px solid rgba(196,154,60,0.45)` | `justify-content: flex-end` |

Thumb: `21×21px`, `border-radius: 50%`, `background: #EDE7DC`, `box-shadow: 0 1px 4px rgba(0,0,0,0.3)`, `transition: all 0.22s`

Default state: **Off**

### Row 2 — وقت التنبيه (animated, visible only when toggle is On)

`AnimatePresence` — `motion.div key="time-row"`: `height 0→auto, opacity 0→1`, `duration: 0.24s`

`SettingsRowDivider` above this row.

Row container: `padding: 13px 16px, display: flex, align-items: center, justify-content: space-between, direction: rtl`

**Row label:**
| Property | Value |
|---|---|
| Text | `وقت التنبيه` |
| Font | Cairo, 14px, weight 400 |
| Color | `rgba(237,231,220,0.55)` |

**Time Pill** (`position: relative`):

Pill container: `display: inline-flex, align-items: center, gap: 6px, padding: 7px 12px`  
`background: rgba(196,154,60,0.1)`, `border: 1px solid rgba(196,154,60,0.28)`, `border-radius: 10px`

| Element | Spec |
|---|---|
| Clock icon | `13×13px`, `viewBox="0 0 16 16"` — circle `r=6.5` + hour/minute hands, `stroke: #C49A3C`, `strokeWidth: 1.2` |
| Time label | Dynamic value e.g. `07:00` |
| Time label font | Cairo, 15px, weight 700, color `#C49A3C`, `direction: ltr`, `user-select: none` |
| Hidden input | `type="time"`, `position: absolute inset-0`, `opacity: 0`, `cursor: pointer` — triggers native time picker on tap |

Default value: `07:00`

---

## Section 4 — التطبيق

**SettingsSectionLabel:** `التطبيق`

Contains one SettingsCard with 3 rows separated by SettingsRowDividers.

### Row 1 — تقييم التطبيق

**Label:** `تقييم التطبيق` — Cairo, 15px, weight 500, `#EDE7DC`  
**Trailing icon:** ExternalLink SVG `14×14px`, `stroke: #8A9AB8`, `strokeWidth: 1.4`  
(Path: `M9 2h5v5M14 2l-7 7M6 4H3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3`)

`SettingsRowDivider`

### Row 2 — تواصل معنا

**Label:** `تواصل معنا` — Cairo, 15px, weight 500, `#EDE7DC`  
**Trailing icon:** ExternalLink SVG (same as above)

`SettingsRowDivider`

### Row 3 — نسخة التطبيق

**Label:** `نسخة التطبيق` — Cairo, 15px, weight 500, `#EDE7DC`  
**Trailing value:**
| Property | Value |
|---|---|
| Text | `1.0.0` |
| Font | Cairo, 13px, weight 400 |
| Color | `rgba(138,154,184,0.5)` |

---

## Section 5 — تسجيل الخروج

`margin-top: 28px`

Contains one SettingsCard with a single destructive row.

**Row label:** `تسجيل الخروج` — Cairo, 15px, weight 500, color `#E05A5A`

**Trailing icon** (Sign-out): `15×15px`, `viewBox="0 0 16 16"`, two paths, `stroke: #E05A5A`, `strokeWidth: 1.3`, `strokeLinecap: round`
- Path 1: `M10.5 2H13a1 1 0 011 1v10a1 1 0 01-1 1h-2.5`
- Path 2: `M7 11l3.5-3L7 5M10.5 8H3`

---

## Bottom Navigation Bar

See `HomeScreen-design.md §7`. Active tab on this screen: **الإعدادات**.
