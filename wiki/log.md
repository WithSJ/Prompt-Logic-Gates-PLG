# PLG Chronological Project Log

This is an append-only chronological ledger tracking major engineering steps, research document ingestions, compiler features, and visual architecture revisions.

## [2026-05-30] refine | Implement Dynamic Multi-Domain Priority Schema & Priority Manager
- **Action**: Conceived, styled, and built the complete **Multi-Domain Compiler Priority Selector** and **Priority Manager** dynamic sorting engine, implementing dynamic schema priority mapping, dynamic lexical/AI domain classification, dynamic deep visual briefs, and dynamic offline clarification questions catalog.
- **Details**:
  - **Dynamic Dropdown UI**: Styled and rendered a premium visual `<select>` control (`.priority-select`) in the right sidebar Inspector above the Compilation Depth control, featuring dynamic color-changing visual indicator accents matching the active domain.
  - **Auto-Detect Classifier**: Implemented the dual-pathway classifier `classifyDomain(text, settings)` in [semanticCompiler.js](../src/compiler/semanticCompiler.js). It performs fast lexical keyword analysis in rule-based mode, and structured LLM API JSON classification queries in AI mode to dynamically determine the compilation profile.
  - **Multi-Domain Priority Weights**: Integrated the five core domains (`image`, `code`, `debug`, `architecture`, `gui`) and their 9-dimensional priority weights and keyword dictionaries from the Obsidian specification sheet.
  - **Generic Dynamic Templates**: Refactored the offline thinking paragraph generator (`offlineThinkingRephrase`) and the deep-thinking Visual Brief generator (`offlineDeepThinkingSpec`) to dynamically adapt and group prompt details under domain-specific categories.
  - **Domain-Specific Clarification Questions**: Configured the offline rule-based Ask AI Questions catalog `OFFLINE_QUESTIONS` to fetch targeted questions based on the active domain (such as language dependencies for code, stack traces for bugs).
  - **Build Integrity Verified**: Compiled the production bundle successfully using `npm run build` with zero Rollup or linting errors.

## [2026-05-30] design | Design Multi-Domain Prompt Priority Schema & Priority Manager
- **Action**: Conceived and specified a multi-domain dynamic sorting architecture for the semantic compiler, introducing specialized prompt priority dimensions and offline template question banks for Programming, Debugging, System Architecture, and GUI layout tasks.
- **Details**:
  - **Dynamic Multi-Domain Schema**: Researched and established 9-dimensional priority weights and core keyword mappings for five key prompt domains (`image`, `code`, `debug`, `architecture`, `gui`).
  - **Priority Manager Specification**: Designed the system architecture for a dynamic `PriorityManager` routing engine capable of switching priority catalogs on the fly.
  - **Dual-Pathway Classifier**: Defined a hybrid classification pipeline which performs fast offline rule-based keyword matching when executing in Normal mode, and switches to a structured LLM system classifier in Thinking or DeepThinking AI modes.
  - **Domain-Specific Offline Question Banks**: Designed 5 distinct offline question banks (10 targeted template questions each) for each compilation domain, ensuring that rule-based Ask AI Questions gates serve highly tailored queries.
  - **Wiki & Docs Integration**: Formulated [wiki/priority_manager.md](priority_manager.md) and updated [compiler-engine.md](../documentation/compiler-engine.md) to integrate all dynamic priorities, hybrid routing architectures, and question catalogs.

## [2026-05-30] design | Create Comprehensive Developer & LLM Agent Documentation Suite
- **Action**: Conceived and created a complete developer documentation directory containing structured markdown files covering quickstart setups, Vanilla CSS and state rules, and copy-pasteable AI prompts to automate logs, wikis, and indices.
- **Details**:
  - **Decoupled Folder Structure**: Created a dedicated `documentation/development/` directory containing three rich markdown files:
    - [setup.md](../documentation/development/setup.md): Complete setup guide mapping prerequisites (Node.js v18+), package installs (`npm install`), Vite dev server setups (`npm run dev`), and compiled production bundles (`npm run build`).
    - [standards.md](../documentation/development/standards.md): Outlines pure Vanilla CSS styling variables (no Tailwind), React Flow parent-state callbacks, topological DFS sorting, and static conflict override matrices.
    - [llm-automation.md](../documentation/development/llm-automation.md): Explains ingest, refine, lint, and design protocols from [AGENTS.md](../AGENTS.md), and provides a copy-pasteable AI system prompt template to allow LLMs to auto-compile logs and index links.
  - **Catalogs Updated**: Integrated references to the new markdown suite in [wiki/index.md](index.md) and the root repository [README.md](../README.md) to assist new contributors and LLM agents.

