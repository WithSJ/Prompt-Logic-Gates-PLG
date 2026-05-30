---
category: documentation
updated: 2026-05-29
tags: [plg, compiler, categories, conflicts, scoring]
---

# Compiler Engine — Technical Reference

This document details the semantic compiler's internal logic: the categorization system, keyword dictionaries, priority weights, conflict matrix, context scoring formula, and the complete set of AI prompts.

Source file: [semanticCompiler.js](file:///c:/Users/jadam/Desktop/PLG/src/compiler/semanticCompiler.js) (916 lines)

---

## 1. How Prompt Priorities Work

In prompt engineering, generative AI models (like Large Language Models and image generation networks) pay the most attention to tokens placed at the **beginning** of a prompt. To maximize execution accuracy, Prompt Logic Gates (PLG) uses a **Priority-Based Sorting System**:

1.  **Categorization**: The compiler analyzes each prompt fragment (keyword or text pin) and matches it against keyword catalogs to classify it into one of 9 custom dimensions (e.g. `subject`, `style`, `lighting`, or `failing_code`).
2.  **Numerical Weighting**: Each of the 9 dimensions carries a numerical **Priority Weight** (ranging from `20` to `100`).
3.  **Topological Sorting & Ordering**: During the final compilation stage, the compiler sorts all connected prompt components according to their priority weights (highest priority first, lowest priority last). This guarantees that essential foundational context (like language restrictions or image subjects) appears at the start of the prompt, while superficial modifiers (like file formats or camera details) appear at the end.
4.  **Scoring Contribution**: The priority value is normalized and fed into the compiler's semantic scoring equation to resolve competing candidates (such as in an OR gate decision):
    $$\text{Score} = (\text{Overlap Tokens} \times 2) + \text{Category Affinity} + \left(\frac{\text{Priority}}{100}\right) - \text{Conflicts Penalty}$$

---

## 2. What is the Priority Manager?

The **Priority Manager** (`PriorityManager`) is the compiler component responsible for making the sorting engine dynamic. Instead of enforcing a single, hardcoded image prompt priority hierarchy on every compilation cycle, it dynamically **detects the compilation domain** of the canvas circuit and loads the appropriate priority weights.

### The Hybrid Classification Engine

To detect the target domain, the Priority Manager implements two execution pathways based on the active **Compiler Mode**:

*   **Offline Mode (Normal)**: Executes a lightweight lexical crawler. It scans all connected prompt boxes and input file text nodes, running regex counts against key vocabulary lists:
    *   *Code Vocabulary*: matches syntax tags like `function`, `import`, `class`, `typescript`, `rust`, etc.
    *   *Debug Vocabulary*: matches error hooks like `TypeError`, `Exception`, `stacktrace`, `crash`, `actual behavior`, etc.
    *   *Architecture Vocabulary*: matches layout concepts like `microservices`, `K8s`, `high availability`, `PostgreSQL`, etc.
    *   *GUI Vocabulary*: matches style grid indicators like `navbar`, `flexbox`, `grid`, `CSS theme`, `padding`, `margin`, etc.
    *   *Image Vocabulary (Fallback)*: matches visuals like `photorealistic`, `volumetric`, `lighting`, `render`, `oil painting`, etc.
    The domain scoring the highest total keyword overlap is dynamically loaded.
*   **AI Mode (Thinking / DeepThinking)**: Submits the consolidated prompt fragments to the active LLM provider using a structured system classifier prompt. The LLM evaluates the context and returns a JSON category routing directive:
    ```json
    {
      "domain": "image" | "code" | "debug" | "architecture" | "gui",
      "reason": "Explain why this domain matches the visual circuit context"
    }
    ```

Once classified, the Priority Manager overrides the compiler's sorting arrays and weights with the target domain's ruleset.

---

## 3. Active Priorities Present Right Now

The PLG engine actively supports five core compilation domains, each equipped with its own 9-dimensional priority weights:

### A. Image Generation Domain (`image`)
Enforces character definitions and settings first, followed by visual styling, lighting, camera angles, and render details.

*   `subject` (Priority = 100): Core character, person, entity, or object focus.
*   `environment` (Priority = 90): Location, background context, or landscape.
*   `action` (Priority = 80): Physical movements, poses, or subject states.
*   `emotion` (Priority = 70): Mood, emotional profile, or overall atmospheric tension.
*   `lighting` (Priority = 60): Illumination characteristics (neon, candles, moonlight).
*   `style` (Priority = 50): Art medium, rendering engine, or aesthetic format (PS1, low poly, realistic).
*   `detail` (Priority = 45): Fallback general enhancement modifiers.
*   `camera` (Priority = 40): Camera lenses, shooting angles, or framing (POV, close-up).
*   `effects` (Priority = 30): Post-processing features (vignette, film grain, glitch).

### B. Code Generation & Programming Domain (`domain: code`)
Ensures compile environments and core functionality are defined at the start of the prompt so coding LLMs conform to syntax rules.

*   `lang_env` (Priority = 100): Programming languages, compilers, runtimes, and versions (Rust, Node, React 18).
*   `functionality` (Priority = 95): Target algorithmic functions, core logic, routes, or class behaviors.
*   `io_structure` (Priority = 85): Input parameters, return types, JSON schemas, or DB payloads.
*   `constraints` (Priority = 75): Performance thresholds, memory limits, time complexity, or zero-dependency rules.
*   `standards` (Priority = 65): Design principles, modularity rules, formatting styles (SOLID, DRY, OOP).
*   `edge_cases` (Priority = 55): Handling null values, timeouts, exceptions, or boundary limits.
*   `libraries` (Priority = 45): Third-party utilities and modules (axios, express, pandas).
*   `testing` (Priority = 35): Testing suites, unit test generation guidelines (jest, pytest, mock).
*   `documentation` (Priority = 25): Document structures, JSDocs, comments, and readme briefs.

### C. Bug Finding & Debugging Domain (`domain: debug`)
Places immediate error messages and failing code blocks first to ground the LLM's diagnostic context before evaluating logs or environment states.

*   `error_stack` (Priority = 100): Strict error messages, exception types, and exact stack traces.
*   `failing_code` (Priority = 95): Broken snippet, file name, line coordinates, or failing function.
*   `expected` (Priority = 85): Target expectations, desired outputs, or standard behavior.
*   `actual` (Priority = 80): Current buggy outputs, incorrect state transitions, or crashing behaviors.
*   `env_state` (Priority = 70): Runtime conditions, OS versions, web tool logs, or package parameters.
*   `recent_changes` (Priority = 60): Recent code commits, git diffs, or newly installed dependencies.
*   `attempts` (Priority = 50): Solutions already tried by the developer.
*   `logs` (Priority = 40): Console logs, network payload listings, or database query dumps.
*   `constraints` (Priority = 30): Resolution constraints (e.g. hotfix-only, avoid breaking changes).

### D. Software Architecture & System Design Domain (`domain: architecture`)
Prioritizes high-level system requirements and scale constraints over implementation technologies.

*   `goals_scale` (Priority = 100): Scale (10M DAU), latency parameters, uptime requirements, or core targets.
*   `patterns` (Priority = 90): System design architecture patterns (microservices, monolithic, MVC).
*   `data_storage` (Priority = 80): Databases, caching engines, replication, and indexing rules (Postgres, Redis).
*   `platforms` (Priority = 70): Hosting environments, cloud platforms, and container systems (AWS, Kubernetes).
*   `quality_attr` (Priority = 60): Non-functional attributes (scalability, extensibility, maintainability).
*   `protocols` (Priority = 50): Connection guidelines, message brokers, and API standards (REST, gRPC, Kafka).
*   `security` (Priority = 40): Identity setups, encryption, rules, regulations, and access scopes (OAuth, JWT).
*   `devops` (Priority = 30): Delivery setups, pipelines, tracking, and logs (GitHub Actions, Prometheus).
*   `cost` (Priority = 20): Monthly budget limits, server limitations, or cost-minimization goals.

### E. GUI & UI/UX Design Domain (`domain: gui`)
Focuses on layouts, components, and brand tokens before choosing frameworks or applying styling utilities.

*   `layout` (Priority = 100): Screen sizes (desktop, mobile), layouts, responsive frameworks, and alignment grids.
*   `components` (Priority = 90): Essential visual components (cards, headers, sidebars, modal windows).
*   `theme` (Priority = 80): Style palettes, lighting themes (dark mode), gradients, and brand visual guidelines.
*   `typography` (Priority = 70): Text settings, standard typography choices (Inter), headings, and visual scaling.
*   `interactions` (Priority = 60): Hover states, click transformations, page loaders, and active button behaviors.
*   `framework` (Priority = 50): Styling systems and styling libraries (Tailwind, pure Vanilla CSS, React Flow).
*   `a11y` (Priority = 40): Accessibility specifications, alt labels, contrast checks, and keyboard mappings.
*   `spacing` (Priority = 30): Inner spacings, margins, gaps, border values, and visual alignments.
*   `assets` (Priority = 20): Graphic icons, logos, graphic files, or placeholder references.

---

## 4. Conflict Matrix

The compiler checks for semantically contradictory terms. Each conflict pair is defined explicitly:

| Term A | Term B | Reason |
| :--- | :--- | :--- |
| `realistic` | `cartoon` | Contradictory rendering styles |
| `photorealistic` | `cartoon` | Photo quality vs cartoon style |
| `realistic` | `anime` | Photo vs anime rendering |
| `photorealistic` | `anime` | Photo vs anime rendering |
| `realistic` | `toon` | Photo vs toon rendering |
| `hyperrealistic` | `pixel` | Ultra-detailed vs low-resolution |
| `dark` | `bright` | Contradictory lighting |
| `day` | `night` | Contradictory time of day |
| `dawn` | `dusk` | Ambiguous but contradictory timing |
| `colorful` | `monochrome` | Contradictory color palettes |
| `detailed` | `minimalist` | Contradictory detail levels |
| `cute` | `horror` | Contradictory emotional tones |
| `cute` | `terrifying` | Contradictory emotional tones |
| `peaceful` | `terrifying` | Contradictory moods |
| `happy` | `horror` | Contradictory moods |
| `calm` | `chaotic` | Contradictory energy levels |
| `clean` | `grunge` | Contradictory texture qualities |

### Conflict Resolution

When a conflict is detected in the final prompt:
1. Both terms are found in the compiled positive array
2. Each term is categorized and given a priority score
3. The **lower-priority** term is marked with `_drop` and visually struck through in the Inspector
4. The higher-priority term remains

---

## 3. Context Overlap Score

The OR gate uses this formula to decide between two competing candidates:

```
Score = (overlap × 2) + affinity + (priority / 100) - (conflicts × 3)
```

| Component | Calculation | Weight |
| :--- | :--- | :--- |
| **Overlap** | Count of shared tokens between candidate and baseline | ×2 |
| **Affinity** | +1 if the candidate's category keywords appear in baseline | +1 |
| **Priority** | Category priority of the candidate (0–100) | ÷100 |
| **Conflicts** | Count of conflict pairs between candidate and baseline | ×-3 |

### Scoring Example

```
Baseline: "dark hospital corridor, eerie atmosphere"

Candidate A: "realistic photograph, 8K resolution"
  - Overlap tokens: 0 (no shared words)
  - Affinity: 0 (Style keywords not in baseline)
  - Priority: 50/100 = 0.5
  - Conflicts: 0
  - Score = 0 + 0 + 0.5 - 0 = 0.5

Candidate B: "PS1 retro graphics, horror aesthetic"
  - Overlap tokens: 0
  - Affinity: 1 (Style keywords: "retro" aligns with aesthetic tone)
  - Priority: 50/100 = 0.5
  - Conflicts: 0
  - Score = 0 + 1 + 0.5 - 0 = 1.5

→ Candidate B wins (score 1.5 > 0.5)
```

---

## 4. AI Gate Prompts

When the compiler runs in AI mode, each gate type sends a specific system prompt + user prompt to the configured LLM provider. Here are all five prompts:

### AND Gate — Merge & Rank

**System**: You are the AI compiler for an "AND Gate" inside a visual prompt-building IDE. Your job is to take the current positive prompt baseline and merge it with two new prompt fragments (A and B). You must merge them into a single, cohesive positive prompt: (1) rank foundational elements (subjects, environments) first, style/modifiers later; (2) remove duplicates or highly redundant statements; (3) maintain proper flow. Respond with ONLY the optimized, merged positive prompt text, no markdown, no quotes, no extra commentary.

**User Template**:
```
Baseline Positive Prompt So Far:
"{baseline}"

New Fragment A: "{A}"
New Fragment B: "{B}"

Return the merged prompt:
```

**Response**: Plain text — the merged prompt string.

---

### OR Gate — Context Selection

**System**: You are the AI compiler for an "OR Gate" inside a visual prompt-building IDE. Your job is to read the current positive prompt context and evaluate two competing candidate prompt fragments (A and B). You must select the SINGLE best candidate that is most semantically compatible with the current context, explain your choice in one sentence, and output the updated positive prompt. Respond with STRICT JSON in this format: {"selected": "A" or "B", "reason": "Your brief explanation", "updated_prompt": "The consolidated prompt including the chosen candidate"}

**Response**: JSON with `selected`, `reason`, `updated_prompt` fields.

---

### NOT Gate — Explicit Negation

**System**: You are the AI compiler for a "NOT Gate" inside a visual prompt-building IDE. Your job is to read the current prompt baseline and a concept to suppress (A). You must: (1) strip any positive trace or reference of A from the prompt if it exists, (2) append a natural clause or instruction explicitly stating not to do, use, or include A and related concepts (e.g. "avoid A", "without A", "do not include A"). Respond with STRICT JSON in this format: {"updated_positive": "The sanitized prompt with explicit negation instructions built-in"}

**Response**: JSON with `updated_positive` string field.

---

### Ask AI Questions — Gap Analysis

**System**: You are an expert AI prompt engineer. Your job is to analyze the positive prompt compiled so far, identify any gaps, ambiguities, or unclear stylistic directions, and generate a list of exactly {count} crucial clarifying questions...

**Response**: JSON with `questions` array.

*(If previously asked questions exist, the system prompt adds a constraint to avoid duplicate questions.)*

---

### Provide Answers — Prompt Refinement

**System**: You are an expert AI prompt engineer. Your job is to take a baseline positive prompt, a list of clarifying questions, and the user's typed answers, and synthesize them into a single, cohesive, highly optimized positive prompt...

**Response**: Plain text — the refined prompt string.

---

## 5. Error Handling & Fallbacks

If any AI call fails (network error, invalid key, rate limit), the compiler:
1. Records an error stage in the pipeline trace
2. Falls back to rule-based logic for that specific gate
3. Continues executing the remaining gates normally
4. Shows a toast notification with the error message

This means compilation **never fully fails** — it degrades gracefully to offline mode on a per-gate basis.

---

## 6. Domain-Specific Offline Question Banks

When the `AskAIQuestions` logic runs in rule-based mode, it doesn't serve a single hardcoded list of questions. Instead, it utilizes the detected domain from the **Priority Manager** to select one of five specialized 10-question banks:

### A. Image Generation Domain (`image`)
1. What is the desired primary subject focus or perspective of the generation?
2. Are there specific color palettes, mood variables, or lighting constraints to prioritize?
3. What stylistic medium or resolution characteristics should be enforced?
4. What time of day or atmospheric weather effects should be present in the scene?
5. Are there any secondary background elements, props, or characters to place?
6. Should the visual style emulate a specific director, artist, or historical era?
7. What specific camera framing, lens focal length, or viewing angle should be used?
8. What kind of visual effects, grain, vignette, or post-processing is preferred?
9. Is there a specific level of detail, roughness, or cleanliness expected?
10. Are there negative elements or objects that must be completely absent?

### B. Code Generation & Programming Domain (`code`)
1. What is the primary programming language, framework, or runtime environment (e.g., Python 3.10, React 18 with TypeScript)?
2. What is the core business logic, algorithm, or function that this code must perform?
3. What are the expected input parameters and their exact data structures or schemas?
4. What is the expected return type, output format, or response structure?
5. Are there specific performance constraints, time/space complexities (e.g., O(N log N)), or execution memory limits?
6. Should the code follow a specific design pattern, standard, or paradigm (e.g., Functional, OOP, SOLID)?
7. What third-party libraries, modules, or dependencies are allowed or preferred for this implementation?
8. How should exceptions, boundary limits, and unexpected input edge cases be handled?
9. Are there specific unit testing requirements (e.g., Jest, PyTest) or mocking expectations?
10. What level of documentation, JSDoc schemas, or inline comments are expected in the final code?

### C. Bug Finding & Debugging Domain (`debug`)
1. What is the exact error message, warning label, or uncaught exception stack trace?
2. Can you provide the specific code snippet, function, or file name where the error occurs?
3. What was the expected correct behavior or output that should have occurred?
4. What is the actual incorrect behavior, output, or crash pattern happening instead?
5. What are the operating system, language runtime, or package dependency versions in this environment?
6. What recent changes, refactorings, or updates were made to the codebase before the bug appeared?
7. What troubleshooting steps, logging attempts, or fixes have you already tried?
8. Can you supply console logs, network response payloads, or database query dumps from the time of the crash?
9. What system state, database records, or input data trigger this specific bug?
10. Are there strict resolution constraints, such as keeping the fix backward-compatible or avoiding core refactorings?

### D. Software Architecture & System Design Domain (`architecture`)
1. What are the primary business goals, target scale (e.g., 10M DAU), and throughput/latency requirements?
2. Which architectural style or system pattern is preferred (e.g., Microservices, Monolithic, Event-Driven)?
3. What database engine, storage format, caching layer, or indexing strategy should be adopted?
4. What is the preferred tech stack, hosting provider (AWS, GCP), and container orchestrator (Kubernetes)?
5. What are the most critical non-functional requirements (e.g., scalability, high availability, maintainability)?
6. Which communication protocols and message brokers should connect the services (e.g., gRPC, REST, Kafka)?
7. What are the user authentication, data privacy, and security compliance constraints (e.g., OAuth2, GDPR)?
8. What kind of continuous integration, deployment pipeline, and monitoring systems are required (e.g., Prometheus, Grafana)?
9. Are there strict hosting budgets, infrastructure costs, or physical resource limits to respect?
10. What are the integration touchpoints with legacy systems or external third-party API services?

### E. GUI & UI/UX Design Domain (`gui`)
1. What is the target platform (Web, Mobile, Desktop) and target screen size (Responsive, Mobile-first)?
2. What core visual components (e.g., sidebar navigation, dashboard widgets, modal drawers) must be present?
3. What is the preferred color palette, theme orientation (dark mode, light mode), or HSL brand tokens?
4. What font families, typography weights, and text scaling rules should be applied?
5. What micro-animations, hover transition effects, or visual loading feedback states are required?
6. Which CSS framework, component library, or custom styling rules should be used (e.g., Tailwind CSS, Vanilla CSS)?
7. What are the specific accessibility guidelines (a11y), screen-reader properties, or keyboard navigations to implement?
8. What margin, padding, border radius, and flexbox/grid layout spaces should govern the components?
9. What graphical assets, SVG vectors, icon styles (e.g., Lucide), or logotypes must be integrated?
10. Are there specific responsive breakpoints or container width limitations to enforce?

---

## 7. Multi-Depth Compilation Formatting

The PLG semantic compiler implements three Compilation Depth settings. These modes format the final compiled prompt in varying structures and styles depending on the user's needs.

### Normal Mode (Raw Element Assembly)
*   **Purpose**: Returns the compiled visual prompt elements sorted strictly by their semantic category priority weights.
*   **Behavior**: Combines the kept (de-conflicted) prompt elements into a flat comma-separated list of visual tokens.
*   **Output Example**: `"abandoned hospital, corridor, standing, dark, neon lighting, ps1 style, grain"`

### Thinking Mode (Natural Language Rephrasing)
*   **Purpose**: Weaves raw, disconnected visual tokens into a coherent, highly detailed, and beautifully styled natural-language paragraph.
*   **AI Prompt**:
    ```text
    You are a professional prompt architect. Your task is to take a raw list of prompt tokens and rephrase them into a cohesive, natural, highly detailed, and beautifully styled positive prompt. Enhance the visual descriptors, vocabulary, and sensory details while retaining all original concepts. Output ONLY the rephrased prompt itself, with NO quotes, NO introductory text, and NO markdown.
    ```
*   **Offline/Rule-Based Fallback**:
    If AI mode is disabled or fails, the compiler uses a categorization-grouped template compiler (`offlineThinkingRephrase`) that structures the elements:
    ```text
    A masterpiece showcasing [Subject] [Action] set within a highly detailed [Environment], evoking a strong sense of [Emotion]. The scene is beautifully illuminated with [Lighting] lighting, captured from a stunning [Camera] perspective. The artistic aesthetic is rendered in [Style] style with subtle [Effects] visual effects. Enriched with intricate details including [Detail].
    ```

### DeepThinking Mode (Technical Visual Specification Document)
*   **Purpose**: Formulates an exhaustive visual specification document, detailing every category of the visual environment, style, and camera composition.
*   **AI Prompt**:
    ```text
    You are a principal prompt architect and visual director. Your task is to compile the given visual prompt elements into an exhaustive, highly structured prompt specification document. 
    Organize the output into these distinct sections using a premium Markdown layout:
    
    # VISUAL SPECIFICATION DOCUMENT
    
    ## 1. PRIMARY SUBJECT & DIRECTIVES
    - **Focus**: [Subject details]
    - **Action/Narrative**: [Vivid description of subject actions]
    - **Emotional Profile**: [Expressions and mood]
    
    ## 2. ENVIRONMENT & SPACE
    - **Location & Architecture**: [Spatial settings and background elements]
    - **Atmosphere & Depth**: [Climate, depth levels, and environmental details]
    
    ## 3. LIGHTING & COMPOSITION
    - **Lighting setup**: [Types, directions, colors, and shadows]
    - **Camera Framing**: [Shot type, lens, angle, and distance]
    
    ## 4. STYLE & TECHNICAL ARTISTRY
    - **Art Medium**: [Style description, artistic emulations]
    - **Effects & Grading**: [Grain, lens effects, particles, post-processing]
    
    ## 5. NEGATIVE INHIBITIONS
    - **Explicitly Suppress**: [Instruct to avoid these negative concepts: {activeNegative}]
    
    Integrate all raw prompt elements naturally. Do not include meta-commentary or preambles. Output ONLY the beautifully structured Markdown specifications block.
    ```
*   **Offline/Rule-Based Fallback**:
    Invokes `offlineDeepThinkingSpec`, which dynamically structures all visual parameters connected to the canvas into a visual specifications Markdown outline, listing each element under its technical category, and appending a detailed list of negative inhibitions to suppress.

---

## 8. Context Memory Compiler Gate

The **Context Memory Compiler Gate** processes the compiled prompt state against the visual memory ledger. It guarantees that generated prompts are fully aligned with codebase conventions and casing constraints.

### A. AI Invariant Prompt Constraints (AI Mode)
When compiling a visual prompt graph with an active `contextMemory` connection in **AI Mode**, the compiler automatically appends a strict technical constraint instruction to the system prompt of downstream gates (including rephrasing engines in Thinking and DeepThinking modes):

```text
CRITICAL CONSTRAINT: You MUST preserve and exactly employ the casing, spelling, variables, and function names present in the following Context Memory. Do not translate, paraphrase or modify them:
[Extracted Context Memory Ledger]
```

This prevents the LLM from translating camelCase or snake_case technical keys into natural-language terms.

### B. Offline Lexical Casing Corrections
In **Offline (Rule-based) Mode**, the compiler parses the Markdown memory ledger into a terms-to-rules map. For every variable signature, function, or entity hint extracted from the files:
1.  It escapes regex meta-characters to form a strict word search.
2.  It runs a case-insensitive search (`\b[escapedTerm]\b`, `gi`) across the compiled prompt baseline.
3.  If a match is found, the compiler performs an **in-place lexical word swap** to restore the exact, case-sensitive variable casing defined in the memory ledger.

### C. Semantic Rules Injection Formula
If a matched memory term also includes a corresponding constraint rule or description, the compiler appends it as a direct visual directive sentence at the very end of the baseline:

$$\text{Prompt} = \text{Baseline Prompt} + \text{" Enforce [Term]: [Description]."}$$

This ensures that rule-based compiles remain fully aligned with technical constraints and directive instructions without requiring external API calls, keeping the tone active and command-oriented without referencing raw technical documents in the final output.

### D. Context Memory Verification Check
At the end of the compilation execution, a validation pass checks the fully compiled prompt against the extracted memory keywords:
- **Green Stage (`✓ Checked and matched [N] exact memory term(s)`)**: Verified that at least one extracted variable, function signature, or technical key is present in the Compiled Prompt with exact case-sensitive spelling.
- **Amber Stage (`⚠ Context Memory loaded but no exact terms matched`)**: Alerts the user that a memory bank is loaded, but the compiled prompt does not utilize any of the indexed variables or casing invariants. This guides developers in debugging spelling bugs before exporting.
- **Grey Stage (`No Context Memory Node active`)**: Silent info card indicating no memory bank is connected to the canvas.

