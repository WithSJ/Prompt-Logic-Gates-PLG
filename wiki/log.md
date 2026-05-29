# PLG Chronological Project Log

This is an append-only chronological ledger tracking major engineering steps, research document ingestions, compiler features, and visual architecture revisions.

---

## [2026-05-29] design | Multi-Depth Prompt Compilation Modes Implemented
- **Action**: Added 3 prompt compilation depth options (Normal, Thinking, DeepThinking) to the visual IDE's Inspector panel and Semantic Compiler.
- **Details**:
  - **Premium UI & Segmented Control**: Implemented a glassmorphic segment selector inside [Inspector.jsx](../src/components/Inspector.jsx) utilizing Lucide icons (`Zap`, `Brain`, `Cpu`) with responsive active HSL colors and glowing focus rings in [index.css](../src/index.css).
  - **State & LocalStorage Sync**: Synchronized compiler modes in [App.jsx](../src/App.jsx) to persist in local storage, automatically restoring preferences on reload and providing premium toast feedback.
  - **Thinking Mode Pipeline**: Expanded the compiler in [semanticCompiler.js](../src/compiler/semanticCompiler.js) to rephrase prompts beautifully via LLM, and implemented a high-vocabulary offline natural paragraph synthesizer that groups items by semantic category (Subject, Environment, camera framing, etc.) as a fallback.
  - **DeepThinking Mode Pipeline**: Formulated a compiler engine that outputs an exhaustive visual spec document in Markdown layout (covering Subject Focus, Spatial Context, Lighting/Composition, and Suppression Rules) via LLM, alongside a structured offline specs document fallback.


## [2026-05-29] refine | Git Repository Initialized & Configured
- **Action**: Created core Git configuration files and prepared the project for GitHub publishing.
- **Details**:
  - Authored a comprehensive [.gitignore](../.gitignore) file covering all modern Node/Vite, IDE, OS metadata, and environment files.
  - Authored a rich project-level [README.md](../README.md) integrating compiler vision, interactive graphs, and local running steps.
  - Initialized Git, staged all project files, and configured the remote GitHub repository at `https://github.com/WithSJ/Prompt-Logic-Gates-PLG-.git`.

## [2026-05-29] design | Comprehensive Documentation Suite Created
- **Action**: Read every source file in the project and created a 10-page documentation suite in the `documentation/` directory.
- **Details**:
  - [README.md](../documentation/README.md) — Project overview, feature table, and quick start.
  - [Getting Started](../documentation/getting-started.md) — Installation, prerequisites, first compilation walkthrough.
  - [How It Works](../documentation/how-it-works.md) — Architecture diagrams, data flow, compilation pipeline phases, state management.
  - [Nodes Guide](../documentation/nodes-guide.md) — All 11 node types documented with handles, fields, and usage examples.
  - [Compiler Engine](../documentation/compiler-engine.md) — Full category dictionary, conflict matrix, scoring formula, all 5 AI prompts.
  - [UI Reference](../documentation/ui-reference.md) — Every UI element: top bar, palette, canvas, inspector, settings modal, toasts.
  - [Workflows & Tutorials](../documentation/workflows-and-tutorials.md) — 6 step-by-step circuit building tutorials.
  - [API & AI Integration](../documentation/api-and-ai-integration.md) — Provider configs, CORS proxy, request formats, error handling.
  - [Project Structure](../documentation/project-structure.md) — File tree with line counts and export tables.
  - [Design System](../documentation/design-system.md) — CSS tokens, color palette, typography, component styles, animations.
  - Updated [wiki/index.md](index.md) with links to the documentation suite.

## [2026-05-29] design | LLM Wiki System Bootstrapped
- **Action**: Conceived and initialized the three-layer **LLM Wiki** structure inside the Prompt Logic Gates project workspace.
- **Details**:
  - Authored root [AGENTS.md](../AGENTS.md) schema configuring future agent maintenance guidelines.
  - Setup core entry gates: [index.md](index.md) and [log.md](log.md).
  - Drafted comprehensive technical wiki guides mapping [Overview](overview.md), [Architecture](architecture.md), [Nodes](nodes.md), [Compiler](compiler.md), and [Workflows](workflows.md) to serve as a persistent, compounding knowledge vault.

## [2026-05-29] release | AnswerQuestions Gate Reactive Sync Added
- **Action**: Extended frontend gate reactives to synchronize Q&A context.
- **Details**:
  - Implemented automatic sync of question arrays from `askQuestion` outputs directly down to `answerQuestions` input pins on edge state changes.
  - Resolved singleton constraint enforcing a single `fileViewer` node to guarantee execution safety and prevent duplicated stream outputs.
  - Preserved file baseline structures when Q&A parameters are unconnected.

## [2026-05-29] feature | Hybrid Semantic Compiler Engine Implemented
- **Action**: Completed rule-based semantic parser and multi-provider AI api caller.
- **Details**:
  - Formulated the 8 core categorization prompt dictionaries (Subject, Environment, Action, Emotion, Lighting, Style, Camera, Effects) with distinct compilation priority weights.
  - Structured baseline conflict matrix resolving style incompatibilities (e.g. `realistic` vs `cartoon`) via penalty deductions.
  - Established topological sorting sequence building functional DAG execution paths (`buildExecutionOrder`) to navigate file and prompt-converter boundaries.
  - Connected Anthropic Claude, OpenAI ChatGPT, and Google Gemini API callers using local CORS gateway proxies.

## [2026-05-28] research | Core Visual Logical Circuit Design Plan
- **Action**: Conceived visual logical operators mapping to classic boolean logic:
  - **AND**: Intersection compilation merging context details by sorting semantic importance.
  - **OR**: Context selection routing the highest semantically compatible option.
  - **NOT**: Negative suppression routing a concept to negative memories and stripping it from positive files.
