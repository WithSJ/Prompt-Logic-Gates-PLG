---
category: documentation
updated: 2026-05-29
tags: [plg, project-structure, files, codebase]
---

# Project Structure

Complete file tree and description of every file in the PLG codebase.

---

## File Tree

```
PLG/
├── index.html                          # HTML entry point (16 lines)
├── package.json                        # Dependencies and scripts (24 lines)
├── vite.config.js                      # Vite config with CORS proxy rules (32 lines)
├── AGENTS.md                           # LLM Wiki schema for agent-maintained knowledge base
│
├── src/
│   ├── main.jsx                        # React app entry point (12 lines)
│   ├── App.jsx                         # Main application component (1015 lines)
│   ├── index.css                       # Complete design system (1036 lines)
│   │
│   ├── compiler/
│   │   └── semanticCompiler.js         # Semantic compilation engine (1320 lines)
│   │
│   └── components/
│       ├── CustomNodes.jsx             # All 12 React Flow node components (869 lines)
│       ├── PLGCanvas.jsx               # React Flow canvas wrapper (203 lines)
│       ├── Inspector.jsx               # Right panel pipeline debugger (177 lines)
│       └── SettingsModal.jsx           # AI provider configuration modal (238 lines)
│
├── wiki/                               # LLM-maintained knowledge wiki
│   ├── index.md                        # Wiki content catalog
│   ├── log.md                          # Chronological project log
│   ├── overview.md                     # Project vision and concepts
│   ├── architecture.md                 # Technical architecture deep-dive
│   ├── memory.md                       # Context Memory reference specification
│   ├── nodes.md                        # Node reference (wiki version)
│   ├── compiler.md                     # Compiler rules reference (wiki version)
│   └── workflows.md                    # Workflow guides (wiki version)
│
├── documentation/                      # This documentation suite
│   ├── README.md                       # Documentation entry point
│   ├── getting-started.md             # Installation and first run
│   ├── how-it-works.md                # Architecture and data flow
│   ├── nodes-guide.md                 # Complete node reference
│   ├── compiler-engine.md             # Compiler technical reference
│   ├── ui-reference.md                # UI element documentation
│   ├── workflows-and-tutorials.md     # Step-by-Step Tutorials
│   ├── api-and-ai-integration.md      # AI provider configuration
│   ├── project-structure.md           # This file
│   └── design-system.md              # CSS tokens and styling
│
├── dist/                               # Production build output (generated)
└── node_modules/                       # Dependencies (generated)
```

---

## File-by-File Reference

### Root Files

#### [index.html](file:///c:/Users/jadam/Desktop/PLG/index.html) (16 lines)
The HTML entry point. Contains:
- Meta viewport tag for responsive layout
- Google Fonts preconnect links
- Font imports: **Inter** (UI text), **IBM Plex Sans** (fallback), **Fira Code** (monospace), **IBM Plex Mono** (monospace fallback)
- A single `<div id="root">` mount point
- Module script import for `src/main.jsx`

#### [package.json](file:///c:/Users/jadam/Desktop/PLG/package.json) (24 lines)
Project metadata and dependencies:
- **Name**: `prompt-logic-gates-ide`
- **Version**: `1.0.0`
- **Type**: ES Module
- **Scripts**: `dev`, `build`, `preview`
- **Runtime deps**: react, react-dom, @xyflow/react, lucide-react
- **Dev deps**: vite, @vitejs/plugin-react, TypeScript types

#### [vite.config.js](file:///c:/Users/jadam/Desktop/PLG/vite.config.js) (32 lines)
Vite build configuration:
- React plugin enabled
- Four CORS proxy rules mapping `/api/{provider}` to their respective API endpoints
- Path rewriting strips the `/api/{provider}` prefix

---

### Source Files (`src/`)

#### [main.jsx](file:///c:/Users/jadam/Desktop/PLG/src/main.jsx) (12 lines)
Application bootstrap:
- Imports React, ReactDOM, App component, CSS, and React Flow styles
- Renders `<App />` inside `<React.StrictMode>` into `#root`

#### [App.jsx](file:///c:/Users/jadam/Desktop/PLG/src/App.jsx) (1015 lines)
The main application component. Contains:

| Section | Lines | Description |
| :--- | :--- | :--- |
| Imports & constants | 1–36 | React hooks, React Flow, Lucide icons, default settings |
| `Store` helper | 10–23 | LocalStorage get/set wrapper with error handling |
| `PLGApp` component | 38–1005 | The entire application logic |
| `App` export | 1007–1014 | Wraps PLGApp in ReactFlowProvider |

Key state variables:
- `nodes` / `edges` — React Flow graph state
- `settings` — Compiler mode, provider, keys, models
- `compileResult` — Last compilation output
- `isCompiling` — Loading flag
- `fileTitle` — Current filename from File Node
- `toast` — Notification state

