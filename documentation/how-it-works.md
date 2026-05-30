---
category: documentation
updated: 2026-05-29
tags: [plg, architecture, data-flow, compilation]
---

# How It Works

This document explains the complete architecture of PLG — from the visual canvas to the compilation engine to the final prompt output.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PLG IDE (Browser)                        │
│                                                                 │
│  ┌──────────┐   ┌────────────────────┐   ┌───────────────────┐ │
│  │  Left     │   │  Center Canvas     │   │  Right Inspector  │ │
│  │  Palette  │   │  (React Flow)      │   │  (Pipeline Debug) │ │
│  │           │   │                    │   │                   │ │
│  │  Drag     │──▶│  Nodes + Edges     │──▶│  Compiled Output  │ │
│  │  Nodes    │   │  Visual Wiring     │   │  Stage Traces     │ │
│  │  Here     │   │                    │   │  Breakdown Table  │ │
│  └──────────┘   └─────────┬──────────┘   └───────────────────┘ │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  Semantic   │                              │
│                    │  Compiler   │                              │
│                    │  Engine     │                              │
│                    └──────┬──────┘                              │
│                           │                                     │
│               ┌───────────┼───────────┐                        │
│               ▼           ▼           ▼                        │
│          Rule-Based    AI API     Conflict                     │
│          Sorting       Calls      Detection                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Three Data Types

Everything in PLG flows through three strictly typed channels:

### 1. File Baseline Stream (Amber/Gold handles)
The primary data pipeline. Carries the evolving string variable `positive` representing the compiled prompt baseline, which naturally embeds any explicit negation directives.

File streams flow left-to-right through the graph. Each gate reads the incoming baseline, modifies it, and emits the updated version.

### 2. Prompt Text Fragment (Cyan handles)
A raw string — a single prompt fragment like `"cinematic lighting, film grain"`. Prompt boxes output these. Gates like AND, OR, NOT, and Provide Answers consume them as inputs alongside the file baseline.

### 3. Questions Array (Orange handles)
An array of strings representing clarifying questions. Only used by the Ask AI Questions and Provide Answers nodes.

### 4. Context Memory Ledger (Purple handles)
A client-side visual indexing catalog mapping variable definitions, case-sensitive technical signatures, key terms, and visual entity hints. Used to align compiled prompt nomenclature with codebase invariants.

### Connection Rules
- **File ↔ File only**: You cannot connect a file handle to a prompt handle
- **Prompt ↔ Prompt only**: Prompt outputs connect to prompt inputs (`a`, `b`, `p0`, `p1`, etc.)
- **Questions ↔ Questions only**: The orange questions handle connects to another questions handle
- **Memory ↔ Memory only**: The fuchsia-purple memory handle connects memory outputs to gate memory targets
- **Single-input constraint**: Each target handle accepts exactly one incoming edge
- **No self-loops**: A node cannot connect to itself

---

## The Compilation Pipeline

