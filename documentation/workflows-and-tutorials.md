---
category: documentation
updated: 2026-05-29
tags: [plg, workflows, tutorials, examples]
---

# Workflows & Tutorials

Step-by-step guides for building practical prompt circuits in the PLG IDE.

---

## Tutorial 1: Basic Scene Composition (AND Gate)

**Goal**: Merge a subject, environment, and style into a single prompt.

### Circuit Diagram
```
[File Node] ──file──▶ [AND Gate 1] ──file──▶ [AND Gate 2] ──file──▶ [File Viewer]
                         ▲  ▲                    ▲  ▲
 [Prompt: "ghost nurse"] ─┘  │   [Prompt: "dim   ─┘  │
 [Prompt: "abandoned    ─────┘    flickering      ────┘
  hospital corridor"]              lights"]
                                  [Prompt: "PS1
                                   graphics style"]
```

### Steps

1. **Add a File Node**: Drag "File Node" from the palette. Name it `scene.txt`.
2. **Add Prompt Boxes**: Create 4 prompt boxes with:
   - `ghost nurse standing at end of hallway`
   - `abandoned hospital corridor, broken tiles`
   - `dim flickering fluorescent lights`
   - `PS1 graphics style, low-poly textures`
3. **Add two AND Gates**: Drag two AND gates onto the canvas.
4. **Wire AND Gate 1**:
   - File Node → AND Gate 1 (file handle)
   - "ghost nurse" → AND Gate 1 (input A)
   - "abandoned hospital" → AND Gate 1 (input B)
5. **Wire AND Gate 2**:
   - AND Gate 1 → AND Gate 2 (file handle)
   - "dim flickering" → AND Gate 2 (input A)
   - "PS1 graphics" → AND Gate 2 (input B)
6. **Add File Viewer**: Connect AND Gate 2 → File Viewer
7. **Compile**: Click the Compile button.

### Expected Output
```
Compiled Prompt: "ghost nurse standing at end of hallway, abandoned hospital corridor, broken tiles, dim flickering fluorescent lights, PS1 graphics style, low-poly textures"
```

The terms are automatically sorted by category priority: Subject (100) → Environment (90) → Lighting (60) → Style (50).

---

## Tutorial 2: Style A/B Testing (OR Gate)

**Goal**: Let the compiler choose between two competing art styles based on context.

### Circuit Diagram
```
[File Node] ──▶ [AND Gate] ──file──▶ [OR Gate] ──file──▶ [File Viewer]
                  ▲  ▲                  ▲  ▲
[Prompt:      ────┘  │    [Prompt:  ────┘  │
 "samurai"]          │     "oil             │
[Prompt:      ───────┘     painting"]       │
 "rain-soaked          [Prompt:      ───────┘
  neon city"]           "pixel art,
                         retro game"]
```

### Steps

1. Build the scene with an AND gate: samurai + neon city.
2. Add an OR gate.
3. Connect the AND gate's file output to the OR gate's file input.
4. Connect "oil painting, impressionist" to OR input A.
5. Connect "pixel art, retro game, 8-bit" to OR input B.
6. Connect OR gate output to File Viewer.
7. Compile.

### What Happens
- **Rule mode**: The compiler scores each candidate against the context. "Pixel art, retro game" likely scores higher because "neon" and "retro" share aesthetic affinity.
- **AI mode**: The AI reads the full scene and makes a contextual judgment, providing a one-sentence reason for its choice.

### Inspector Output
The pipeline debugger shows:
```
Stage 3: OR Gate
  [Rule-based Selection]
  Evaluated context overlap score (A vs B).
  Selected best fit: "pixel art, retro game, 8-bit"
  Dropped candidate: "oil painting, impressionist"
```

---

## Tutorial 3: Concept Suppression (NOT Gate)

**Goal**: Build a dark scene and explicitly forbid cheerful elements.

### Steps