Key functions:
- `bindNodeCallbacks()` — Creates event handler closures for each node
- `seedExample()` — Creates the default template circuit
- `handleCompile()` — Triggers compilation and syncs results
- `handleSaveGraph()` / `handleLoadGraph()` — JSON import/export
- `handleExportTxt()` — Downloads compiled prompts as .txt
- `handleClearCanvas()` — Resets workspace (preserves File Viewer)
- `handleNewProject()` — Loads fresh seed template

#### [index.css](file:///c:/Users/jadam/Desktop/PLG/src/index.css) (1036 lines)
The complete design system. See [Design System](design-system.md) for full details.

---

### Compiler (`src/compiler/`)

#### [semanticCompiler.js](file:///c:/Users/jadam/Desktop/PLG/src/compiler/semanticCompiler.js) (916 lines)
The semantic compilation engine. Exports:

| Export | Type | Description |
| :--- | :--- | :--- |
| `CATEGORIES` | Object | 9 category definitions with keywords and priorities |
| `CONFLICTS` | Array | 17 conflict pairs for contradiction detection |
| `categorize(text)` | Function | Returns `{category, priority}` for a text fragment |
| `contextScore(text, contextText)` | Function | Computes semantic compatibility score |
| `buildExecutionOrder(nodes, edges)` | Function | Topological sort of gate execution order |
| `getFileInput(nodes, edges, gateId, gateStates)` | Function | Traces upstream file baseline |
| `callAI(system, user, settings)` | Function | Unified multi-provider API caller |
| `compileGraph(nodes, edges, settings)` | Function | Main compilation entry point |

Internal (non-exported) functions:
- `tokens(s)` — Tokenizes text into lowercase words
- `hasTerm(text, term)` — Case-insensitive substring check
- `promptInput(nodes, edges, gateId, pinId, gateStates)` — Resolves prompt text from input pin
- `errText(res)` — Formats API error messages
- `extractJson(s)` — Parses JSON from AI response (handles markdown code blocks)
- `aiGateAnd()`, `aiGateOr()`, `aiGateNot()` — AI gate execution functions
- `aiAskQuestions()`, `aiRefineAnswers()` — AI Q&A functions
- `offlineMockQuestions()` — Offline question bank

---

### Components (`src/components/`)

#### [CustomNodes.jsx](file:///c:/Users/jadam/Desktop/PLG/src/components/CustomNodes.jsx) (869 lines)
Defines all 12 custom React Flow node components:

| Component | Node Type | Lines |
| :--- | :--- | :--- |
| `NodeHeader` | (shared header) | 6–27 |
| `FileNode` | `fileNode` | 30–63 |
| `PromptBoxNode` | `promptBox` | 66–95 |
| `ANDNode` | `and` | 98–157 |
| `ORNode` | `or` | 160–219 |
| `NOTNode` | `not` | 222–273 |
| `FileViewerNode` | `fileViewer` | 276–335 |
| `FileToPromptNode` | `fileToPrompt` | 338–374 |
| `AskQuestionNode` | `askQuestion` | 377–472 |
| `AnswerQuestionsNode` | `answerQuestions` | 475–570 |
| `PromptConcatNode` | `promptConcat` | 573–659 |
| `PromptToFileNode` | `promptToFile` | 662–698 |
| `ContextMemoryNode` | `contextMemory` | 701–866 |

All components are wrapped in `React.memo()` for performance. The `nodeTypes` registry object maps type strings to components.

#### [PLGCanvas.jsx](file:///c:/Users/jadam/Desktop/PLG/src/components/PLGCanvas.jsx) (203 lines)
The React Flow canvas wrapper. Handles:
- Connection validation (`isValidConnection`)
- Edge creation with color-coded styles (`onConnect`)
- Drag-and-drop from palette (`onDragOver`, `onDrop`)
- Node selection (`onNodeClick`, `onPaneClick`)
- Singleton File Viewer constraint enforcement
- Background grid and controls styling

#### [Inspector.jsx](file:///c:/Users/jadam/Desktop/PLG/src/components/Inspector.jsx) (177 lines)
The right panel compilation output display. Features:
- Compiled prompt display with copy button
- Expandable pipeline stage debugger (with Context Memory verification checks)
- Compilation breakdown table with category badges
- Export .txt and Clear All buttons
- Category color mapping for breakdown badges

#### [SettingsModal.jsx](file:///c:/Users/jadam/Desktop/PLG/src/components/SettingsModal.jsx) (238 lines)
The AI configuration modal. Features:
- Compiler mode toggle (Rule-based / AI-assisted)
- Provider selection (4 providers)
- API key input with show/hide toggle
- Model version override
- Test Connection button with status display
- Save & Close with LocalStorage persistence
