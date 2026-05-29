---
category: documentation
updated: 2026-05-29
tags: [plg, nodes, components, reference]
---

# Nodes Guide — Complete Reference

This is the definitive guide to every node type in PLG. Each section covers: what the node does, its input/output handles, its internal fields, and practical usage examples.

---

## Handle Color Legend

Before diving into nodes, understand the three handle types:

| Handle Color | CSS Class | Data Type | Description |
| :--- | :--- | :--- | :--- |
| 🟡 **Amber/Gold** | `.file` | File Baseline `{positive, negative}` | Carries the evolving prompt state |
| 🔵 **Cyan** | `.prompt` | Raw text string | A single prompt fragment |
| 🟠 **Orange** | `.questions` | String array | Clarifying questions list |

**Rule**: Only matching colors can connect. Each input accepts exactly one connection.

---

## 1. File Node

> The single source of truth. Every circuit starts here.

**Type ID**: `fileNode`  
**Category**: Source  
**Palette Icon**: `.txt`

### What It Does
Initializes the file baseline stream with empty positive and negative strings. Think of it as the blank canvas that downstream gates write to.

### Fields
| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `filename` | Text input | `prompt.txt` | Label for the output file (used in exports) |

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Right | `file` | Source (Amber) | Outputs the empty baseline stream |

### Usage Example
```
[File Node: "scene-01.txt"] ──▶ [AND Gate] ──▶ ...
```

Every circuit needs at least one File Node. It doesn't contain prompt text itself — it just starts the pipeline. The filename is used when you export the compiled prompt to `.txt`.

---

## 2. Prompt Box

> A typed prompt fragment — the raw building block.

**Type ID**: `promptBox`  
**Category**: Source  
**Palette Icon**: `"…"`

### What It Does
Holds a text string that you write. This is your creative input. Connect it to gate inputs (A, B, prompt, or p0/p1/etc.) to feed prompt fragments into the compilation pipeline.

### Fields
| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `text` | Textarea | (empty) | The prompt fragment text |

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Right | `out` | Source (Cyan) | Outputs the raw text string |

### Usage Example
```
[Prompt Box: "abandoned hospital, broken windows"] ──▶ AND Gate (input A)
```

### Tips
- Keep fragments focused: one concept per box
- Use descriptive fragments: "cinematic low angle shot, 35mm lens" rather than just "cinematic"
- Multiple boxes can connect to different gates to build complex circuits

---

## 3. AND Gate

> Merges two prompt fragments into the baseline. Conjunction logic.

**Type ID**: `and`  
**Category**: Logic Gate  
**Palette Icon**: `&`

### What It Does
Takes the current file baseline and merges two new prompt fragments (A and B) into it.

- **Rule mode**: Appends A and B to the positive prompt array, then sorts all terms by category priority (Subject=100, Environment=90, ... Effects=30)
- **AI mode**: Sends the baseline + A + B to the AI with instructions to produce a single cohesive merged prompt

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Left | `file` | Target (Amber) | Input file baseline stream |
| Left | `a` | Target (Cyan) | Prompt fragment A |
| Left | `b` | Target (Cyan) | Prompt fragment B |
| Right | `file` | Source (Amber) | Updated file baseline |

### Usage Example
```
[File Node] ──file──▶ [AND Gate] ──file──▶ [next gate or viewer]
                         ▲  ▲
[Prompt: "dark forest"] ─a┘  │
[Prompt: "foggy path"]  ─b───┘
```

**Result** (rule mode): `dark forest, foggy path` (sorted by category priority)

### What Happens If...
- Only A is connected: A alone is merged into baseline
- Only B is connected: B alone is merged into baseline
- Neither connected: Gate passes baseline through unchanged
- No file input: Baseline starts from empty string

---

## 4. OR Gate

> Selects the best-fitting fragment from two candidates. Context selection.

**Type ID**: `or`  
**Category**: Logic Gate  
**Palette Icon**: `≥1`

### What It Does
Takes two competing prompt fragments and picks the one that best fits the existing baseline context.

- **Rule mode**: Computes a **context overlap score** for each candidate:
  - `Score = (shared_tokens × 2) + category_affinity + (priority/100) - (conflicts × 3)`
  - Picks the candidate with the highest score