1. Build a scene: File Node → AND Gate with "dark medieval castle" + "stormy night sky".
2. Add a NOT Gate.
3. Connect AND Gate → NOT Gate (file handle).
4. Add a Prompt Box: "bright sunny cheerful colors".
5. Connect it to NOT Gate input A.
6. Connect NOT Gate → File Viewer.
7. Compile.

### Result
```
Compiled Prompt: "dark medieval castle, stormy night sky (avoid bright sunny cheerful colors)"
```

In AI mode, the NOT gate might also append related terms or rephrase instructions to keep the suppressed concepts away, producing:
`Compiled Prompt: "dark medieval castle, stormy night sky (avoid bright sunny cheerful colors, no vibrant warm tones)"`

---

## Tutorial 4: Interactive AI Q&A Refinement

**Goal**: Start with a vague idea and use AI questions to flesh out the prompt.

### Circuit Diagram
```
[File Node] ──▶ [AND Gate] ──file──▶ [Ask Questions] ──questions──▶ [Provide Answers]
                  ▲  ▲                                                     │
[Prompt:      ────┘  │                 [AND Gate] ◀──file─────── [File Node]
 "explorer"]         │                     │
[Prompt:      ───────┘                     ▼
 "Mars surface"]                     [Provide Answers] ──file──▶ [File Viewer]
```

### Steps

1. **Build the base**: File Node → AND Gate with "lonely explorer" + "Mars surface, red dust".
2. **Add Ask AI Questions**: Connect AND Gate file output to Ask Questions file input. Set question count to 3.
3. **First Compile**: The Ask Questions node generates 3 questions:
   - "What is the desired primary subject focus or perspective?"
   - "Are there specific color palettes or lighting constraints?"
   - "What stylistic medium should be enforced?"
4. **Add Provide Answers**: Connect Ask Questions → Provide Answers (orange questions handle).
5. Connect the File Node → Provide Answers (file handle) for baseline context.
6. **Answer the questions** inside the Provide Answers node:
   - Q1: "Wide cinematic shot from behind, explorer looking at horizon"
   - Q2: "Sunset orange sky fading to deep purple, long shadows"
   - Q3: "Retro sci-fi concept art, Syd Mead style"
7. Connect Provide Answers → File Viewer (file handle).
8. **Second Compile**: The compiler reads your answers and refines the prompt.

### AI Mode Result
```
Positive: "Lonely explorer on Mars surface, red dust, wide cinematic shot
           from behind looking at distant horizon, sunset orange sky fading
           to deep purple, long dramatic shadows, retro sci-fi concept art
           in the style of Syd Mead, atmospheric perspective"
```

---

## Tutorial 5: Chaining Multiple Question Rounds

**Goal**: Ask two rounds of questions, with the second round avoiding duplicate questions.

### Steps

1. Build your base circuit as in Tutorial 4.
2. Add a **second** Ask AI Questions node.
3. Connect the **first** Ask Questions `questions` output → **second** Ask Questions `questions` input (orange-to-orange). This tells the second node to exclude already-asked questions.
4. Connect the first Provide Answers file output → second Ask Questions file input (for updated context).
5. Add a second Provide Answers node connected to the second Ask Questions output.
6. Compile → Answer first round → Compile again → Answer second round → Compile again.

Each round refines the prompt further with new, non-redundant questions.

---

## Tutorial 6: Using Type Converters

**Goal**: Take compiled output from one pipeline and feed it as a prompt fragment into another pipeline.

### When to Use File to Prompt
```
Pipeline A: [File Node] → [AND Gate] → [File to Prompt] ──prompt──▶ [OR Gate input A]
Pipeline B: [File Node] → [AND Gate] → [File to Prompt] ──prompt──▶ [OR Gate input B]

[File Node] ──file──▶ [OR Gate] ──file──▶ [File Viewer]
```

Here you're comparing two independently compiled prompt paths in an OR gate.

### When to Use Prompt to File
```
[Provide Answers] ──out (prompt)──▶ [Prompt to File] ──file──▶ [NOT Gate] ──file──▶ [File Viewer]
```

