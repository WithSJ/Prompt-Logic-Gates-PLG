# Prompt Logic Gates (PLG) - LLM Wiki Schema & Agent Instructions

This document defines the architecture, rules, and workflows for **LLM Agents** (like Antigravity, Claude, ChatGPT, etc.) that maintain the Prompt Logic Gates (PLG) Wiki. 

As an agent, you must act as a disciplined, automated bookkeeper and synthesizer for the user. Do not delete this file; it serves as your program specification.

---

## 1. Directory Structure

All wiki files live in the `wiki/` directory. Immutable raw source materials are documented or placed under `raw/`.

```
PLG (Project Root)
├── AGENTS.md                    # This schema definition file (Root level)
├── raw/                         # Raw source documents (e.g. Research_Documentation.docx)
└── wiki/                        # The compounding visual logic wiki
    ├── index.md                 # Content catalog & entrypoint (updated on every ingest)
    ├── log.md                   # Append-only chronological log of operations
    ├── overview.md              # Vision, concept, and core logic compiler goals
    ├── architecture.md          # Technical compiler engine, reactive sync, & top-sort order
    ├── nodes.md                 # Complete reference guide of custom react-flow nodes & handles
    ├── compiler.md              # Categories, keywords, semantic weights, conflict matrices, & AI prompts
    └── workflows.md             # How to construct, compile, export, and load prompt circuits
```

---

## 2. Core Operations

You must follow these precise procedures when the user requests operations.

### A. Ingest Flow
When a user adds a new raw source (e.g. article, podcast transcript, docx) to their collection:
1. **Read & Extract**: Read the source, extract all primary subjects, style rules, semantic structures, and compiler impacts.
2. **Review with User**: Briefly discuss the core takeaways and how they relate to the PLG visual compiler.
3. **Write/Modify Subject Pages**:
   - Update `overview.md`, `architecture.md`, `nodes.md`, `compiler.md`, or `workflows.md` if the new source introduces updates.
   - Create new concept or comparison pages if needed.
4. **Update `wiki/index.md`**: Add any new files with a relative link and a clean 1-line description.
5. **Update `wiki/log.md`**: Append a new entry using the exact format:
   `## [YYYY-MM-DD] ingest | Title of Source`

### B. Query Flow
When the user asks technical questions or requests new logic circuits:
1. **Index Search**: Read `wiki/index.md` first to identify target files.
2. **Synthesize & Cite**: Read those target files and synthesize a comprehensive answer with direct markdown citations.
3. **Compound Answers**: If the answer is a reusable schematic, a new node custom layout, or a complex logic circuit, **save it as a new markdown page in the wiki** rather than leaving it in the chat history. Link it in `index.md`.

### C. Lint Flow (Health Check)
Periodically or upon request, scan the wiki for:
- **Broken Links**: Any relative markdown link (`[Title](file.md)`) pointing to a missing file.
- **Inconsistencies**: Contradictory explanations of gate execution, priorities, or node handles.
- **Orphan Pages**: Markdown pages in `wiki/` that have no incoming links in `wiki/index.md` or other pages.
- **Missing Concepts**: Mention of gate types or compiler steps without an active relative link to their reference.

---

## 3. Indexing & Logging Conventions

### `wiki/index.md` (Content Catalog)
Must be structured under three categories:
- **Core Concepts**: High-level understanding and design patterns.
- **Reference & Engine**: Node types, handle specifications, compile scripts, categories.
- **Timeline & History**: Quick links to log files.

Format every list item precisely:
- `* [[Page Title](relative_path.md)] - 1-line plain text summary of the page.`
- *Note: Do not wrap the file links in backticks.*

### `wiki/log.md` (Chronological Ledger)
Every record must be an append-only block started by a H2 tag of form:
`## [YYYY-MM-DD] <operation_type> | <Description>`

Valid operation types:
- `ingest` (New source added)
- `refine` (Concept page updated)
- `lint` (Periodic health-check run)
- `design` (Adding new circuit patterns/nodes)

---

## 4. Integration Settings (Obsidian-friendly)

To ensure maximum visual aesthetic and compatibility with tools like Obsidian:
- **Relative Linking**: Always use standard markdown relative paths (e.g. `[Nodes Reference](nodes.md)`).
- **Yaml Frontmatter**: Prefix all concept pages with a clean HSL/Dataview friendly header:
  ```yaml
  ---
  category: wiki-concept
  updated: YYYY-MM-DD
  tags: [plg, compiler, reference]
  ---
  ```
- **Graph Hubs**: Make sure pages like `overview.md` connect to `architecture.md`, `nodes.md`, and `compiler.md` to form a gorgeous connected star-graph in Obsidian Graph View.
