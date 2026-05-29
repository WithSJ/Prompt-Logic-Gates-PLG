---
category: documentation
updated: 2026-05-29
tags: [plg, ui, interface, panels, controls]
---

# UI Reference

This document covers every visible element of the PLG interface — the top bar, left palette, center canvas, right inspector, settings modal, and toast notifications.

---

## Layout Overview

The IDE uses a CSS Grid layout with two rows and three columns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Top Bar (54px)                         │
│  [Logo] PLG · Prompt Logic Gates    [Mode] [AI] [New]      │
│  Semantic Prompt Compiler           [Save] [Load] [Compile] │
├──────────┬──────────────────────────┬───────────────────────┤
│  Left    │                         │  Right Inspector      │
│  Palette │   Center Canvas         │  (340px)              │
│  (240px) │   (React Flow)          │                       │
│          │                         │  Pipeline Debugger    │
│  Nodes   │   Nodes + Edges         │  Breakdown Table      │
│  Legend  │   Background Grid       │  Export / Clear       │
└──────────┴──────────────────────────┴───────────────────────┘
```

---

## 1. Top Bar

The top bar contains branding, status, and action buttons.

### Elements (left to right):

| Element | Description |
| :--- | :--- |
| **Logo** | SVG circuit icon with cyan glow, radial gradient background |
| **Brand Text** | "PLG · Prompt Logic Gates" + "Semantic Prompt Compiler" subtitle |
| **Mode Pill** | Shows current compiler mode: "Rule-based" or the AI provider name |
| **AI Models** button | Opens the Settings Modal to configure API keys |
| **New** button | Creates a fresh project with the default seed template (with confirmation) |
| **Save** button | Downloads the current graph as `plg-graph.json` |
| **Load** button | Opens a file picker to load a saved `.json` graph |
| **Compile** button | Runs the semantic compiler. Shows "Thinking..." spinner during AI calls |

### Button Styles
- Standard buttons: Dark panel background with border, subtle hover glow
- **Compile** button: Blue gradient (`#1d4ed8` → `#1e40af`) with white text and blue box-shadow
- Disabled state: 55% opacity with `cursor: wait`

---

## 2. Left Palette

The left panel contains draggable node components organized by category.

### Categories

| Section Header | Nodes |
| :--- | :--- |
| **Sources** | File Node, Prompt Box, Prompt Concat, File Viewer, File to Prompt, Prompt to File |
| **Logic Gates** | AND Gate, OR Gate, NOT Gate |
| **Human-in-the-Loop** | Ask AI Questions, Provide Answers |