## [2026-05-30] design | Implement Editable Workspace Name & Integrated Filename Synchronization
- **Action**: Conceived and integrated an editable **Workspace Name** control directly in the IDE Topbar, creating an automated two-way synchronization loop that governs all downloaded `.json` graph configurations and exported `.txt` prompt briefs, with automated space-to-underscore sanitization.
- **Details**:
  - **Topbar Workspace Control**: Designed and styled a premium, glassmorphic `.workspace-name-container` component in the [App.jsx](../src/App.jsx) Topbar. Equipped it with hover animations, reactive focus-glowing cyan borders, and integrated file extension indicators (`.json / .txt`).
  - **Two-Way Binding Engine**: Implemented an automated synchronization system in [App.jsx](../src/App.jsx). Changing the Workspace input automatically propagates the name down to rename any active `fileNode` filenames on the canvas; conversely, editing the filename on the canvas dynamically updates the Workspace input in the Topbar.
  - **Automated Space-to-Underscore Substitution**: Configured real-time input sanitizers across all entry streams—including Topbar workspace input, File Node filename change handlers, and nodes sync hooks—to automatically convert space (` `) characters into underscores (`_`) to maintain strict operating system and filesystem filename safety.
  - **Persistent LocalStorage Sync**: Updated the mount-restore and auto-save `useEffect` hooks in [App.jsx](../src/App.jsx) to preserve `workspaceName` under `plg_last_project`, ensuring it restores seamlessly on page reloads.
  - **Automated Filename Saves**: Refactored `handleSaveGraph` and `handleExportTxt` in [App.jsx](../src/App.jsx) to compile filenames dynamically as `${workspaceName}.json` and `${workspaceName}.txt` respectively, addressing the user's need for consistent, workspace-aligned file naming.
  - **Vite & CSS Compilation Verified**: Rectified a minor unbalanced CSS bracket in [index.css](../src/index.css) and compiled the production build using Vite to guarantee zero warning alerts.

## [2026-05-30] refine | Implement Prompt Box Rephrase Undo (Ctrl+Z) History System
- **Action**: Conceived and built a custom keystroke-level undo and checkpointing history mechanism for Prompt Box AI rephrasing, enabling users to press `Ctrl+Z` to revert programmatically rephrased prompts back to their raw typed baseline.
- **Details**:
  - **Undo State Capture**: Configured the `onRephrasePrompt` callback in [App.jsx](../src/App.jsx) to capture and store the current, human-written text in the node's state under `data.userText` before launching the AI optimizer.
  - **Keystroke Listener Interceptor**: Attached a `handleKeyDown` event listener to the `<textarea>` component inside the `PromptBoxNode` custom component in [CustomNodes.jsx](../src/components/CustomNodes.jsx). It catches `Ctrl+Z` (or `Cmd+Z`), checks if there is a recorded `userText` distinct from the current rephrased text, and dynamically restores the user's pre-rephrased baseline.
  - **Cascading Rephrase Memory**: Enabled continuous multi-rephrasing history. If the user manually modifies an AI-rephrased text and triggers rephrasing again, their manual edits automatically overwrite `userText` as the new history checkpoint.
  - **Tooltips Updated**: Added tooltip titles explicitly calling out the `Ctrl+Z` undo functionality on Prompt Box rephrase controls.