When you click **Compile**, the following sequence executes inside `compileGraph()` in [semanticCompiler.js](file:///c:/Users/jadam/Desktop/PLG/src/compiler/semanticCompiler.js):

### Phase 1: Initialization
1. Find the **File Node** — this is the source of truth that initializes the baseline with a clean, empty prompt stream.
2. Find all active **logic gates** (AND, OR, NOT, Ask Questions, Provide Answers, Prompt Concat, Prompt to File, and Context Memory).
3. If no File Node exists → error. If no gates exist → error.

### Phase 2: Topological Sorting
The compiler builds a **directed acyclic dependency graph (DAG)** and computes the correct execution order using depth-first search:

```javascript
buildExecutionOrder(nodes, edges)
```

For each gate, it traces:
- **File input dependencies**: Which upstream gate feeds into this gate's file handle?
- **Prompt input dependencies**: Do any prompt inputs come from converter nodes or concat operators?
- **Questions dependencies**: Does an Ask Questions node feed into this gate?
- **Memory input dependencies**: Is a Context Memory node connected to this gate's memory handle?

The result is a topologically sorted array of gate IDs — guaranteeing that all upstream dependencies and memory indexes are built and executed first.

### Phase 3: Node-by-Node Execution

The compiler walks the sorted gate array and executes each gate's logic:

```
For each gate in topological order:
  1. Read the upstream file baseline (from gateStates dictionary)
  2. Read prompt inputs A and B
  3. Execute gate logic (rule-based or AI)
  4. Store the result in gateStates[gateId]
  5. Record a compilation stage trace for the debugger
```

#### Gate Execution Logic

| Gate | Rule-Based Mode | AI Mode |
| :--- | :--- | :--- |
| **AND** | Split baseline into array, append A and B, sort by category priority, rejoin | Send baseline + A + B to AI with merge instructions |
| **OR** | Compute context overlap score for A and B against baseline, pick highest | Send baseline + A + B to AI, ask it to choose the best fit |
| **NOT** | Strip A from positive baseline, append explicit negation clause (e.g., `avoid A`) | Send baseline + A to AI, ask it to sanitize positive and embed inline negation directives |
| **Context Memory** | Parse markdown ledger, perform case-sensitive token corrections, and append parenthesized rule constraints | Sync active codebase variable names as system prompt casing constraints for generation |
| **Ask Questions** | Return mock questions from offline bank | Send baseline to AI, ask for N clarifying questions |
| **Provide Answers** | Concatenate user answers with commas, append to baseline | Send baseline + Q&A pairs to AI for intelligent synthesis |
| **Prompt Concat** | Join all connected prompt inputs with commas | Same (no AI path) |
| **Prompt to File** | Overwrite baseline with the incoming prompt value | Same (no AI path) |

### Phase 4: Final De-Conflict & Reorder

After all gates execute:
1. Split the final compiled prompt into individual terms
2. Categorize each term (Subject, Environment, Style, etc.)
3. Check for **conflict pairs** (e.g., `realistic` vs `cartoon`)
4. Drop the lower-priority term in each conflict
5. Sort remaining terms by category priority (highest first)
6. Join into the final Compiled Prompt string

### Phase 5: Context Memory Verification
If a `contextMemory` node is active on the canvas, the compiler runs a validation pass:
1. Scans the compiled prompt against all terms, variables, and signatures indexed inside the active Context Memory.
2. Emits status feedback inside the Pipeline Debugger:
   - Green (`✓ Checked and matched [N] exact memory term(s)`) if casing matches are validated.
   - Amber (`⚠ Context Memory loaded but no exact terms matched`) if the compiled prompt fails to utilize any terms.
   - Grey info if no memory node is connected.

### Phase 6: State Sync

The compiler returns the result to [App.jsx](file:///c:/Users/jadam/Desktop/PLG/src/App.jsx), which:
1. Updates the **File Node** with the compiled prompt data
2. Updates every **File Viewer** node by tracing back through the graph to find its intermediate compiled prompt state
3. Updates **Ask Questions** nodes with generated question arrays
4. Updates **Provide Answers** nodes with synced question arrays

---

## State Management

PLG uses React state hooks for all data:

| State Variable | Purpose |
| :--- | :--- |
| `nodes` | Array of all visual nodes (positions, data, types) |
| `edges` | Array of all connections between nodes |
| `settings` | Compiler mode, AI provider, API keys, model versions |
| `compileResult` | Last compilation output (positive, stages, items) |
| `isCompiling` | Loading state flag |
| `fileTitle` | Current file node filename (for export) |
| `toast` | Toast notification state |

### Auto-Save

Every change to `nodes` or `edges` triggers an auto-save to `localStorage` under the key `plg_last_project`. On next load, the workspace restores automatically.

### Reactive Q&A Sync

A `useEffect` hook watches `edges` changes. When an edge connects an `askQuestion` node's output to an `answerQuestions` node's input, the questions array is automatically cloned into the target node's data — making the questions appear instantly in the answer textareas without requiring recompilation.

---

## CORS Proxy Architecture

Browser security prevents direct API calls to AI providers. The Vite dev server solves this with proxy rules in [vite.config.js](file:///c:/Users/jadam/Desktop/PLG/vite.config.js):

| Frontend Path | Proxied To |
| :--- | :--- |
| `/api/anthropic/*` | `https://api.anthropic.com/*` |
| `/api/openai/*` | `https://api.openai.com/*` |
| `/api/google/*` | `https://generativelanguage.googleapis.com/*` |
| `/api/openrouter/*` | `https://openrouter.ai/*` |

All API keys are stored in the browser's LocalStorage and sent directly to the provider. They never touch a third-party server.
