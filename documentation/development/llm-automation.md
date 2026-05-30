# 🤖 PLG Developer Guide - LLM-Automated Logging & Wiki Maintenance

One of the core architectural features of Prompt Logic Gates (PLG) is its Obsidian-compatible local wiki (`wiki/` folder). This folder operates as a compounding engineering manual. This guide outlines how you can utilize large language models (LLMs) to automatically maintain, catalog, and log project modifications.

---

## 📜 1. AI Agent Directory Specifications (`AGENTS.md`)

All AI coding assistants (like Gemini, Claude, or ChatGPT) are configured to act as disciplined bookkeepers. The root file [AGENTS.md](../../AGENTS.md) acts as their program specification. The linter validates that any agent modifications follow these four workflows:

### A. The Ingest Flow (Raw Materials)
When raw engineering notes or papers are dropped under the `raw/` folder, the agent must:
1. Parse the source, extracting primary categories and compiler impacts.
2. Update the relevant wiki pages (e.g. `compiler.md`, `nodes.md`, `overview.md`).
3. Add a link in the central index catalog [wiki/index.md](../../wiki/index.md).
4. Append an entry to the project log [wiki/log.md](../../wiki/log.md) as `## [YYYY-MM-DD] ingest | Title of Source`.

### B. The Refine Flow (Concept Updates)
When a developer refines a core algorithm (e.g., rephraser undo mechanics, variable cascades), the agent must update the corresponding specification wiki files and append an entry as `## [YYYY-MM-DD] refine | Description`.

### C. The Lint Flow (Health Check)
Agents are instructed to periodically scan the workspace for broken relative links (e.g., relative markdown links pointing to missing `.md` targets), orphaned wiki pages (pages not mapped in `wiki/index.md`), and contradictions in compilation rules.

### D. The Design Flow (Adding New Nodes or Circuits)
If you design new visual nodes (like Context Memory Nodes) or import custom JSON circuits, the agent must document the pin constraints, update the node reference tables, and log the release as `## [YYYY-MM-DD] design | Description`.

---

## ✍️ 2. Chronological Log Conventions (`wiki/log.md`)

Every engineering transaction is recorded in [wiki/log.md](../../wiki/log.md). The ledger is strictly append-only. 

### Logging Format
Every log entry must begin with a Markdown H2 header specifying the date and operation type, followed by an **Action** summary bullet and a detailed **Details** list referencing modified files:

```markdown
## [YYYY-MM-DD] <operation_type> | <Descriptive Title of Action>
- **Action**: Conceived, designed, and implemented...
- **Details**:
  - **Feature X**: Programmed hook in [App.jsx](../src/App.jsx) to...
  - **Styling Y**: Added CSS classes in [index.css](../src/index.css) to...
```

**Permitted Operation Types**: `ingest`, `refine`, `lint`, `design`.

---

## 💬 3. How to Use LLMs to Automate Updates (Prompt Template)

To ensure that your AI coding assistant automatically implements your features, documents its changes, indexes new pages, and appends a clean log entry, **copy and paste the following prompt system instruction** into your chat conversation before prompting the agent to write code:

````markdown
# System Instruction for the AI Coding Agent

You are an automated code and documentation compiler for the Prompt Logic Gates (PLG) project.
Your goal is to implement the requested code changes, and then automatically compile, refine, and log your modifications inside the local wiki.

## Core Directives:
1. **Analyze AGENTS.md**: Locate and read the root AGENTS.md file first. It contains your strict ledger conventions and directory rules.
2. **Perform Code Modifications**: Implement the requested feature inside the `src/` directory following the pure CSS and reactive state protocols.
3. **Auto-Refine Wiki Pages**:
   - If you modified node layouts/handles, edit wiki/nodes.md.
   - If you modified semantic compiler logic or conflicts, edit wiki/compiler.md.
   - If you added a new markdown file in the `wiki/` directory, ensure it starts with standard YAML frontmatter:
     ```yaml
     ---
     category: wiki-concept
     updated: YYYY-MM-DD
     tags: [plg, compiler, reference]
     ---
     ```
4. **Auto-Index**: Link any new pages inside wiki/index.md without wrapping links in backticks.
5. **Auto-Log**: Append an entry at the top of the chronological log inside wiki/log.md in the exact format:
   `## [YYYY-MM-DD] <operation_type> | <Description>`
   *(Permitted operations: ingest, refine, lint, design)*
6. **Verify Links**: Run a quick validation check to ensure no relative paths in your markdown changes are broken.
````

### 💡 Why This Works
By passing this system instruction, the LLM will automatically scan the codebase, implement your react code, identify which wiki pages correspond to the change, rewrite them in standard markdown, insert a H2 chronological ledger block in `wiki/log.md`, and verify index relative links—leaving the repository perfectly clean, fully documented, and ready for commit!