## [2026-05-30] refine | Add AI Rephrase Button to Prompt Box Custom Node
- **Action**: Conceived and integrated an **AI Rephrase Fragment** button directly into the `PromptBoxNode` custom component to automatically optimize raw user inputs, correct typos, grammar issues, and enforce a commanding visual tone.
- **Details**:
  - **Rephrase Handler Bonded**: Created an asynchronous callback `onRephrasePrompt` in [App.jsx](../src/App.jsx) bound inside the `bindNodeCallbacks` wrapper.
  - **AI Rephrasing Prompt Formulated**: Formulated a targeted system prompt inside `onRephrasePrompt` directing the LLM to scan prompt fragments, fix structural typos or spelling errors, and output a concise, commanding rephrased fragment without meta-text.
  - **Offline Rephraser Fallback**: Implemented an offline fallback that cleans double spaces, handles first-letter capitalization, and outputs the sanitized baseline text if AI calls fail.
  - **UI/UX Node Component Upgrades**: Modified `PromptBoxNode` in [CustomNodes.jsx](../src/components/CustomNodes.jsx) to display a glassmorphic button equipped with a Brain icon and responsive spinner animation. Adjusted target handle vertically to `top: "50%"` to center dynamically.
  - **Documentation & Wiki Updated**: Updated the nodes manual ([nodes-guide.md](../documentation/nodes-guide.md)) and the wiki guide ([nodes.md](nodes.md)) to reflect Prompt Box rephrasing controls.

## [2026-05-30] refine | Redesign Compiled Prompts for Strict Commanding and Directive Output
- **Action**: Completely overhauled the semantic prompt compilers (both AI and offline modes) to ensure all generated outputs are strictly directive visual briefs or commanding sentences, eliminating passive phrasings, parenthesized technical metadata, and document references.
- **Details**:
  - **AI Prompt Architectures Redesigned**: Refactored system prompts for AND (`aiGateAnd`), OR (`aiGateOr`), NOT (`aiGateNot`), Q&A Synthesis (`aiRefineAnswers`), and Memory Alignment (`aiAlignPromptWithMemory`) to speak in a visual director's command voice, strictly banning phrases like "according to memory", "based on fragment A", "merged prompt", or meta-labels.
  - **Deep & Normal Thinking Prompts Refined**: Modified thinking and deep-thinking mode compiler prompts to strictly command the downstream generator model via active, imperative verbs and structure Premium Markdown briefs without meta-commentary or document references.
  - **Offline Memory Appends Redesigned**: Dismantled the parenthesized technical metadata formula `(Memory Constraints: [[Term] rule: [Description]])` in both primary and error fallback compilation pathways. Replaced it with a direct, active sentence-injection format: `Enforce [Term]: [Description].` which blends seamlessly into the final prompt.
  - **Documentation & Wiki Manuals Synced**: Updated the compiler engine spec (`documentation/compiler-engine.md`), workflows handbook (`documentation/workflows-and-tutorials.md`), and memory wiki (`wiki/memory.md`) to reflect the new commanding prompt syntax and expected outputs.

## [2026-05-30] lint | Reconcile 10-page user manual suite, align wiki hubs, and synchronize with Git
- **Action**: Updated the entire `documentation/` user manual suite and aligned relative link hubs to reconcile all developer documentation with fuchsia Context Memory nodes and singleCompiledPrompt explicit inline negation architecture.
- **Details**:
  - **10-Page Manual Suite Synced**: Overwrote README, Getting Started, How It Works, Nodes Guide, Compiler Engine, UI Reference, Workflows, Project Structure, and Design System.
  - **Context Memory API Documented**: Detailed handles (`.memory`), drag-and-drop file uploaders, lexical casing swappers, zero-shot AI catalogers, and the parenthesized rule constraint injection formula.
  - **Unified Compiled Prompt Specs**: Completely excised obsolete references to a separate positive/negative dual-pipeline; updated all tutorials and UI references to feature a single Compiled Prompt showing inline negation constraints.
  - **Star-Graph Links Integrated**: Added relative connection grids at the end of `wiki/overview.md` to form a perfect Obsidian star-graph representation.


