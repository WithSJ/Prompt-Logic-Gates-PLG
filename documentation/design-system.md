---
category: documentation
updated: 2026-05-29
tags: [plg, css, design, tokens, colors, typography]
---

# Design System

This document covers the complete visual design system defined in [index.css](file:///c:/Users/jadam/Desktop/PLG/src/index.css) — all CSS custom properties, color tokens, typography, component styles, and animations.

---

## 1. Color Tokens

All colors are defined as CSS custom properties on `:root`.

### Background & Surface Colors

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `--bg` | `#0a0e12` | Page background, input backgrounds |
| `--bg2` | `#0e141a` | Secondary background (legend, stage headers) |
| `--panel` | `#11181f` | Side panel backgrounds (palette, inspector) |
| `--panel2` | `#161f28` | Top bar gradient, button backgrounds |
| `--node` | `#19232e` | Node body background |
| `--node-head` | `#1f2c39` | Node header background, hover states |
| `--line` | `#2a3a47` | Borders, dividers |
| `--line2` | `#34495a` | Stronger borders, grid dots |

### Text Colors

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `--txt` | `#dbe6ef` | Primary text |
| `--txt-dim` | `#8499a9` | Secondary text, descriptions |
| `--txt-faint` | `#5c6f7e` | Tertiary text, placeholders, labels |

### Accent Colors

| Token | Hex Value | Name | Usage |
| :--- | :--- | :--- | :--- |
| `--file` | `#f2b134` | Amber | File handles, file-related UI |
| `--prompt` | `#22d3ee` | Cyan | Prompt handles, brand accent |
| `--memory` | `#c084fc` | Fuchsia-Purple | Context Memory handle, Memory node, upload accents |
| `--and` | `#3b82f6` | Blue | AND gate accent |
| `--or` | `#a855f7` | Violet | OR gate accent, AI status badges |
| `--not` | `#ef4444` | Red | NOT gate accent, explicit negations |
| `--ok` | `#34d399` | Green | Success states, positive prompts |
| `--warn` | `#fbbf24` | Amber | Warning states |
| `--err` | `#f87171` | Red | Error states, danger buttons |

### Questions Handle Color
- `#fb923c` (warm orange) — Used for the questions handle and Ask/Answer node accents. Not defined as a CSS variable; used directly in components.

---

## 2. Typography

### Font Stacks

| Token | Fonts | Usage |
| :--- | :--- | :--- |
| `--sans` | `'Inter', 'IBM Plex Sans', system-ui, sans-serif` | All UI text, buttons, labels |
| `--mono` | `'Fira Code', 'IBM Plex Mono', ui-monospace, monospace` | Code text, prompt output, pipeline traces |

### Font Sizes Used

| Context | Size | Weight |
| :--- | :--- | :--- |
| Brand name | 15px | 700 |
| Section headers | 10–11px uppercase | 600 |
| Button text | 13px | 500 |
| Node titles | 12.5px | 600 |
| Node body text | 11–12px | 400 |
| Pipeline trace | 11.5px | 400 (mono) |
| Prompt output | 12px | 400 (mono) |
| Labels / hints | 10–10.5px | 500–600 |

### Font Loading
Fonts are loaded via Google Fonts in [index.html](file:///c:/Users/jadam/Desktop/PLG/index.html) with `display=swap` for fast initial render:
- Inter: weights 400, 500, 600, 700, 800
- IBM Plex Sans: weights 400, 500, 600, 700
- Fira Code: weights 400, 500, 600
- IBM Plex Mono: weights 400, 500, 600

---

## 3. Layout Grid

### Top-Level Grid
```css
.app {
  display: grid;
  grid-template-rows: 54px 1fr;  /* Topbar + workspace */
  height: 100vh;
}
```

### Workspace Grid
```css
.main {
  display: grid;
  grid-template-columns: 240px 1fr 340px;  /* Palette | Canvas | Inspector */
}
```

---

## 4. Component Styles

### Nodes (`.rf-node`)
- Width: `220px` (except File Viewer and Context Memory at `280px`, Prompt Concat at `200px`, Answer Questions at `320px`, Ask Questions at `260px`)
- Background: `var(--node)` → `#19232e`
- Border: `1px solid var(--line2)`
- Border radius: `var(--radius)` → `12px`
- Box shadow: `0 8px 24px -10px rgba(0,0,0,0.7)`
- Selected state: `box-shadow: 0 0 0 2px var(--accent), 0 12px 30px -8px rgba(0,0,0,0.8)`

### Node Headers (`.rf-node-header`)
- Height: `38px`
- Background: Linear gradient from `var(--node-head)` to a darker mix
- Left accent bar: 4px wide stripe in the node's accent color (Amber, Cyan, Blue, Violet, Red, Orange, or Fuchsia-Purple)
- Contains: Status dot (8px circle with glow), icon, title text, delete button

### Handles (`.react-flow__handle`)
- Size: `12px × 12px` (with `!important` override)
- Border: `2.5px solid var(--bg)`
- Hover: `scale(1.35)` + brightness increase
- Valid connection state: Green outer glow ring
- Pin colorings: Gold (`.file`), Cyan (`.prompt`), Orange (`.questions`), or Fuchsia (`.memory`)

### Memory Bank Components
- **Upload Zone (`.memory-upload-zone`)**: 1.5px dashed border (`var(--line2)`), transitions to `--memory` on hover, flexible flex-col layout.
- **File List (`.memory-file-list`)**: Max height 120px with y-scrollbar, listing active buffers.
- **File Items (`.memory-file-item`)**: Sleek dark items (`var(--bg2)`) containing filenames, monospace sizes, and red hover delete buttons (`var(--err)`).
- **Build Button (`.memory-btn`)**: Linear gradient background (`#9333ea` to `#7e22ce`), bright fuchsia border, glowing shadow.
- **Section Titles (`.memory-section-title`)**: 10px uppercase, letter-spacing 0.8px, `--memory` accent color.

### Palette Cards (`.pnode`)
- Rounded corners (9px)
- Left accent bar (4px)
- Icon badge: 32px square with 16% accent background tint
- Hover: Slides 2px right with border color change and shadow
- Cursor: grab → grabbing on active

### Buttons (`.tbtn`)
- Height: `36px`
- Padding: `0 14px`
- Border radius: `8px`
- Background: `var(--panel2)` with `1px solid var(--line)` border
- Hover: Background darkens, text brightens
- **Primary variant**: Blue gradient (`#1d4ed8` → `#1e40af`) with white text
- **Danger variant**: Red border + red text with red tint hover background

### Toast Notifications (`.toast`)
- Fixed position, centered at bottom
- Entrance: Spring animation sliding up from 80px
- Left border colored by type: green/red/cyan
- Auto-dismiss: 2.6 seconds
- Deep floating shadow

---

## 5. Animations

### Spinner (`.spin`)
```css
@keyframes sp {
  to { transform: rotate(360deg); }
}
.spin {
  width: 14px;
  height: 14px;
  border: 2px solid var(--line2);
  border-top-color: var(--prompt);
  border-radius: 50%;
  animation: sp 0.7s linear infinite;
}
```

### Toast Entrance
```css
.toast {
  transform: translateX(-50%) translateY(80px);
  opacity: 0;
  transition: all 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}
```

### General Transitions
- Buttons: `all 0.15s ease-in-out`
- Handles: `transform 0.12s, filter 0.12s`
- Palette cards: `all 0.13s ease`
- Delete buttons: `all 0.12s`
- Input focus: `border-color 0.15s`
- Node selection: `box-shadow 0.15s ease-in-out`

---

## 6. Scrollbar Styling

Custom webkit scrollbars throughout:
```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--line);       /* #2a3a47 */
  border-radius: 6px;
  border: 2px solid var(--panel); /* Creates inset effect */
}
::-webkit-scrollbar-thumb:hover {
  background: var(--line2);      /* #34495a */
}
```

---

## 7. CSS Techniques Used

| Technique | Where Used |
| :--- | :--- |
| `color-mix(in srgb, ...)` | Category badges, handle glow rings, status backgrounds |
| `backdrop-filter: blur()` | Modal backdrop (6px), canvas hint overlay (4px) |
| `linear-gradient()` | Top bar, node headers, compile button |
| `radial-gradient()` | Logo background, canvas dot grid |
| CSS Grid | App layout, icon badges |
| CSS Custom Properties | All colors, fonts, radius values |
| `!important` overrides | React Flow handle sizes (necessary to override library defaults) |

---

## 8. Modal Styling

### Backdrop (`.modal-bg`)
- Full viewport coverage with `inset: 0`
- Semi-transparent dark overlay: `rgba(4, 7, 10, 0.72)`
- Backdrop blur: `6px`
- Z-index: `100`

### Modal Container (`.modal`)
- Width: `560px`, max-height: `88vh`
- Background: `var(--panel)` with `var(--line2)` border
- Border radius: `16px`
- Deep floating shadow: `0 30px 80px -20px rgba(0,0,0,0.8)`

### Status Indicators (`.modal-status`)
- Success: Green tinted background with green text
- Error: Red tinted background with red text
- Loading: Neutral background with spinner