### Node Cards
Each palette entry is a draggable card with:
- A **colored left accent bar** (4px, matching the node's accent color)
- An **icon badge** (32×32px rounded square with the node's symbol)
- **Title** text (bold, 13px)
- **Description** text (10.5px, truncated with ellipsis)

### Adding Nodes
Two methods:
1. **Drag and drop**: Drag the card from the palette onto the canvas. The node appears where you drop it.
2. **Click**: Click the card. The node appears at a randomized position near (100, 150).

### Pin Legend
Below the node cards, a "Pin Connections" legend shows:
- 🟡 Amber dot = File Reference
- 🔵 Cyan dot = Prompt Content
- Instructions: "Drag edge from an **output** pin to a matching **input** pin."

---

## 3. Center Canvas

The main workspace built on **React Flow** ([PLGCanvas.jsx](file:///c:/Users/jadam/Desktop/PLG/src/components/PLGCanvas.jsx)).

### Background
- Dark base color (`#0a0e12`) with subtle dot grid pattern (24px gap, 1px dots)
- Dot color: `var(--line2)` (muted blue-grey)

### Controls
React Flow's built-in controls panel appears in the bottom-left:
- Zoom in / Zoom out
- Fit view
- Style: Dark panel background with rounded corners and deep shadow

### Interactions

| Action | Input |
| :--- | :--- |
| **Pan** | Click and drag the background |
| **Zoom** | Mouse scroll wheel |
| **Select node** | Click a node |
| **Move node** | Drag a node |
| **Connect** | Drag from an output handle to an input handle |
| **Delete** | Select a node or edge, press `Delete` or `Backspace` |
| **Multi-select** | Not implemented (single selection only) |

### Connection Validation
The canvas enforces strict connection rules:
- Source and target cannot be the same node
- Handle types must match (file↔file, prompt↔prompt, questions↔questions)
- Each target handle accepts only one incoming edge

### Edge Colors
Edges are automatically colored based on the source handle type:
- File edges: Amber (`var(--file)`)
- Prompt edges: Cyan (`var(--prompt)`)
- Questions edges: Orange (`#fb923c`)

All edges use `MarkerType.ArrowClosed` at the target end.

### Keyboard Shortcuts Hint
A floating hint box in the bottom-right corner shows:
- `drag handle` connect
- `drag bg` pan
- `scroll` zoom
- `Del / Backspace` delete selected

---

## 4. Right Inspector

The compilation output panel ([Inspector.jsx](file:///c:/Users/jadam/Desktop/PLG/src/components/Inspector.jsx)).

### Header
Shows the current file title (from the File Node's filename field) + a "Read-Only" badge.

### Compilation Depth Selector
Rendered directly below the header as a premium glassmorphic segment block, this control allows configuring the thought depth of the final compiled positive prompt:
- **Normal** (with `Zap` icon, Cyan active accent): Standard raw category-prioritized comma-separated listing.
- **Thinking** (with `Brain` icon, Violet active accent): Beautifully polished, rich natural-language rephrasings.
- **Deep** (with `Cpu` icon, Amber active accent): Exhaustive technical visual specification document structured in Markdown.

The selected depth mode is saved automatically to LocalStorage and triggers real-time toast notification feedback upon adjustment.

### Before Compilation
An empty state with a sparkle icon and the message: "Wire up a graph on the canvas and hit **Compile** to assemble your optimized prompt."

### After Compilation

The inspector shows 4 sections:

#### Section 1: Positive Prompt
- Green left border
- Monospace font, pre-wrapped
- **Copy** button (shows "copied" for 1.5 seconds)

#### Section 2: Negative Prompt
- Red left border
- Same styling as positive
- **Copy** button

#### Section 3: Visual Compiler Pipeline
An expandable accordion of compilation stages. Each stage shows:
- **Stage number** (monospace)
- **Node label** (e.g., "Node 2: AND Gate (abc123)")
- **Status badge**: `ok` (green), `ai` (purple), `info` (cyan), or `error` (red)
- **Expandable content**: Multi-line trace description showing what the gate did

The first stage is expanded by default. Click any stage header to toggle.

#### Section 4: Compilation Breakdown
A table showing every prompt term with:
- **Term text** (monospace, struck through if dropped)
- **Category badge** (colored by category: Subject=red, Environment=amber, Style=violet, etc.)
- **Priority number** (right-aligned)
- **Kept/Total counter** in the section header (e.g., "4/5 kept")

### Footer
- **Export .txt** button: Downloads compiled prompts as a text file
- **Clear All** button (red border): Clears the entire canvas (keeps the File Viewer)

---

## 5. Settings Modal

The AI configuration dialog ([SettingsModal.jsx](file:///c:/Users/jadam/Desktop/PLG/src/components/SettingsModal.jsx)).

### Opening
Click **AI Models** in the top bar. The modal appears centered with a blurred backdrop overlay.

### Compiler Mode Toggle
Two segmented buttons:
- **Rule-based (offline)**: Uses keyword dictionaries and conflict matrices. No API key needed.
- **AI-assisted**: Sends prompts to your chosen AI provider for intelligent compilation.

### Provider Selection
Four segmented buttons with colored dots:
- 🟤 **Claude** (Anthropic) — Default model: `claude-3-5-sonnet-latest`
- 🟢 **ChatGPT** (OpenAI) — Default model: `gpt-4o-mini`
- 🔵 **Gemini** (Google) — Default model: `gemini-1.5-flash`
- 🟣 **OpenRouter** — Default model: `openai/gpt-4o-mini`

### Configuration Fields
- **API Key**: Password input with eye toggle to show/hide. Placeholder shows the expected key format.
- **Help link**: Links to the provider's API key management page.
- **Model Version**: Text input to override the default model.

### Test Connection
A button that sends a simple "Reply with OK" message to the selected provider. Shows:
- ⏳ Loading state: "Pinging Claude..."
- ✅ Success: "Connected! Response: OK"
- ❌ Error: Shows the error message

### Saving
Click **Save & Close** to persist settings to LocalStorage. Settings are restored on next visit.

---

## 6. Toast Notifications

Floating notification bars that appear at the bottom center of the screen.

### Types

| Type | Left Border Color | When Used |
| :--- | :--- | :--- |
| `ok` | Green | Successful compilation, settings saved, graph loaded |
| `err` | Red | Compilation errors, invalid files, connection failures |
| `info` | Cyan | Canvas cleared, project restored, informational messages |

### Animation
- Slides up from 80px below with a cubic-bezier spring animation
- Fades in over 280ms
- Auto-dismisses after 2.6 seconds
- Has a deep box-shadow for floating effect