## [2026-05-30] refine | Upgrade Visual Context Memory system to MemPalace-style ledger & complete prompt expansion
- **Action**: Upgraded the Visual Context Memory system to model a high-fidelity indexing catalog (styled after MemPalace) and enabled complete prompt design/expansion based on matching memory specifications.
- **Details**:
  - **Memory Indexer Upgraded**: Upgraded `onExtractMemory` in [App.jsx](../src/App.jsx) to index files into a rigorous HSL-friendly hierarchy containing Wings, Rooms, and Halls.
  - **Offline Lexical Crawler**: Implemented an advanced line-by-line regex crawler that parses JSON keys, multi-casing variables (camelCase, PascalCase, snake_case, CONSTANT_CASE), function signatures, and semantic guidelines (using `must`, `should`, `always`, `never`, `avoid` regex matching) to construct detailed visual entity hints and constraints.
  - **AI Prompt Indexer Redesigned**: Redesigned the AI system extractor instructions to output Obsidian-friendly workspace hierarchy logs, variable definition tables, and semantic visual constraints.
  - **Complete Prompt Design & Expansion**: Upgraded the Context Memory compiler gate (`aiAlignPromptWithMemory` and offline fallbacks in [semanticCompiler.js](../src/compiler/semanticCompiler.js)) to intercept high-level prompt keywords or references, automatically expanding them into detailed specifications utilizing exact case-sensitive nomenclature.
  - **Offline Semantic Rules Injection**: Implemented automatic extraction of memory rule statements which are appended directly as formatted parenthesized constraints on rule-based compiler cycles when terms are matched.
  - **Wiki Verification Guide**: Overwrote [Context Memory Reference Specifications](memory.md) to document the Wings/Rooms/Halls workspace structure, expansion engines, and validation card.

## [2026-05-30] design | Implement Context Memory Node & Strict Variable Alignment
- **Action**: Conceived and built the **Context Memory Node** which reads codebase files, wikis, html, and json, indexing variables/functions into structured Markdown to enforce exact casing alignment during prompt compilation.
- **Details**:
  - **Memory Node Creation**: Implemented `ContextMemoryNode` in [CustomNodes.jsx](../src/components/CustomNodes.jsx) utilizing a fuchsia-purple theme (`var(--memory)`). Equipped node with client-side text file loaders, files lists, a text editor preview, and a target `file` pin + source `memory` pin.
  - **Topological Sorting Updated**: Upgraded topological sorter (`buildExecutionOrder` in [semanticCompiler.js](../src/compiler/semanticCompiler.js)) to resolve memory dependencies upstream, ensuring file baselines are fully generated before memory indexes them.
  - **Visual Handles & Routing**: Added purple target memory handles to AND, OR, NOT, and Provide Answers nodes in [CustomNodes.jsx](../src/components/CustomNodes.jsx) with custom validation and purple visual connections (`#c084fc`) in [PLGCanvas.jsx](../src/components/PLGCanvas.jsx).
  - **Compiler Alignment**: Upgraded prompt generators in [semanticCompiler.js](../src/compiler/semanticCompiler.js) to swallow memory variables/functions and feed them as strict system constraints to the AI, ensuring exact naming matches.
  - **Offline Memory Verification**: Formulated an offline regex matching validator within `compileGraph` that scans generated prompts for backtick-wrapped memory keywords and outputs exact validation reports in the Pipeline Debugger stages.
  - **Documentation Suite**: Added Obsidian-friendly [Context Memory specifications](memory.md) and linked it in [index.md](index.md).

## [2026-05-30] refine | Update NOT Gate to Explicit Negation & Remove Negative Prompt System
- **Action**: Converted NOT gate concept suppression to append explicit negation clauses (e.g. `avoid [concept]`) directly to the single Compiled Prompt baseline and fully dismantled the separate Negative Prompt system.
- **Details**:
  - **Core Compiler Refactoring**: Updated [semanticCompiler.js](../src/compiler/semanticCompiler.js) to strip positive references to `A` and append `avoid A` in rule-based mode, and modified `aiGateNot` instructions to ask the LLM to write natural clauses (like "do not use", "avoid") in one prompt.
  - **UI/UX Cleanup**: Completely removed Section 2 ("Negative Prompt") and its copy button from [Inspector.jsx](../src/components/Inspector.jsx) and the `PLG-IDE.html` right sidebar. Renamed "Positive Prompt" to "Compiled Prompt".
  - **Custom Nodes Refined**: Updated `FileViewerNode` in [CustomNodes.jsx](../src/components/CustomNodes.jsx) to hide the Negative Prompt box and expanded the main Compiled Prompt text area for a premium visual aesthetic. Updated `NOTNode` description.
  - **Export System**: Synchronized [App.jsx](../src/App.jsx) and `PLG-IDE.html` plain text exporters to output a clean, single prompt under a `# Compiled Prompt` header.
  - **Compiling Wiki Guides**: Updated all Obsidian-compatible guides including Overview, Architecture, Nodes Reference, Compiler Specifications, and Workflows to strictly detail explicit negation routing instead of negative memory.

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
