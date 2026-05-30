# 🛠️ PLG Developer Guide - Environment Setup & Running Locally

Welcome! This onboarding document walks new developers and contributors through setting up their local workspace, installing required dependencies, and starting the local development compiler.

---

## 📋 1. Prerequisites

Before installing the project, make sure your machine has the following tools installed:

- **Node.js**: Version 18.0.0 or higher is required. You can download it from [nodejs.org](https://nodejs.org/).
- **npm (Node Package Manager)**: Bundled automatically with Node.js.
- **Git**: Required for cloning the repository and staging edits.

To verify your installation, run the following commands in your shell:
```bash
node -v
npm -v
git --version
```

---

## 📥 2. Installation Step-by-Step

Follow these commands to clone the source code and prepare your workspace:

### Step 1: Clone the Repository
Clone the repository from GitHub into your local folder and navigate into the project root:
```bash
git clone https://github.com/WithSJ/Prompt-Logic-Gates-PLG-.git
cd Prompt-Logic-Gates-PLG-
```

### Step 2: Install Node Dependencies
Install all required package packages using the package-lock constraints:
```bash
npm install
```
*Note: This downloads React Flow (`@xyflow/react`), Lucide React icons, Vite plugins, and standard React 18 utilities into your local `node_modules/` folder.*

---

## 🚀 3. Core Development Commands

Once installation completes, use these NPM script commands inside your shell:

### A. Run Local Development Server
Start the local Vite dev server with Hot Module Replacement (HMR) active:
```bash
npm run dev
```
- **Local URL**: By default, the server spins up at `http://localhost:5173/`.
- **HMR Enabled**: Editing React code in `src/` or editing custom layout rules in `src/index.css` automatically refreshes the visual canvas in real-time without losing edge coordinates or active node states!

### B. Compile Production Bundle
Build and minify the entire React IDE for distribution:
```bash
npm run build
```
- **Output Folder**: Vite compiles and bundles all JSX assets and CSS stylesheets into the `/dist` directory.
- **Verification**: Running a build is highly recommended before opening a Pull Request (PR) to ensure all React imports and JSX tags are free of syntax warnings.

### C. Preview Production Build
Spin up a local static server to inspect the compiled build inside `/dist`:
```bash
npm run preview
```

---

## 🗺️ 4. Workspace Directory Mapping

The PLG project follows a clean, highly structured directory layout. Keep these locations in mind during development:

```text
PLG (Project Root)
├── .gitignore                   # Standard IDE and node build exclusion rules
├── AGENTS.md                    # Core ledger schemas and instructions for AI agents
├── LICENSE                      # Project open-source license
├── README.md                    # Main catalog and entry point for GitHub
├── package.json                 # Node metadata, package bindings, and build scripts
├── vite.config.js               # Vite configurations and local dev routing rules
│
├── src/                         # Core Visual IDE React Codebase
│   ├── App.jsx                  # Root state controller and main toolbar layout
│   ├── main.jsx                 # Canvas bootstrapper
│   ├── index.css                # Primary Vanilla CSS stylesheet
│   │
│   ├── compiler/
│   │   └── semanticCompiler.js  # Topological DFS parser & API callers
│   │
│   └── components/              # Sub-components & Custom Node elements
│       ├── CustomNodes.jsx      # Visual custom node shapes & handle definitions
│       ├── Inspector.jsx        # Right sidebar debug panel
│       ├── PLGCanvas.jsx        # React Flow canvas wrapper
│       └── SettingsModal.jsx    # Model configuration UI
│
├── wiki/                        # Obsidian-compatible compounding visual wiki
│   ├── index.md                 # Internal knowledge catalog
│   ├── log.md                   # Chronological project ledger
│   └── overview.md, nodes.md... # System specs, and workflows
│
└── documentation/               # 10-Page comprehensive user manual suite
    ├── getting-started.md       # User onboarding tutorial
    ├── nodes-guide.md           # Visual guide of all canvas nodes
    └── development/             # THIS DIRECTORY (Developer guidelines)
        ├── setup.md             # This local installation guide
        ├── standards.md         # CSS & State coding conventions
        └── llm-automation.md   # AI Agent auto-log & wiki workflows
```

---

> [!NOTE]
> All documentation inside `documentation/development/` is designed to be fully compatible with offline editors and GitHub Markdown previews. Continue onto [standards.md](standards.md) to review coding rules.
