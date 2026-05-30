---
category: documentation
updated: 2026-05-29
tags: [plg, setup, installation, quickstart]
---

# Getting Started

This guide walks you through installing, running, and using the PLG IDE for the first time.

---

## Prerequisites

| Requirement | Version | Notes |
| :--- | :--- | :--- |
| **Node.js** | v18+ | Required for Vite dev server |
| **npm** | v9+ | Comes bundled with Node.js |
| **Modern Browser** | Chrome / Edge / Firefox | Must support ES modules and CSS `color-mix()` |

**Optional** (for AI mode only):
- An API key from one of: Anthropic, OpenAI, Google AI Studio, or OpenRouter

---

## Installation

### Step 1: Get the Source Code

```bash
# If you cloned via Git:
git clone https://github.com/WithSJ/Prompt-Logic-Gates-PLG-.git PLG
cd PLG

# Or simply navigate to the project folder:
cd c:\Users\jadam\Desktop\PLG
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs 4 core dependencies:
- **react** `^18.3.1` — UI framework
- **react-dom** `^18.3.1` — React DOM renderer
- **@xyflow/react** `^12.3.0` — Visual node graph editor (React Flow)
- **lucide-react** `^0.400.0` — Icon library

And 3 dev dependencies:
- **vite** `^5.3.4` — Build tool and dev server
- **@vitejs/plugin-react** `^4.3.1` — React JSX support for Vite
- **@types/react** & **@types/react-dom** — TypeScript type definitions

### Step 3: Start the Development Server

```bash
npm run dev
```

Vite starts a local server at `http://localhost:5173` with hot module replacement.

> **Important:** The Vite dev server includes CORS proxy rules that route API calls to Anthropic, OpenAI, Google, and OpenRouter. These proxies only work during development. For production, you would need a backend proxy or edge function.

### Step 4: Open in Browser

Navigate to `http://localhost:5173`. You will see the PLG IDE with:
- **Left Panel**: Node palette with draggable components
- **Center**: Infinite canvas with a pre-loaded seed template
- **Right Panel**: Inspector panel (empty until you compile)

---

## Your First Compilation

The seed template creates this circuit automatically:

```
File Node (prompt.txt)
  └──▶ AND Gate
         ├── Prompt A: "Abandoned hospital"
         ├── Prompt B: "PS1 graphics"
         └──▶ NOT Gate
                ├── Suppress: "cute cartoon style"
                └──▶ Prompt File Viewer
```

### Step-by-Step:

1. **Look at the canvas**: You'll see 5 nodes pre-wired together.
2. **Click the blue "Compile" button** in the top bar.
3. **Check the right panel**: It now shows:
   - **Compiled Prompt**: `Abandoned hospital, PS1 graphics (avoid cute cartoon style)` (merged by the AND gate, sorted by category priority, with explicit negation appended by the NOT gate)
   - **Visual Compiler Pipeline**: An expandable step-by-step trace showing what each node did (including the Context Memory Verification check)

4. **Click "copy"** next to the Compiled Prompt to copy it to your clipboard.
5. **Paste it into your AI generator** of choice.

---

## Enabling AI Mode

By default, the compiler runs in **Rule-based (offline)** mode, using keyword dictionaries and conflict matrices to sort and merge prompts. For smarter, context-aware compilation:

1. Click **AI Models** in the top bar.
2. Switch **Compiler Mode** to **AI-assisted**.
3. Select your preferred provider (Claude, ChatGPT, Gemini, or OpenRouter).
4. Enter your API key.
5. Click **Test Connection** to verify.
6. Click **Save & Close**.

Now when you click **Compile**, each gate sends its prompt context to the AI for intelligent merging, selection, or suppression.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with HMR and API proxies |
| `npm run build` | Creates production bundle in `dist/` |
| `npm run preview` | Previews the production build locally |

---

## Troubleshooting

### "Module not found" errors
Run `npm install` again. Ensure you're using Node.js v18+.

### API calls fail in AI mode
- Check that your API key is correct
- The Vite proxy only works with `npm run dev`, not with `npm run preview`
- Some providers (Anthropic) require the `anthropic-dangerous-direct-browser-access` header, which is already included

### Canvas is blank
- Ensure your browser supports modern CSS features (`color-mix`, `backdrop-filter`)
- Try clearing LocalStorage: open DevTools → Application → Local Storage → delete `plg_last_project`

### Nodes won't connect
- Pin types must match: **File ↔ File**, **Prompt ↔ Prompt**, **Questions ↔ Questions**
- Each input handle accepts only one connection
- You cannot connect a node to itself