- **AI mode**: Sends baseline + A + B to the AI, which selects the better fit and explains why

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Left | `file` | Target (Amber) | Input baseline stream |
| Left | `a` | Target (Cyan) | Competing candidate A |
| Left | `b` | Target (Cyan) | Competing candidate B |
| Right | `file` | Source (Amber) | Baseline updated with chosen candidate |

### Usage Example
```
Baseline: "abandoned hospital, dark hallway"

Candidate A: "realistic photograph, 8K resolution"
Candidate B: "PS1 retro graphics, low-poly textures"

→ OR Gate (rule mode) picks "PS1 retro graphics, low-poly textures"
  because "dark hallway" + "PS1 retro" share more aesthetic affinity
  than "dark hallway" + "realistic photograph" (which conflicts less
  but has fewer token overlaps with the horror mood)
```

### When to Use
- You have two competing style directions and want the compiler to choose
- You want to A/B test different aesthetic approaches
- You're building a circuit that needs conditional style selection

---

## 5. NOT Gate

> Suppresses a concept. Routes it to the negative prompt.

**Type ID**: `not`  
**Category**: Logic Gate  
**Palette Icon**: `¬`

### What It Does
Takes a concept to forbid, removes any trace of it from the positive prompt, and adds it to the negative prompt.

- **Rule mode**: Scans the positive prompt array, removes any term containing the suppressed concept, appends the concept to the negative array
- **AI mode**: Sends baseline + concept to the AI, which sanitizes the positive prompt and suggests additional negative terms

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Left | `file` | Target (Amber) | Input baseline stream |
| Left | `a` | Target (Cyan) | Concept to suppress |
| Right | `file` | Source (Amber) | Sanitized baseline (negative updated) |

### Usage Example
```
Baseline positive: "dark hospital, cute cartoon style, fog"
Suppress: "cute cartoon style"

→ NOT Gate output:
    Positive: "dark hospital, fog"
    Negative: "cute cartoon style"
```

### AI Mode Bonus
In AI mode, the NOT gate doesn't just remove the literal text — it analyzes semantic relationships. If you suppress "cute", the AI might also add "kawaii", "chibi", "adorable" to the negative prompt.

---

## 6. Ask AI Questions

> Generates clarifying questions to fill gaps in your prompt.

**Type ID**: `askQuestion`  
**Category**: Human-in-the-Loop  
**Palette Icon**: `?`

### What It Does
Analyzes the current baseline prompt and identifies ambiguities, gaps, or missing details. Generates a configurable number of clarifying questions.

- **Rule mode**: Returns questions from a pre-built offline question bank (10 template questions about camera, style, mood, etc.)
- **AI mode**: Sends the baseline to the AI, which generates contextually relevant questions

### Fields
| Field | Type | Default | Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| `numQuestions` | Number input | 3 | 1–10 | How many questions to generate |

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Left | `file` | Target (Amber) | Input baseline stream (context for questions) |
| Left | `questions` | Target (Orange) | Previously asked questions (to avoid duplicates) |
| Right | `questions` | Source (Orange) | Generated questions array |

### Smart Question Management
- If you change the question count from 3→5, the compiler keeps the first 3 existing questions and generates 2 new ones
- If you change from 5→3, it truncates to the first 3
- Chaining two Ask Questions nodes: connect the first node's `questions` output to the second node's `questions` input. The second node will avoid asking the same questions.

---

## 7. Provide Answers

> Displays questions and lets you type answers. Refines the prompt.

**Type ID**: `answerQuestions`  
**Category**: Human-in-the-Loop  
**Palette Icon**: `✓`

### What It Does
Receives a questions array from an Ask AI Questions node, displays each question with a textarea for your answer, and integrates those answers into the prompt.

- **Rule mode**: Concatenates all non-empty answers with commas and appends to the baseline
- **AI mode**: Sends the baseline + all Q&A pairs to the AI for intelligent synthesis

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Left | `questions` | Target (Orange) | Incoming questions array |
| Left | `file` | Target (Amber) | Input baseline stream |
| Right | `out` | Source (Cyan) | Refined prompt as text fragment |
| Right | `file` | Source (Amber) | Full integrated baseline output |