Here you're taking the refined answer text (as a prompt fragment) and converting it into a file baseline so you can run it through a NOT gate.

---

## Saving and Loading Your Work

### Auto-Save
Every change you make (moving nodes, editing text, adding connections) is automatically saved to your browser's LocalStorage under the key `plg_last_project`. Next time you open the IDE, your work is restored.

### Manual Save (JSON Export)
1. Click **Save** in the top bar.
2. A file named `plg-graph.json` downloads to your computer.
3. This JSON contains all node positions, types, text values, and edge connections.
4. Share this file with others or version-control it in Git.

### Loading a Saved Graph
1. Click **Load** in the top bar.
2. Select a previously saved `.json` file.
3. The workspace replaces all current nodes and edges with the loaded graph.
4. Edge colors and markers are automatically restored.

### Exporting Compiled Prompt
1. Compile your graph first.
2. Click **Export .txt** in the Inspector footer.
3. A text file downloads containing:
```text
# Compiled Prompt
<your compiled prompt text>
```

### Creating a New Project
Click **New** in the top bar. After confirmation, the workspace resets to the default seed template with pre-wired AND + NOT gates.

---

## Tutorial 7: Variable Alignment & Casing Safety (Context Memory)

**Goal**: Ingest codebase schemas and variable guidelines to force the compiler to output exact, case-sensitive technical keywords, preventing spelling discrepancies.

### Circuit Diagram
```
[File Node] ──file──▶ [AND Gate] ──file──▶ [Prompt File Viewer]
                         ▲
[Context Memory] ──mem───┘
```

### Steps

1. **Add a File Node**: Drag "File Node" onto the canvas and name it `codebase_prompt.txt`.
2. **Add a Prompt Box**: Create a prompt box and type:
   `write a function that retrieves a user object using fetch_data and updates userId in local storage`
   *Note: Type some keywords with loose casing or typos, e.g., "FETCH_DATA" or "USERID".*
3. **Add a Context Memory Node**: Drag the `Context Memory` card from the left palette.
4. **Load Files**: Click the dashed upload zone on the Context Memory node (or drag and drop files from your desktop). Load a `.json` schema or code file.
   *Example loaded buffer contents (`config.json`):*
   ```json
   {
     "userId": "string",
     "fetch_data": "function"
   }
   ```
5. **Build Memory**: Click the purple **Build Context Memory** button on the node. The offline multi-casing parser crawls the buffer and populates the **Context Memory Preview** textarea with the structured Markdown ledger:
   ```markdown
   # 🧠 MEMPALACE-STYLE CONTEXT LEDGER
   ## 💻 Code Signatures, Variables & Database Schemas
   - **`userId`**: camelCase Variable
   - **`fetch_data(id)`**: Function Signature
   ```
6. **Add an AND Gate**: Drag an AND Gate to the canvas.
7. **Wire the memory circuit**:
   - File Node → AND Gate (file handle)
   - Prompt Box → AND Gate (input A)
   - Context Memory (purple output pin) → AND Gate (purple input memory pin)
8. **Add File Viewer**: Connect AND Gate file output to the Prompt File Viewer.
9. **Compile**: Click the blue **Compile** button in the top bar.

### Expected Output
```text
Compiled Prompt: "write a function that retrieves a user object using fetch_data and updates userId in local storage (Memory Constraints: [[userId] rule: camelCase Variable; [fetch_data] rule: Function Signature])"
```

### What Happened
The compiler matched the loosely-typed `fetch_data` and `userId` keywords inside your prompt fragment against the memory ledger. 
- In **Offline Mode**, it performed an in-place lexical word swap, correcting `FETCH_DATA` to `fetch_data` and `USERID` to `userId`, and appended the explicit constraints at the end.
- In **AI Mode**, it fed the entire memory ledger as a system constraint block to the LLM, instructing it to strictly preserve casing.
- The **Pipeline Debugger** stage "Context Memory Verification" will show a green checkmark `✓ Checked and matched 2 exact memory term(s)`.
