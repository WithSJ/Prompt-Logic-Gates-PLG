---
category: documentation
updated: 2026-05-29
tags: [plg, compiler, categories, conflicts, scoring]
---

# Compiler Engine — Technical Reference

This document details the semantic compiler's internal logic: the categorization system, keyword dictionaries, priority weights, conflict matrix, context scoring formula, and the complete set of AI prompts.

Source file: [semanticCompiler.js](file:///c:/Users/jadam/Desktop/PLG/src/compiler/semanticCompiler.js) (916 lines)

---

## 1. The Multi-Domain Categorization System

Every prompt fragment is categorized into one of 9 semantic dimensions. Unlike single-domain compilers, the Prompt Logic Gates (PLG) compiler implements a **Multi-Domain Prompt Priority Schema** governed by the **Priority Manager**. Depending on the target domain, the priority weights and keyword lists change dynamically to construct optimal prompts for various LLM and generative tasks.

### The 5 Core Compilation Domains

The compiler supports five distinct execution domains. When a domain is selected, the corresponding category priorities and keywords are loaded:

1.  **Image Generation (`image`)**: (P=100) Subject ➔ (P=90) Environment ➔ (P=80) Action ➔ (P=70) Emotion ➔ (P=60) Lighting ➔ (P=50) Style ➔ (P=45) Detail ➔ (P=40) Camera ➔ (P=30) Effects.
2.  **Code Generation & Programming (`code`)**: (P=100) Language & Env ➔ (P=95) Core Functionality ➔ (P=85) I/O & Structure ➔ (P=75) Performance Rules ➔ (P=65) Coding Standards ➔ (P=55) Edge Cases ➔ (P=45) Libraries ➔ (P=35) Testing ➔ (P=25) Docs.
3.  **Bug Finding & Debugging (`debug`)**: (P=100) Error Stacktrace ➔ (P=95) Failing Code ➔ (P=85) Expected Output ➔ (P=80) Actual Behavior ➔ (P=70) Env State ➔ (P=60) Recent Changes ➔ (P=50) Attempted Fixes ➔ (P=40) Logs ➔ (P=30) Constraints.
4.  **Software Architecture & System Design (`architecture`)**: (P=100) Scale & Goals ➔ (P=90) Arch Pattern ➔ (P=80) Storage ➔ (P=70) Tech Stack ➔ (P=60) Quality Attributes ➔ (P=50) Protocols ➔ (P=40) Security ➔ (P=30) DevOps ➔ (P=20) Budget.
5.  **GUI & UI/UX Layout (`gui`)**: (P=100) Layout & Grid ➔ (P=90) UI Components ➔ (P=80) Theme & Palette ➔ (P=70) Typography ➔ (P=60) Transitions ➔ (P=50) Framework ➔ (P=40) Accessibility ➔ (P=30) Spacing ➔ (P=20) Assets.

For detailed keyword mappings and priority weights, see [wiki/priority_manager.md](file:///c:/Users/jadam/Desktop/PLG/wiki/priority_manager.md).

---

## 2. Dynamic Priority Manager

The **Priority Manager** sits inside the compilation pipeline. It analyzes the canvas node graph and input texts to determine the target domain, then dynamically swaps the active sorting and conflict resolution dictionaries.

### Classification Pathways (Hybrid Model)

The classifier operates in two modes corresponding to the user's active **Compiler Mode** setting:

*   **Offline Classification (Normal)**: Runs a fast, regex-based keyword density crawler across all inputs. It counts occurrences of specific domain-identifying tokens (e.g. matching code syntaxes `def`/`class`/`typescript` vs error labels `TypeError`/`stacktrace`/`crash`). The domain with the highest scoring matches is loaded.
*   **AI Classification (Thinking / DeepThinking)**: In active AI modes, the compiler executes a structured JSON categorization call to the configured LLM endpoint:
    ```json
    {"domain": "image" | "code" | "debug" | "architecture" | "gui", "reason": "Classification brief"}
    ```

---

## 3. Conflict Matrix

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

## 6. Offline Question Bank

When Ask AI Questions runs in rule-based mode, it draws from this hardcoded bank of 10 template questions:

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