### Dual Output Modes
This node has **two** output handles — use whichever fits your circuit:
- **`file` output**: The complete baseline with answers integrated. Use this to continue the file stream pipeline.
- **`out` (prompt) output**: Just the refined answer text as a standalone prompt fragment. Use this to feed into another gate's prompt input.

### Reactive Sync
When you connect an Ask Questions node to this node, the questions appear **immediately** without needing to recompile. This is powered by a reactive `useEffect` hook in App.jsx.

---

## 8. Prompt Concat

> Joins multiple prompt fragments into one combined string.

**Type ID**: `promptConcat`  
**Category**: Data Operator  
**Palette Icon**: `++`

### What It Does
Takes 2–10 prompt text inputs and joins them with commas into a single prompt string.

### Fields
| Field | Type | Default | Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| `numInputs` | Number input | 2 | 2–10 | Number of prompt input handles |

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Left | `p0`, `p1`, `p2`... | Target (Cyan) | Dynamic prompt inputs |
| Right | `out` | Source (Cyan) | Combined prompt string |

### Usage Example
```
[Prompt: "dark forest"] ─p0─▶ [Prompt Concat] ──out──▶ [AND Gate input A]
[Prompt: "heavy fog"]   ─p1─┘      (→ "dark forest, heavy fog")
[Prompt: "moonlight"]   ─p2─┘
```

### When to Use
- You have many small prompt fragments that should be combined before entering a gate
- You want to organize prompts into logical groups (e.g., "all environment terms" → concat → feed to AND)

---

## 9. File to Prompt

> Converts a file baseline stream into a raw prompt string.

**Type ID**: `fileToPrompt`  
**Category**: Type Converter  
**Palette Icon**: `➜`

### What It Does
Reads the `positive` field of the incoming file baseline and outputs it as a raw text prompt. This lets you feed compiled file state into a gate's prompt input handle.

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Left | `file` | Target (Amber) | Input file baseline |
| Right | `out` | Source (Cyan) | Extracted positive text |

### Usage Example
```
[AND Gate] ──file──▶ [File to Prompt] ──out──▶ [OR Gate input A]
```

Use this when you need to re-route compiled state back into a prompt input — for example, comparing two different compiled paths in an OR gate.

---

## 10. Prompt to File

> Converts a raw prompt string into a fresh file baseline stream.

**Type ID**: `promptToFile`  
**Category**: Type Converter  
**Palette Icon**: `📄`

### What It Does
Takes a raw prompt text input and creates a new file baseline stream where:
- `positive` = the incoming prompt text
- `negative` = empty string (reset)

This effectively overwrites any previous baseline state.

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Left | `prompt` | Target (Cyan) | Input prompt text |
| Right | `file` | Source (Amber) | Fresh file baseline |

### Usage Example
```
[Provide Answers out] ──prompt──▶ [Prompt to File] ──file──▶ [NOT Gate]
```

Use this when you want to start a fresh file pipeline from a prompt fragment — for example, taking the output of a Provide Answers node and routing it through additional gates.

---

## 11. Prompt File Viewer

> Real-time monitor showing the compiled positive and negative prompts.

**Type ID**: `fileViewer`  
**Category**: Output Monitor  
**Palette Icon**: `👁`

### What It Does
Displays the current compiled state of the file baseline flowing into it. Shows both the positive prompt and the negative prompt in read-only text boxes.

### Handles
| Side | Handle ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Left | `file` | Target (Amber) | Input file baseline to display |
| Right | `file` | Source (Amber) | Passthrough output (for chaining) |

### Singleton Constraint

> ⚠️ **Only one File Viewer is allowed per workspace.**

If you try to add a second one, you'll get an error toast. This constraint prevents conflicting output displays and ensures the Inspector panel's state sync works correctly.

### Behavior
- Before compilation: Shows "empty baseline" / "none"
- After compilation: Shows the intermediate state at the viewer's position in the graph
- If connected to the end of the pipeline: Shows the final compiled output
- If connected mid-pipeline: Shows the state at that specific point (useful for debugging)

### Cannot Be Deleted
The File Viewer node's delete button is intentionally disabled. You can move it and disconnect it, but you cannot remove it from the workspace. If you clear the canvas, the File Viewer is preserved.
