---
category: documentation
updated: 2026-05-29
tags: [plg, readme, overview, getting-started]
---

# Prompt Logic Gates (PLG) — Complete Project Documentation

## Table of Contents

- [README](README.md) ← You are here
- [Getting Started](getting-started.md) — Installation, setup, and first run
- [How It Works](how-it-works.md) — Architecture, data flow, and compilation pipeline
- [Nodes Guide](nodes-guide.md) — Every node explained with usage examples
- [Compiler Engine](compiler-engine.md) — Semantic categories, conflict matrix, AI prompts
- [UI Reference](ui-reference.md) — Topbar, palette, canvas, inspector, settings modal
- [Workflows & Tutorials](workflows-and-tutorials.md) — Step-by-step circuit building guides
- [API & AI Integration](api-and-ai-integration.md) — Multi-provider LLM configuration
- [Project Structure](project-structure.md) — File tree and code architecture
- [Design System](design-system.md) — CSS tokens, colors, typography, and component styling

---

## What is Prompt Logic Gates?

**Prompt Logic Gates (PLG)** is a **visual programming IDE** for building AI prompts using logical circuits. Instead of writing prompts as monolithic text blocks, you construct them by wiring together visual nodes — just like designing a digital logic circuit.

Think of it as **Unreal Engine Blueprints**, but for prompt engineering.

### The Core Insight

Traditional prompt writing is fragile:
- You write one long string and hope it works
- Adding a new style modifier can break the tone
- You can't tell which part of the prompt caused a bad output
- There's no compile-time error checking for contradictory instructions

PLG solves this by treating prompts as **compilable programs**:

```
┌──────────────┐     ┌──────────────┐
│  Prompt Box  │────▶│              │     ┌──────────────┐
│ "abandoned   │  A  │   AND Gate   │────▶│ File Viewer  │
│  hospital"   │     │  merge & rank│     │ (final output│
│              │     │              │     │  monitor)    │
└──────────────┘     │              │     └──────────────┘
                     │              │
┌──────────────┐     │              │
│  Prompt Box  │────▶│              │
│ "PS1 graphics│  B  │              │
│  style"      │     └──────────────┘
└──────────────┘
```

Each node carries a specific prompt fragment. Gates merge, select, or suppress those fragments. The compiler walks the graph in topological order and produces a final, optimized prompt string — with conflicts automatically resolved.

### Key Features

| Feature | Description |
| :--- | :--- |
| **Visual Node Editor** | Drag-and-drop nodes onto an infinite canvas, wire them together |
| **12 Node Types** | File nodes, prompt boxes, gates, Context Memory, type converters, Q&A nodes |
| **Dual Compilation Modes** | Offline rule-based engine OR live AI-assisted compilation |
| **4 AI Providers** | Anthropic Claude, OpenAI ChatGPT, Google Gemini, OpenRouter |
| **Context Memory Ledger** | Client-side indexing catalog syncing exact case-sensitive variable definitions |
| **Semantic Conflict Detection** | Auto-detects contradictions like "realistic" + "cartoon" |
| **Category Priority Sorting** | Subjects rank above styles, styles above effects |
| **Interactive Q&A Refinement** | AI asks clarifying questions; your answers refine the prompt |
| **Visual Pipeline Debugger** | Step-by-step compilation trace in the right panel |
| **Save/Load Circuits** | Export/import graph configurations as JSON files |
| **Export Compiled Prompt** | Download final Compiled Prompt in plain text `.txt` |
| **Auto-Save** | Workspace persists to LocalStorage automatically |

### Who Is This For?

- **AI Artists** using Stable Diffusion, Midjourney, DALL-E, or Flux who want systematic prompt control
- **Prompt Engineers** building complex, multi-layered instruction sets
- **Developers** experimenting with visual programming paradigms for LLM workflows
- **Anyone** who wants to understand how their prompt is structured before sending it to an AI

---

## Quick Start

```bash
# 1. Clone or download the project
cd PLG

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in your browser
# → http://localhost:5173
```

The IDE loads with a default seed template showing an AND gate merging two prompt fragments and a NOT gate suppressing a concept. Click **Compile** to see the result in the right panel.

For the full setup guide, see [Getting Started](getting-started.md).
