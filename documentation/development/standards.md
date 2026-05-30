# 📏 PLG Developer Guide - Coding Standards & Rules

To maintain high performance, strict visual consistency, and mathematical predictability across prompt logic circuits, all contributors must adhere to these engineering guidelines.

---

## 🎨 1. Styling Standards (Pure Vanilla CSS)

The Prompt Logic Gates IDE is styled with a custom, high-fidelity dark visual aesthetic. 

### Core Restrictions
- **No Tailwind CSS / Utility Frameworks**: All visual layouts and styling declarations must be written inside [index.css](../../src/index.css). Do not install Tailwind or use utility-based classes.
- **Accented HSL Themes**: Always use the defined CSS custom HSL variables to highlight specific gate types and file pins:
  - `--file` (Amber, `#f2b134`): Single source of truth references and `.txt` IO nodes.
  - `--prompt` (Cyan, `#22d3ee`): Custom prompt boxes, text fragments, and positive content lines.
  - `--and` (Blue, `#3b82f6`): AND logic conjunction node highlighting.
  - `--or` (Violet, `#a855f7`): OR context selector node highlighting.
  - `--not` (Red, `#ef4444`): NOT explicit negation node highlighting.
  - `--memory` (Bright Purple, `#c084fc`): Context Memory Node highlights and routes.
- **Micro-Animations**: All interactive elements (buttons, inputs, and pins) must carry smooth transition states (e.g., `transition: all 0.15s ease-in-out;`) to provide immediate feedback on hover or focus.

---

## ⛓️ 2. State & React Flow Canvas Bindings

Prompt Logic Gates structures React Flow as a fully reactive, synchronized canvas.

### The Single Source of Truth
- **Parent State Control**: The primary node array, edges list, local storage caches, and compilation modes must be handled strictly inside the parent state of [App.jsx](../../src/App.jsx).
- **Callback Bubbling**: Custom nodes inside [CustomNodes.jsx](../../src/components/CustomNodes.jsx) (e.g. input textareas or file selections) must NOT manage separate local states for canvas properties. Instead, they must bubble updates back using bound callbacks registered under `bindNodeCallbacks` to trigger updates in the parent `setNodes` hook.
- **Singleton Outputs**: The canvas enforces a strict singleton restriction on the `fileViewer` (Prompt File Viewer) component. Your code must assert that no duplicate output viewers can be added or loaded from JSON graph configs.

---

## 🧬 3. Compiler Mechanics & Topological Sorting

When the user triggers "Compile", the compiler engine inside [semanticCompiler.js](../../src/compiler/semanticCompiler.js) executes the following DAG execution algorithm.

### Phase 1: Topological Sort (DFS Sorter)
The compiler builds a directed acyclic graph (DAG) representation of your logical circuit by tracing edge connections. It executes a Depth-First Search (DFS) topological sort starting from target pins (`file`, `a`, `b`, `questions`), ensuring that all upstream variables are computed before compiling downstream nodes.

### Phase 2: Dynamic Category Parsing (Priority Manager)
Prompt text fragments are evaluated against keyword dictionaries. Unlike single-domain engines, a dynamic **Priority Manager** detects the target compilation domain (e.g. `image`, `code`, `debug`, `architecture`, `gui`) and loads its specific 9-dimensional priority mapping. 

For instance:
*   **Image Generation**: Ranks `subject` (100) ➔ `environment` (90) ➔ `style` (50) ➔ `effects` (30).
*   **Code Generation**: Ranks `lang_env` (100) ➔ `functionality` (95) ➔ `constraints` (75) ➔ `testing` (35).
*   **Bug Finding**: Ranks `error_stack` (100) ➔ `failing_code` (95) ➔ `expected` (85) ➔ `logs` (40).

The active domain is classified either **offline** (regex-based keyword matching) or **via AI** (LLM JSON classifier) depending on the active compiler setting. See [wiki/priority_manager.md](../priority_manager.md) for details.

### Phase 3: Conflict Overlap Scoring & Overrides
To prevent conflicting prompt instructions (e.g., commanding both a "realistic" photo and a "cartoon" drawing), the engine maps text against a static `CONFLICTS` matrix:
```javascript
export const CONFLICTS = [
  ['realistic','cartoon'], ['photorealistic','cartoon'], ['realistic','anime'],
  ['hyperrealistic','pixel'], ['dark','bright'], ['day','night'],
  ['colorful','monochrome'], ['detailed','minimalist'], ['cute','horror']
];
```
- **Overlap Penalty**: If mutually exclusive keywords are detected, an overlap penalty of `-3` is applied inside the `contextScore` scoring function.
- **Priority Override**: In rule-based mode, conflicting terms are evaluated by category priority class (e.g. style p=50 vs lighting p=60). The lower priority term is suppressed or dropped from the compiled baseline stream. If categories are equal, the topologically earlier node on the canvas takes precedence.

---

> [!TIP]
> Always verify your CSS bracket nesting and run `npm run build` before checking in code changes. Proceed to [llm-automation.md](llm-automation.md) to review automated documentation guidelines.
