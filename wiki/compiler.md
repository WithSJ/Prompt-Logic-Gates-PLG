---
category: wiki-concept
updated: 2026-05-30
tags: [plg, compiler, prompts, engineering]
---

# Semantic Compiler Engine: Rules & Prompts Specification

This document details the categories, keywords, conflict matrices, affinity scoring formulas, and LLM core prompts used inside the PLG compilation engine ([semanticCompiler.js](file:///c:/Users/jadam/Desktop/PLG/src/compiler/semanticCompiler.js)).

---

## 1. Categorization Keywords & Priorities

The compiler employs an offline rule-based dictionary categorizing prompt fragments into 9 core dimensions. Each category carries a **priority weight** to enforce proper prompt structure (subject first, environmental details later, styles and effects at the end).

| Category Name | Identifier | Priority | Sample Core Keywords |
| :--- | :--- | :--- | :--- |
| **Subject** | `subject` | `100` | man, woman, creature, ghost, zombie, portrait, entity, face |
| **Environment** | `environment` | `90` | hospital, forest, city, ruins, dungeon, background, hallway |
| **Action** | `action` | `80` | running, standing, screaming, floating, crawling, staring |
| **Emotion** | `emotion` | `70` | scary, eerie, unsettling, peaceful, melancholic, sinister |
| **Lighting** | `lighting` | `60` | dark, candles, moonlight, neon, volumetric, shadows |
| **Style** | `style` | `50` | ps1, ps2, realistic, cartoon, anime, low poly, watercolor, retro |
| **Camera** | `camera` | `40` | close-up, wide shot, fisheye, macro, dutch angle, tracking, pov |
| **Effects** | `effects` | `30` | grain, particles, glitch, vignette, chromatic aberration, bloom |
| **Detail** | `detail` | `45` | *(Fallback for general descriptors, has no custom keyword catalog)* |

---

## 2. Rule-Based Conflict Matrix

To prevent stylistic contradictions (e.g., prompting for a highly realistic cartoon), the compiler matches tokens against a 2D conflict matrix:

```javascript
export const CONFLICTS = [
  ['realistic','cartoon'], ['photorealistic','cartoon'], ['realistic','anime'], ['photorealistic','anime'],
  ['realistic','toon'], ['hyperrealistic','pixel'], ['dark','bright'], ['day','night'], ['dawn','dusk'],
  ['colorful','monochrome'], ['detailed','minimalist'], ['cute','horror'], ['cute','terrifying'],
  ['peaceful','terrifying'], ['happy','horror'], ['calm','chaotic'], ['clean','grunge']
];
```

### Context Overlap Score Formula
When evaluating compatibility, the compiler calculates the overlap weight:
$$\text{Score} = (\text{Overlap Tokens} \times 2) + \text{Category Affinity} + \left(\frac{\text{Priority}}{100}\right) - \text{Conflicts Penalty}$$

Where:
-   **Overlap Tokens**: Common words shared between the candidate and the baseline positive stream (multiplied by 2).
-   **Category Affinity**: Added ($+1$) if the candidate category's keywords already exist in the baseline context text.
-   **Priority Weight**: Normalised contribution from the categories dictionary.
-   **Conflicts Penalty**: Deducts $3.0$ points for every matched conflict term pair.

---

## 3. LLM Gate Prompts Specification

When in **AI Mode**, the compiler bypasses offline rules and triggers direct prompt generation prompts to the active AI endpoint.

### A. AND Gate (Conjunction)
*   **System Prompt**:
    ```text
    You are the AI compiler for an "AND Gate" inside a visual prompt-building IDE. Your job is to take the current positive prompt baseline and merge it with two new prompt fragments (A and B). You must merge them into a single, cohesive positive prompt: (1) rank foundational elements (subjects, environments) first, style/modifiers later; (2) remove duplicates or highly redundant statements; (3) maintain proper flow. Respond with ONLY the optimized, merged positive prompt text, no markdown, no quotes, no extra commentary.
    ```
*   **User Input**:
    ```text
    Baseline Positive Prompt So Far:
    "{baselinePos}"

    New Fragment A: "{A}"
    New Fragment B: "{B}"

    Return the merged prompt:
    ```

### B. OR Gate (Context Selector)
*   **System Prompt**:
    ```text
    You are the AI compiler for an "OR Gate" inside a visual prompt-building IDE. Your job is to read the current positive prompt context and evaluate two competing candidate prompt fragments (A and B). You must select the SINGLE best candidate that is most semantically compatible with the current context, explain your choice in one sentence, and output the updated positive prompt. Respond with STRICT JSON in this format: {"selected": "A" or "B", "reason": "Your brief explanation", "updated_prompt": "The consolidated prompt including the chosen candidate"}
    ```
*   **User Input**:
    ```text
    Baseline Positive Prompt Context So Far:
    "{baselinePos}"

    Candidate Prompt A: "{A}"
    Candidate Prompt B: "{B}"

    Return JSON:
    ```

### C. NOT Gate (Negation Routing)
*   **System Prompt**:
    ```text
    You are the AI compiler for a "NOT Gate" inside a visual prompt-building IDE. Your job is to read the current prompt baseline and a concept to suppress (A). You must: (1) strip any positive trace or reference of A from the prompt if it exists, (2) append a natural clause or instruction explicitly stating not to do, use, or include A and related concepts (e.g. "avoid A", "without A", "do not include A"). Respond with STRICT JSON in this format: {"updated_positive": "The sanitized prompt with explicit negation instructions built-in"}
    ```
*   **User Input**:
    ```text
    Baseline Prompt:
    "{baselinePos}"

    Concept to Suppress (NOT A): "{A}"

    Return JSON:
    ```

### D. Ask AI Questions (Clarification Generator)
*   **System Prompt**:
    ```text
    You are an expert AI prompt engineer. Your job is to analyze the positive prompt compiled so far, identify any gaps, ambiguities, or unclear stylistic directions, and generate a list of exactly {count} crucial clarifying questions that the user should answer to make the prompt perfect.
    If the prompt is empty or very short, ask foundational questions about what the user wants to create.
    You must respond with STRICT JSON containing a list of strings: {"questions": ["Clarifying question 1", ..., "Clarifying question {count}"]}. No commentary, no markdown.
    ```
    *(If preceding questions exist, the system appends)*:
    ```text
    CRITICAL CONSTRAINT: You MUST NOT ask any questions that are semantically identical or highly similar to the following questions which have ALREADY been asked:
    {excludedQs}
    Generate {count} entirely NEW and different questions.
    ```

### E. Provide Answers (Prompt Refiner)
*   **System Prompt**:
    ```text
    You are an expert AI prompt engineer. Your job is to take a baseline positive prompt, a list of clarifying questions, and the user's typed answers, and synthesize them into a single, cohesive, highly optimized positive prompt.
    You must:
    1. Merge the answers naturally and seamlessly into the flow of the baseline prompt.
    2. Maintain proper structure (foundational details first, modifier elements later).
    3. Do NOT include the questions or literal "Clarification on Q..." strings. Just output the refined, integrated prompt text.
    4. Keep the output extremely clean. Respond with ONLY the optimized, merged positive prompt text. No markdown, no quotes, no extra commentary.
    ```

---

## 4. Multi-Depth Compilation Modes

The semantic compiler supports three distinct compilation depth settings (Normal, Thinking, and DeepThinking), allowing the visual circuit output to be formatted in different levels of density and styling.

### A. Normal Mode
*   **Behavior**: Executes the topological compilation and outputs the final de-conflicted baseline list of visual tokens separated by commas.
*   **Aesthetic**: Direct, clean, and optimized for immediate baseline parsing.

### B. Thinking Mode (Polished Narrative)
*   **AI Prompt**:
    ```text
    You are a professional prompt architect. Your task is to take a raw list of prompt tokens and rephrase them into a cohesive, natural, highly detailed, and beautifully styled positive prompt. Enhance the visual descriptors, vocabulary, and sensory details while retaining all original concepts. Output ONLY the rephrased prompt itself, with NO quotes, NO introductory text, and NO markdown.
    ```
*   **Offline/Rule-Based Fallback**:
    Filters kept visual elements and groups them by their visual category. Synthesizes a structured natural paragraph:
    ```text
    A masterpiece showcasing [Subject] [Action] set within a highly detailed [Environment], evoking a strong sense of [Emotion]. The scene is beautifully illuminated with [Lighting] lighting, captured from a stunning [Camera] perspective. The artistic aesthetic is rendered in [Style] style with subtle [Effects] visual effects. Enriched with intricate details including [Detail].
    ```

### C. DeepThinking Mode (Exhaustive Technical Specification)
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
    
    ## 5. NEGATIVE DIRECTIVES
    - **Explicitly Suppress**: [Instruct to avoid these negative/suppressed concepts]
    
    Integrate all raw prompt elements naturally. Do not include meta-commentary or preambles. Output ONLY the beautifully structured Markdown specifications block.
    ```
*   **Offline/Rule-Based Fallback**:
    Outputs a premium visual specifications document in Markdown structure, complete with bulleted category lists for all connected visual nodes, and a dedicated negative directives section.

