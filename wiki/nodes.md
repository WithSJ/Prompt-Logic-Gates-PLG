---
category: wiki-concept
updated: 2026-05-29
tags: [plg, references, nodes, documentation]
---

# Visual Nodes Reference Guide

This document is the API-grade reference guide for all visual program nodes inside the Prompt Logic Gates workspace.

---

## 🗂️ Node Port Types & Handles

Handles represent strict connection filters in the Visual Flow Editor. Connecting incompatible ports is prevented by React Flow handle constraints.

| Port ID | Stylized Handle CSS Class | Target/Source Data Shape | Connection Color |
| :--- | :--- | :--- | :--- |
| `file` | `className="file"` | File Baseline `{ positive: "", negative: "" }` | Silver / Grey |
| `prompt` | `className="prompt"` | Raw Text String (Fragment) | Cyan / Sky Blue |
| `questions` | `className="questions"` | Clarifying Questions Array `["Question 1", ...]` | Vibrant Orange |

---

## 🏗️ 1. Source Nodes

These nodes initialize data streams and serve as the circuit's head-water inputs.

### File Node
*   **Unique Identifier**: `fileNode`
*   **Role**: Initializes the file baseline stream. Represents a single `.txt` baseline file.
*   **Fields**:
    *   `filename`: Input text box changing the file target (e.g. `prompt.txt`).
*   **Handles**:
    *   **Source** (Right): `file` - Outputs the baseline stream.

### Prompt Box
*   **Unique Identifier**: `promptBox`
*   **Role**: Provides a raw text fragment input.
*   **Fields**:
    *   `text`: Textarea input where the user types a prompt segment (e.g. `cinematic lighting, film grain`).
*   **Handles**:
    *   **Source** (Right): `out` - Outputs the raw prompt string.

---

## ⚡ 2. Logic Operators (Gates)

These nodes execute compilation modifications on the baseline stream.

### AND Gate
*   **Unique Identifier**: `and`
*   **Role**: Intersects new details into the active stream.
*   **Handles**:
    *   **Target** (Left):
        *   `file` - Primary input baseline stream.
        *   `a` (Prompt) - Fragment A to merge.
        *   `b` (Prompt) - Fragment B to merge.
    *   **Source** (Right):
        *   `file` - Merged output baseline stream.

### OR Gate
*   **Unique Identifier**: `or`
*   **Role**: Compares two competing fragments and keeps the best semantic fit.
*   **Handles**:
    *   **Target** (Left):
        *   `file` - Baseline context stream.
        *   `a` (Prompt) - Competing Fragment A.
        *   `b` (Prompt) - Competing Fragment B.
    *   **Source** (Right):
        *   `file` - Baseline stream updated with the chosen candidate.

### NOT Gate
*   **Unique Identifier**: `not`
*   **Role**: Excises concepts from the positive baseline and routes them to the negative baseline.
*   **Handles**:
    *   **Target** (Left):
        *   `file` - Input baseline stream.
        *   `a` (Prompt) - Concept to suppress.
    *   **Source** (Right):
        *   `file` - Sanitized baseline stream (carrying additions in the negative baseline).

---

## 🤖 3. AI Conversational Gates

Interactive nodes that trigger direct LLM query/clarification processes.

### Ask AI Questions
*   **Unique Identifier**: `askQuestion`
*   **Role**: Analyzes the baseline stream, flags ambiguities, and outputs critical clarifying questions.
*   **Fields**:
    *   `numQuestions`: Number input configuring count of questions to generate (Min: 1, Max: 10, Default: 3).
*   **Handles**:
    *   **Target** (Left):
        *   `file` - Input baseline stream.
        *   `questions` - List of questions already asked (allows chaining nodes without asking redundant questions).
    *   **Source** (Right):
        *   `questions` - Output list of generated clarifying questions.

### Provide Answers
*   **Unique Identifier**: `answerQuestions`
*   **Role**: Displays the Clarifying Questions array, lets the user type answers, and refines the baseline stream using that Q&A context.
*   **Fields**:
    *   `answers`: Collection of textareas bound to each incoming question index.
*   **Handles**:
    *   **Target** (Left):
        *   `questions` - Incoming clarifying questions list.
        *   `file` - Baseline input stream.
    *   **Source** (Right):
        *   `out` (Prompt) - Outputs ONLY the refined, standalone answer fragment.
        *   `file` - Outputs the integrated, consolidated baseline stream.

---

## 🔀 4. Data Type Converters & Operators

Helper nodes translating between Raw Prompt string states and File Baseline states.

### Prompt Concat
*   **Unique Identifier**: `promptConcat`
*   **Role**: Joins multiple incoming raw prompts into a single comma-separated prompt string.
*   **Fields**:
    *   `numInputs`: Numeric input configuring number of left handles (Min: 2, Max: 10).
*   **Handles**:
    *   **Target** (Left): Dynamic list of `p0`, `p1`, `p2` ... up to `numInputs` (Prompt type).
    *   **Source** (Right): `out` - Joined prompt string.

### File to Prompt
*   **Unique Identifier**: `fileToPrompt`
*   **Role**: Extracts the active positive state of a file baseline stream and emits it as a raw prompt string.
*   **Handles**:
    *   **Target** (Left): `file` - Input baseline stream.
    *   **Source** (Right): `out` (Prompt) - Extracted active positive prompt string.

### Prompt to File
*   **Unique Identifier**: `promptToFile`
*   **Role**: Takes a raw prompt string and converts it into a fresh, clean file baseline stream (clearing any prior baseline state).
*   **Handles**:
    *   **Target** (Left): `prompt` - Input prompt string.
    *   **Source** (Right): `file` - Initialized output baseline stream.

---

## 👁️ 5. Monitors & Outputs

### Prompt File Viewer
*   **Unique Identifier**: `fileViewer`
*   **Role**: Realtime visual monitor displaying the finalized state of compiled positive and negative prompts.
*   **Constraint**:
    > [!IMPORTANT]
    > **Singleton Constraint**: To ensure execution safety and prevent duplicated outputs, only one **Prompt File Viewer** node is allowed in the workspace at any time. Adding a second viewer will throw an error toast.
*   **Handles**:
    *   **Target** (Left): `file` - Finalized baseline stream.
    *   **Source** (Right): `file` - Passthrough baseline stream.
