import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import { Play, Settings, Save, Upload, HelpCircle, Loader2, FilePlus, Brain, Database } from 'lucide-react';
import PLGCanvas from './components/PLGCanvas';
import Inspector from './components/Inspector';
import SettingsModal from './components/SettingsModal';
import { compileGraph, callAI } from './compiler/semanticCompiler';

// Local storage helper
const Store = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }
};

const DEFAULT_SETTINGS = {
  mode: 'rule',
  provider: 'anthropic',
  keys: { anthropic: '', openai: '', google: '', openrouter: '' },
  models: { 
    anthropic: 'claude-3-5-sonnet-latest', 
    openai: 'gpt-4o-mini', 
    google: 'gemini-1.5-flash', 
    openrouter: 'openai/gpt-4o-mini' 
  }
};

// Sub-component wrapper that uses useReactFlow hook safely inside ReactFlowProvider
function PLGApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const customOnNodesChange = useCallback((changes) => {
    const filtered = changes.filter((change) => {
      if (change.type === 'remove') {
        const targetNode = nodes.find((n) => n.id === change.id);
        if (targetNode && targetNode.type === 'fileViewer') {
          return false;
        }
      }
      return true;
    });
    onNodesChange(filtered);
  }, [nodes, onNodesChange]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [compileResult, setCompileResult] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [fileTitle, setFileTitle] = useState('prompt.txt');
  const [toast, setToast] = useState({ show: false, type: 'info', text: '' });
  const [compilationMode, setCompilationMode] = useState(() => {
    return Store.get('plg_compilation_mode') || 'normal';
  });

  // Sync compilation mode to LocalStorage
  useEffect(() => {
    Store.set('plg_compilation_mode', compilationMode);
  }, [compilationMode]);

  const handleCompilationModeChange = (mode) => {
    setCompilationMode(mode);
    showToast(`Compilation Depth set to ${mode === 'normal' ? 'Normal' : mode === 'thinking' ? 'Thinking' : 'DeepThinking'}`, 'info');
  };

  // Toast handler
  const showToast = useCallback((text, type = 'info') => {
    setToast({ show: true, type, text });
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  // Update file node title when nodes change
  useEffect(() => {
    const fileNode = nodes.find((n) => n.type === 'fileNode');
    if (fileNode && fileNode.data && fileNode.data.filename) {
      setFileTitle(fileNode.data.filename);
    }
  }, [nodes]);

  // Load Settings from LocalStorage
  useEffect(() => {
    const stored = Store.get('plg_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          keys: { ...DEFAULT_SETTINGS.keys, ...parsed.keys },
          models: { ...DEFAULT_SETTINGS.models, ...parsed.models }
        });
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  // Reactively sync questions from Ask AI Questions to Provide Answers when edges change
  useEffect(() => {
    setNodes((nds) => {
      let changed = false;
      const updated = nds.map((n) => {
        if (n.type === 'answerQuestions') {
          const qEdge = edges.find((e) => e.target === n.id && e.targetHandle === 'questions');
          if (qEdge) {
            const srcNode = nds.find((sn) => sn.id === qEdge.source);
            const sourceQuestions = srcNode?.data?.questions || [];
            if (JSON.stringify(n.data?.questions || []) !== JSON.stringify(sourceQuestions)) {
              changed = true;
              return {
                ...n,
                data: {
                  ...n.data,
                  questions: sourceQuestions
                }
              };
            }
          } else {
            if ((n.data?.questions || []).length > 0) {
              changed = true;
              return {
                ...n,
                data: {
                  ...n.data,
                  questions: []
                }
              };
            }
          }
        }
        return n;
      });
      return changed ? updated : nds;
    });
  }, [edges, setNodes]);

  // Sync Settings to LocalStorage
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    Store.set('plg_settings', JSON.stringify(newSettings));
    showToast('AI Settings updated successfully', 'ok');
  };

  // Node event binders wrapper
  const bindNodeCallbacks = useCallback((nId, type) => {
    return {
      onChangeFilename: (id, name) => {
        setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, filename: name } } : n));
      },
      onChangeText: (id, txt) => {
        setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, text: txt } } : n));
      },
      onChangeAnswer: (id, idx, val) => {
        setNodes((nds) => nds.map((n) => {
          if (n.id === id) {
            const answers = { ...(n.data.answers || {}), [idx]: val };
            return {
              ...n,
              data: { ...n.data, answers }
            };
          }
          return n;
        }));
      },
      onChangeNumQuestions: (id, count) => {
        setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, numQuestions: count } } : n));
      },
      onChangeNumInputs: (id, count) => {
        setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, numInputs: count } } : n));
      },
      onChangeMemoryText: (id, txt) => {
        setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, extractedMemory: txt } } : n));
      },
      onAddFiles: async (id, fileList) => {
        const readPromises = fileList.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                content: e.target.result
              });
            };
            reader.readAsText(file);
          });
        });
        const loadedFiles = await Promise.all(readPromises);
        setNodes((nds) => nds.map((n) => {
          if (n.id === id) {
            const currentFiles = n.data.files || [];
            const nextFiles = [...currentFiles];
            loadedFiles.forEach(lf => {
              if (!nextFiles.some(f => f.name === lf.name)) {
                nextFiles.push(lf);
              }
            });
            return { ...n, data: { ...n.data, files: nextFiles } };
          }
          return n;
        }));
        showToast(`Loaded ${loadedFiles.length} file(s) into memory node`, 'ok');
      },
      onDeleteFile: (id, fileIdx) => {
        setNodes((nds) => nds.map((n) => {
          if (n.id === id) {
            const currentFiles = n.data.files || [];
            const nextFiles = currentFiles.filter((_, idx) => idx !== fileIdx);
            return { ...n, data: { ...n.data, files: nextFiles } };
          }
          return n;
        }));
        showToast('File removed from memory node', 'info');
      },
      onExtractMemory: async (id) => {
        setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, isExtracting: true } } : n));
        try {
          const nodeRef = nodesRef.current.find(n => n.id === id);
          const files = nodeRef?.data?.files || [];
          if (files.length === 0) {
            throw new Error('Please upload at least one readable file (.txt, .md, .html, .json, .xml)');
          }
          
          const combinedDocsText = files.map(f => {
            return `--- FILE START: ${f.name} (type: ${f.type || 'text'}) ---\n${f.content}\n--- FILE END ---`;
          }).join('\n\n');
          
          let synthesizedMemory = '';
          if (settings.mode === 'ai') {
            const systemInstruction = `You are a principal logic indexer and metadata database compiler, styled after the MemPalace indexing engine.
Your task is to analyze the provided source files (.md, .txt, .html, .json, .xml) and index them into an exhaustive, highly structured Visual Context Memory Ledger.
You must extract all technical specifications with extreme precision and absolute preservation of letter casing, symbols, and syntax.

Structure the catalog under these specific, Obsidian-friendly HSL headers:

# 🧠 MEMPALACE-STYLE CONTEXT LEDGER

## 🏛 Workspace Hierarchy (Wings & Rooms & Halls)
- **Wing: [Source Category]** -> (Grouping of files, e.g., Codebase, Style-Guides, Schemas)
  - **Room: \`[Relative File Path]\`** -> [Brief 1-line description of the file's architectural role]
    - **Hall: [Logical Section/Header Name]** -> [Detailed summary of this specific file portion]

## 💻 Code Signatures, Variables & Database Schemas
- **\`[Variable/Function/Constant/Key]\`**: 
  - *Type*: [Variable / Function Signature / JSON Key / HTML Tag / Schema Attribute]
  - *Exact Casing*: [Exact Casing-Sensitive representation, e.g. userId, fetch_data, NOTATION_CONSTANT]
  - *Definition & Signature*: [Parameters, return types, key description, and strict syntax rules]
  - *Context Location*: Room: \`[Relative File Path]\` -> Hall: [Section]

## 🔑 Key Terms & Structured Entity Hints
- **\`[Visual Concept/Key Entity]\`**:
  - *Casing Rule*: [Preservation requirements]
  - *Visual Description*: [Vivid details, visual semantics, and visual hints mapped from source data]

## 🎨 Semantic Constraints & Style Rules
- **[Aesthetic Rule/Visual Constraint]**: [Detailed description of formatting rules, colors, dimensions, camera setups, or stylistic instructions described in the files]

## 📌 System Rules & Casing Invariants
- **[Rule Title]**: [Explicit list of casing rules (camelCase, PascalCase, snake_case), consistency guidelines, and forbidden patterns derived from the source files]

Use absolute exact casing, names, and parameters. Maintain 100% fidelity to the source documents. Respond with ONLY the beautifully structured Markdown ledger, without any conversational preamble, quotes, or meta-commentary.`;
            
            const response = await callAI(systemInstruction, combinedDocsText, settings);
            synthesizedMemory = (response || '').trim();
          } else {
            // Offline High-Fidelity parsing engine (MemPalace style)
            const extractedWings = {};
            const extractedVars = [];
            const extractedEntities = new Set();
            const extractedRules = [];
            
            files.forEach(f => {
              const fileName = f.name || 'unknown_file';
              const ext = fileName.split('.').pop().toLowerCase();
              const wingName = ['json', 'xml', 'html'].includes(ext) ? 'Data Schemas' : (ext === 'md' ? 'Documentation' : 'Source Code');
              
              if (!extractedWings[wingName]) {
                extractedWings[wingName] = [];
              }
              extractedWings[wingName].push(fileName);
              
              const fileContent = f.content || '';
              
              // 1. If JSON, parse keys
              if (ext === 'json') {
                try {
                  const obj = JSON.parse(fileContent);
                  const scanKeys = (o, depth = 0) => {
                    if (depth > 3 || !o || typeof o !== 'object') return;
                    Object.keys(o).forEach(k => {
                      if (!extractedVars.some(v => v.name === k)) {
                        extractedVars.push({
                          name: k,
                          type: 'JSON Key',
                          desc: `Key inside JSON schema structure (depth: ${depth})`,
                          loc: fileName
                        });
                      }
                      scanKeys(o[k], depth + 1);
                    });
                  };
                  scanKeys(obj);
                } catch (e) {
                  // Fallback to regex if parse fails
                }
              }
              
              // 2. Line-by-line scanning
              const lines = fileContent.split(/\r?\n/);
              lines.forEach((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return;
                
                // Extract functions or method signatures: something(args)
                const funcMatches = trimmed.match(/\b([a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\))\b/g);
                if (funcMatches) {
                  funcMatches.forEach(fSig => {
                    const nameOnly = fSig.split('(')[0].trim();
                    if (nameOnly.length > 3 && !['if', 'for', 'while', 'switch', 'catch', 'function'].includes(nameOnly)) {
                      if (!extractedVars.some(v => v.name === fSig)) {
                        extractedVars.push({
                          name: fSig,
                          type: 'Function Signature',
                          desc: `Extracted functional signature from text buffer (line ${idx + 1})`,
                          loc: fileName
                        });
                      }
                    }
                  });
                }
                
                // Extract casing variables (camelCase, PascalCase, snake_case, CONSTANT_CASE)
                // camelCase
                const camelMatches = trimmed.match(/\b([a-z]+[A-Z][a-zA-Z0-9]*)\b/g);
                if (camelMatches) {
                  camelMatches.forEach(c => {
                    if (c.length > 3 && !extractedVars.some(v => v.name === c)) {
                      extractedVars.push({ name: c, type: 'camelCase Variable', desc: `camelCase identifier in code buffer`, loc: fileName });
                    }
                  });
                }
                
                // snake_case & CONSTANT_CASE
                const snakeMatches = trimmed.match(/\b([a-zA-Z0-9]+_[a-zA-Z0-9_]+)\b/g);
                if (snakeMatches) {
                  snakeMatches.forEach(s => {
                    if (s.length > 3 && !extractedVars.some(v => v.name === s)) {
                      const isConstant = s === s.toUpperCase();
                      extractedVars.push({
                        name: s,
                        type: isConstant ? 'CONSTANT_CASE Constant' : 'snake_case Variable',
                        desc: isConstant ? 'Global constant casing rule representation' : 'snake_case identifier in buffer',
                        loc: fileName
                      });
                    }
                  });
                }

                // PascalCase
                const pascalMatches = trimmed.match(/\b([A-Z][a-z0-9]+[A-Z][a-zA-Z0-9]*)\b/g);
                if (pascalMatches) {
                  pascalMatches.forEach(p => {
                    if (p.length > 3 && !extractedVars.some(v => v.name === p)) {
                      extractedVars.push({ name: p, type: 'PascalCase Class/Type', desc: `PascalCase type/class declaration`, loc: fileName });
                    }
                  });
                }
                
                // 3. Extract backtick terms as Entity Hints
                const tickMatches = trimmed.match(/`([^`]+)`|\*\*([^*]+)\*\*/g);
                if (tickMatches) {
                  tickMatches.forEach(m => {
                    const clean = m.replace(/[`*]/g, '').trim();
                    if (clean.length > 2 && clean.length < 40 && !clean.includes(' ')) {
                      extractedEntities.add(clean);
                    }
                  });
                }
                
                // 4. Extract rule statements (must, should, always, never, avoid, constraint)
                if (/\b(must|should|always|never|avoid|rules?|convention|styles?|colors?)\b/i.test(trimmed)) {
                  if (trimmed.length > 15 && trimmed.length < 150 && !trimmed.startsWith('#') && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
                    const cleanRule = trimmed.replace(/^[-*+\s\d.]+/g, '').trim();
                    if (!extractedRules.includes(cleanRule) && extractedRules.length < 15) {
                      extractedRules.push(cleanRule);
                    }
                  }
                }
              });
            });
            
            // Format hierarchy markdown
            let hierarchyMd = '';
            Object.keys(extractedWings).forEach(wing => {
              hierarchyMd += `- **Wing: ${wing}**\n`;
              extractedWings[wing].forEach(room => {
                hierarchyMd += `  - **Room: \`${room}\`** -> Loaded buffer resource active on canvas\n`;
              });
            });
            
            // Format variables markdown
            let varsMd = '';
            if (extractedVars.length > 0) {
              extractedVars.slice(0, 30).forEach(v => {
                varsMd += `- **\`${v.name}\`**:\n  - *Type*: ${v.type}\n  - *Exact Casing*: \`${v.name}\`\n  - *Definition*: ${v.desc}\n  - *Context Location*: Room: \`${v.loc}\`\n`;
              });
            } else {
              varsMd = '- No variables or code signatures auto-detected. Type manually if needed.\n';
            }
            
            // Format entity hints
            let entitiesMd = '';
            if (extractedEntities.size > 0) {
              Array.from(extractedEntities).slice(0, 20).forEach(ent => {
                entitiesMd += `- **\`${ent}\`**:\n  - *Casing Rule*: Strict preservation required\n  - *Visual Description*: Indexed keyword from source markup\n`;
              });
            } else {
              entitiesMd = '- No entity hints extracted.\n';
            }
            
            // Format rules
            let rulesMd = '';
            if (extractedRules.length > 0) {
              extractedRules.forEach(rule => {
                rulesMd += `- **Constraint**: ${rule}\n`;
              });
            } else {
              rulesMd = `- **Casing Rule**: camelCase for local variables, PascalCase for classes, snake_case for parameters.\n- **Vocabulary Rule**: Match vocabulary in loaded documents.\n`;
            }
            
            synthesizedMemory = `# 🧠 MEMPALACE-STYLE CONTEXT LEDGER
 
## 🏛 Workspace Hierarchy (Wings & Rooms & Halls)
${hierarchyMd || '- No source files registered.'}
 
## 💻 Code Signatures, Variables & Database Schemas
${varsMd}
 
## 🔑 Key Terms & Visual Entity Hints
${entitiesMd}
 
## 🎨 Semantic Constraints & Style Rules
${rulesMd}
 
## 📌 System Rules & Casing Invariants
- Maintain strict exact casing and nomenclature across all compiled prompts.
- Preserve uppercase/lowercase symbols exactly as defined.
- Enforce visual prompt parameters specified in design guidelines.`;
          }
          
          setNodes((nds) => nds.map((n) => {
            if (n.id === id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  extractedMemory: synthesizedMemory,
                  isExtracting: false
                }
              };
            }
            return n;
          }));
          showToast('Context Memory compiled successfully ✦', 'ok');
        } catch (err) {
          showToast(err.message || 'Memory build failed', 'err');
          setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, isExtracting: false } } : n));
        }
      },
      onDeleteNode: () => {
        if (type === 'fileViewer') return;
        setNodes((nds) => nds.filter((n) => n.id !== nId));
        setEdges((eds) => eds.filter((e) => e.source !== nId && e.target !== nId));
      }
    };
  }, [setNodes, setEdges, settings, showToast]);

  // Seed Example Graph matching standard specifications
  const seedExample = useCallback(() => {
    const fileId = 'fileNode_seed';
    const andId = 'and_seed';
    const notId = 'not_seed';
    const promptAId = 'promptBox_a_seed';
    const promptBId = 'promptBox_b_seed';
    const promptCId = 'promptBox_c_seed';
    const fvId = 'fileViewer_seed';

    const initialNodes = [
      {
        id: fileId,
        type: 'fileNode',
        position: { x: 80, y: 250 },
        data: { filename: 'prompt.txt', ...bindNodeCallbacks(fileId, 'fileNode') }
      },
      {
        id: promptAId,
        type: 'promptBox',
        position: { x: 80, y: 40 },
        data: { text: 'Abandoned hospital', ...bindNodeCallbacks(promptAId, 'promptBox') }
      },
      {
        id: promptBId,
        type: 'promptBox',
        position: { x: 80, y: 470 },
        data: { text: 'PS1 graphics', ...bindNodeCallbacks(promptBId, 'promptBox') }
      },
      {
        id: andId,
        type: 'and',
        position: { x: 420, y: 150 },
        data: { ...bindNodeCallbacks(andId, 'and') }
      },
      {
        id: promptCId,
        type: 'promptBox',
        position: { x: 420, y: 470 },
        data: { text: 'cute cartoon style', ...bindNodeCallbacks(promptCId, 'promptBox') }
      },
      {
        id: notId,
        type: 'not',
        position: { x: 760, y: 250 },
        data: { ...bindNodeCallbacks(notId, 'not') }
      },
      {
        id: fvId,
        type: 'fileViewer',
        position: { x: 1100, y: 250 },
        data: { ...bindNodeCallbacks(fvId, 'fileViewer') }
      }
    ];

    const initialEdges = [
      {
        id: `e_${fileId}_file_to_${andId}_file`,
        source: fileId,
        sourceHandle: 'file',
        target: andId,
        targetHandle: 'file',
        style: { stroke: 'var(--file)' },
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: 'var(--file)' }
      },
      {
        id: `e_${promptAId}_out_to_${andId}_a`,
        source: promptAId,
        sourceHandle: 'out',
        target: andId,
        targetHandle: 'a',
        style: { stroke: 'var(--prompt)' },
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: 'var(--prompt)' }
      },
      {
        id: `e_${promptBId}_out_to_${andId}_b`,
        source: promptBId,
        sourceHandle: 'out',
        target: andId,
        targetHandle: 'b',
        style: { stroke: 'var(--prompt)' },
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: 'var(--prompt)' }
      },
      {
        id: `e_${andId}_file_to_${notId}_file`,
        source: andId,
        sourceHandle: 'file',
        target: notId,
        targetHandle: 'file',
        style: { stroke: 'var(--file)' },
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: 'var(--file)' }
      },
      {
        id: `e_${promptCId}_out_to_${notId}_a`,
        source: promptCId,
        sourceHandle: 'out',
        target: notId,
        targetHandle: 'a',
        style: { stroke: 'var(--prompt)' },
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: 'var(--prompt)' }
      },
      {
        id: `e_${notId}_file_to_${fvId}_file`,
        source: notId,
        sourceHandle: 'file',
        target: fvId,
        targetHandle: 'file',
        style: { stroke: 'var(--file)' },
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: 'var(--file)' }
      }
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges, bindNodeCallbacks]);

  // Load last project or seed default on mount
  useEffect(() => {
    const stored = Store.get('plg_last_project');
    if (stored) {
      try {
        const g = JSON.parse(stored);
        const loadedNodes = (g.nodes || []).map((node) => ({
          ...node,
          data: {
            ...node.data,
            ...bindNodeCallbacks(node.id, node.type)
          }
        }));
        
        const loadedEdges = (g.edges || []).map((edge) => {
          const isFileEdge = edge.sourceHandle === 'file';
          const isQuestionsEdge = edge.sourceHandle === 'questions';
          const edgeColor = isFileEdge ? 'var(--file)' : isQuestionsEdge ? '#fb923c' : 'var(--prompt)';
          return {
            ...edge,
            style: { stroke: edgeColor },
            markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: edgeColor }
          };
        });
        
        setNodes(loadedNodes);
        setEdges(loadedEdges);
        showToast('Last working project restored', 'info');
      } catch (e) {
        console.error('Failed to parse last project, seeding default template', e);
        seedExample();
      }
    } else {
      seedExample();
    }
    setIsInitialLoadDone(true);
  }, [seedExample, bindNodeCallbacks, setNodes, setEdges, showToast]);

  // Auto-save graph configuration to local storage whenever nodes or edges change
  useEffect(() => {
    if (!isInitialLoadDone) return;
    
    const cleanNodes = nodes.map(({ id, type, position, data }) => ({
      id,
      type,
      position,
      data: { 
        text: data.text, 
        filename: data.filename,
        questions: data.questions,
        answers: data.answers,
        numQuestions: data.numQuestions,
        numInputs: data.numInputs,
        compiledPositive: data.compiledPositive,
        compiledNegative: data.compiledNegative,
        files: data.files,
        extractedMemory: data.extractedMemory
      }
    }));

    const cleanEdges = edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
      id, source, target, sourceHandle, targetHandle
    }));

    const graph = {
      version: 1,
      nodes: cleanNodes,
      edges: cleanEdges
    };

    Store.set('plg_last_project', JSON.stringify(graph));
  }, [nodes, edges, isInitialLoadDone]);

  // Create a new project (seeding the default workspace)
  const handleNewProject = () => {
    if (window.confirm('Create a new project? This will clear the workspace and load the default seed template.')) {
      seedExample();
      setCompileResult(null);
      showToast('New project template loaded', 'ok');
    }
  };

  // Compile prompt execution trigger
  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const result = await compileGraph(nodes, edges, { ...settings, compilationMode });
      setCompileResult(result);
      
      // Sync compiled outputs back into File Node and resolve states for File Viewer nodes
      setNodes((nds) => nds.map((n) => {
        if (n.type === 'fileNode') {
          return {
            ...n,
            data: {
              ...n.data,
              compiled: {
                positive: result.positive,
                negative: result.negative,
                items: result.items,
                negItems: result.neg
              }
            }
          };
        }

        if (n.type === 'fileViewer') {
          return {
            ...n,
            data: {
              ...n.data,
              compiledPositive: result.positive,
              compiledNegative: result.negative
            }
          };
        }

        if (n.type === 'askQuestion') {
          const qs = result.gateStates[n.id]?.questions || [];
          return {
            ...n,
            data: {
              ...n.data,
              questions: qs
            }
          };
        }

        if (n.type === 'answerQuestions') {
          const qEdge = edges.find((e) => e.target === n.id && e.targetHandle === 'questions');
          const qs = qEdge ? (result.gateStates[qEdge.source]?.questions || []) : [];
          return {
            ...n,
            data: {
              ...n.data,
              questions: qs
            }
          };
        }

        return n;
      }));

      const successMsg = result.aiUsed
        ? `Compiled with ${settings.provider === 'anthropic' ? 'Claude' : settings.provider === 'openai' ? 'ChatGPT' : settings.provider === 'google' ? 'Gemini' : 'OpenRouter'} Refinements ✦`
        : 'Compiled successfully (rule-based)';
      showToast(successMsg, 'ok');
    } catch (err) {
      showToast(err.message || 'Compilation failed', 'err');
      console.error(err);
    } finally {
      setIsCompiling(false);
    }
  };



  // Clear visual canvas
  const handleClearCanvas = () => {
    if (!nodes.length) return;
    if (window.confirm('Are you sure you want to clear the entire canvas workspace?')) {
      const fvNode = nodes.find((n) => n.type === 'fileViewer');
      if (fvNode) {
        setNodes([{
          ...fvNode,
          position: { x: 450, y: 200 }
        }]);
      } else {
        const id = `fv_${Date.now()}`;
        setNodes([{
          id,
          type: 'fileViewer',
          position: { x: 450, y: 200 },
          data: { ...bindNodeCallbacks(id, 'fileViewer') }
        }]);
      }
      setEdges([]);
      setCompileResult(null);
      showToast('Canvas cleared (Prompt File Viewer retained)', 'info');
    }
  };

  // Drag start from left palette
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Save graph config as .json file
  const handleSaveGraph = () => {
    const cleanNodes = nodes.map(({ id, type, position, data }) => ({
      id,
      type,
      position,
      data: { 
        text: data.text, 
        filename: data.filename,
        questions: data.questions,
        answers: data.answers,
        numQuestions: data.numQuestions,
        numInputs: data.numInputs,
        files: data.files,
        extractedMemory: data.extractedMemory
      }
    }));

    const cleanEdges = edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
      id, source, target, sourceHandle, targetHandle
    }));

    const graph = {
      version: 1,
      nodes: cleanNodes,
      edges: cleanEdges
    };

    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plg-graph.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Graph configuration downloaded as plg-graph.json', 'ok');
  };

  // Trigger file loader
  const handleTriggerLoad = () => {
    document.getElementById('fileInput').click();
  };

  // Handle loading file
  const handleLoadGraph = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const g = JSON.parse(reader.result);
        
        // Re-inject core bindings and handlers to loaded elements
        let loadedNodes = (g.nodes || []).map((node) => ({
          ...node,
          data: {
            ...node.data,
            ...bindNodeCallbacks(node.id, node.type)
          }
        }));

        // Enforce singleton constraint: keep only the first fileViewer node if multiple exist
        const fileViewers = loadedNodes.filter(n => n.type === 'fileViewer');
        if (fileViewers.length > 1) {
          const firstFvId = fileViewers[0].id;
          loadedNodes = loadedNodes.filter(n => n.type !== 'fileViewer' || n.id === firstFvId);
        }

        // If no fileViewer node exists, append one by default
        if (!loadedNodes.some(n => n.type === 'fileViewer')) {
          const id = `fv_${Date.now()}`;
          loadedNodes.push({
            id,
            type: 'fileViewer',
            position: { x: 1100, y: 250 },
            data: { ...bindNodeCallbacks(id, 'fileViewer') }
          });
        }

        const loadedEdges = (g.edges || []).filter(edge => {
          // Filter out edges to fileViewer nodes that were removed to prevent duplicate/orphaned links
          const sourceExists = loadedNodes.some(n => n.id === edge.source);
          const targetExists = loadedNodes.some(n => n.id === edge.target);
          return sourceExists && targetExists;
        }).map((edge) => {
          const isFileEdge = edge.sourceHandle === 'file';
          const isQuestionsEdge = edge.sourceHandle === 'questions';
          const edgeColor = isFileEdge ? 'var(--file)' : isQuestionsEdge ? '#fb923c' : 'var(--prompt)';
          return {
            ...edge,
            style: { stroke: edgeColor },
            markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: edgeColor }
          };
        });

        setNodes(loadedNodes);
        setEdges(loadedEdges);
        showToast('Graph configuration loaded successfully', 'ok');
        

      } catch (err) {
        showToast('Could not load that file. Assert it is a valid PLG JSON config.', 'err');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export compiled prompt string to plain text (.txt)
  const handleExportTxt = () => {
    const fvNode = nodes.find((n) => n.type === 'fileViewer');
    const posPrompt = fvNode?.data?.compiledPositive || '';

    if (!posPrompt) {
      showToast('No compiled prompt inside Prompt File Viewer to export. Compile the graph first.', 'info');
      return;
    }

    const filename = fileTitle || 'prompt.txt';
    const fileBody = `# Compiled Prompt\n${posPrompt}\n`;
    
    const blob = new Blob([fileBody], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Compiled prompt exported to ${filename}`, 'ok');
  };

  return (
    <div className="app">
      {/* 1. Top bar */}
      <div className="topbar">
        <div className="brand">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h3M16 9h3M16 15h3" />
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="20" cy="9" r="1.6" />
              <circle cx="20" cy="15" r="1.6" />
              <path d="M8 8h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4H8z" />
            </svg>
          </div>
          <div>
            <div className="name">PLG <b>·</b> Prompt Logic Gates</div>
            <div className="sub">Semantic Prompt Compiler</div>
          </div>
        </div>

        <div className="spacer"></div>

        <span className="pill">
          Mode: <b>{settings.mode === 'ai' 
            ? (settings.provider === 'anthropic' ? 'Claude' : settings.provider === 'openai' ? 'ChatGPT' : settings.provider === 'google' ? 'Gemini' : 'OpenRouter')
            : 'Rule-based'
          }</b>
        </span>

        <button className="tbtn" onClick={() => setSettingsOpen(true)} title="Connect AI APIs">
          <Settings size={15} />
          AI Models
        </button>

        <button className="tbtn" onClick={handleNewProject} title="Create New Project">
          <FilePlus size={15} />
          New
        </button>

        <button className="tbtn" onClick={handleSaveGraph} title="Save Graph JSON">
          <Save size={15} />
          Save
        </button>

        <button className="tbtn" onClick={handleTriggerLoad} title="Load Graph JSON">
          <Upload size={15} />
          Load
        </button>

        <button className="tbtn primary" onClick={handleCompile} disabled={isCompiling}>
          {isCompiling ? (
            <Loader2 className="spin" size={15} />
          ) : (
            <Play size={15} />
          )}
          <span>{isCompiling ? 'Thinking...' : 'Compile'}</span>
        </button>
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="main">
        {/* Left Side Palette */}
        <div className="palette">
          <div className="pal-scroll">
            <div className="pal-h">Sources</div>
            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'fileNode')}
              onClick={() => {
                const id = `fn_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'fileNode',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { filename: 'prompt.txt', ...bindNodeCallbacks(id, 'fileNode') }
                }));
              }}
              style={{ '--accent': 'var(--file)' }}
            >
              <div className="ic">.txt</div>
              <div className="meta">
                <div className="t">File Node</div>
                <div className="d">Single source of truth</div>
              </div>
            </div>

            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'promptBox')}
              onClick={() => {
                const id = `pb_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'promptBox',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { text: '', ...bindNodeCallbacks(id, 'promptBox') }
                }));
              }}
              style={{ '--accent': 'var(--prompt)' }}
            >
              <div className="ic">"…"</div>
              <div className="meta">
                <div className="t">Prompt Box</div>
                <div className="d">A written prompt fragment</div>
              </div>
            </div>

            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'promptConcat')}
              onClick={() => {
                const id = `pc_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'promptConcat',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { numInputs: 2, ...bindNodeCallbacks(id, 'promptConcat') }
                }));
              }}
              style={{ '--accent': 'var(--ok)' }}
            >
              <div className="ic">++</div>
              <div className="meta">
                <div className="t">Prompt Concat</div>
                <div className="d">Join prompts with comma (,)</div>
              </div>
            </div>

            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'fileViewer')}
              onClick={() => {
                const exists = nodes.some((n) => n.type === 'fileViewer');
                if (exists) {
                  showToast('Only one Prompt File Viewer node is allowed.', 'err');
                  return;
                }
                const id = `fv_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'fileViewer',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { ...bindNodeCallbacks(id, 'fileViewer') }
                }));
              }}
              style={{ '--accent': 'var(--file)' }}
            >
              <div className="ic">👁</div>
              <div className="meta">
                <div className="t">File Viewer</div>
                <div className="d">Realtime prompt monitor</div>
              </div>
            </div>

            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'fileToPrompt')}
              onClick={() => {
                const id = `ftp_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'fileToPrompt',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { ...bindNodeCallbacks(id, 'fileToPrompt') }
                }));
              }}
              style={{ '--accent': 'var(--file)' }}
            >
              <div className="ic">➜</div>
              <div className="meta">
                <div className="t">File to Prompt</div>
                <div className="d">Type converter node</div>
              </div>
            </div>

            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'promptToFile')}
              onClick={() => {
                const id = `ptf_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'promptToFile',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { ...bindNodeCallbacks(id, 'promptToFile') }
                }));
              }}
              style={{ '--accent': 'var(--file)' }}
            >
              <div className="ic">📄</div>
              <div className="meta">
                <div className="t">Prompt to File</div>
                <div className="d">Convert prompt text to file stream</div>
              </div>
            </div>

            <div className="pal-h">Context Memory</div>
            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'contextMemory')}
              onClick={() => {
                const id = `mem_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'contextMemory',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { files: [], extractedMemory: '', isExtracting: false, ...bindNodeCallbacks(id, 'contextMemory') }
                }));
               }}
              style={{ '--accent': 'var(--memory)' }}
            >
              <div className="ic">🧠</div>
              <div className="meta">
                <div className="t">Memory Bank</div>
                <div className="d">Sync codebase &amp; variables</div>
              </div>
            </div>

            <div className="pal-h">Logic Gates</div>
            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'and')}
              onClick={() => {
                const id = `and_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'and',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { ...bindNodeCallbacks(id, 'and') }
                }));
              }}
              style={{ '--accent': 'var(--and)' }}
            >
              <div className="ic">&amp;</div>
              <div className="meta">
                <div className="t">AND Gate</div>
                <div className="d">Merge &amp; rank priorities</div>
              </div>
            </div>

            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'or')}
              onClick={() => {
                const id = `or_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'or',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { ...bindNodeCallbacks(id, 'or') }
                }));
              }}
              style={{ '--accent': 'var(--or)' }}
            >
              <div className="ic">≥1</div>
              <div className="meta">
                <div className="t">OR Gate</div>
                <div className="d">Context selection</div>
              </div>
            </div>

            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'not')}
              onClick={() => {
                const id = `not_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'not',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { ...bindNodeCallbacks(id, 'not') }
                }));
              }}
              style={{ '--accent': 'var(--not)' }}
            >
              <div className="ic">¬</div>
              <div className="meta">
                 <div className="t">NOT Gate</div>
                 <div className="d">Explicit negation control</div>
              </div>
            </div>

            <div className="pal-h">Human-in-the-Loop</div>
            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'askQuestion')}
              onClick={() => {
                const id = `aq_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'askQuestion',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { questions: [], ...bindNodeCallbacks(id, 'askQuestion') }
                }));
              }}
              style={{ '--accent': '#fb923c' }}
            >
              <div className="ic">?</div>
              <div className="meta">
                <div className="t">Ask AI Questions</div>
                <div className="d">Find prompt gaps &amp; ambiguities</div>
              </div>
            </div>

            <div 
              className="pnode" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'answerQuestions')}
              onClick={() => {
                const id = `an_${Date.now()}`;
                setNodes((nds) => nds.concat({
                  id, type: 'answerQuestions',
                  position: { x: 100 + Math.random() * 80, y: 150 + Math.random() * 80 },
                  data: { questions: [], answers: {}, ...bindNodeCallbacks(id, 'answerQuestions') }
                }));
              }}
              style={{ '--accent': '#fb923c' }}
            >
              <div className="ic">✓</div>
              <div className="meta">
                <div className="t">Provide Answers</div>
                <div className="d">Answer AI to refine prompt</div>
              </div>
            </div>
          </div>

          <div className="legend">
            <div className="lh">Pin Connections</div>
            <div className="lrow">
              <span className="ldot file"></span> 
              <span>File Reference</span>
            </div>
            <div className="lrow">
              <span className="ldot prompt"></span> 
              <span>Prompt Content</span>
            </div>
            <div className="tip">
              Drag edge from an <b>output</b> pin to a matching <b>input</b> pin. Pin types must match.
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <PLGCanvas 
          nodes={nodes}
          edges={edges}
          onNodesChange={customOnNodesChange}
          onEdgesChange={onEdgesChange}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodeSelect={() => {}}
          showToast={showToast}
          bindNodeCallbacks={bindNodeCallbacks}
        />

        {/* Right Inspector with Pipeline Debugger */}
        <Inspector 
          compileResult={compileResult}
          onClearCanvas={handleClearCanvas}
          onExportTxt={handleExportTxt}
          fileTitle={fileTitle}
          compilationMode={compilationMode}
          onChangeCompilationMode={handleCompilationModeChange}
        />
      </div>

      {/* 3. Settings Modal */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      {/* 4. Toast Notifications */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        {toast.type === 'load' && <span className="spin"></span>}
        <span>{toast.text}</span>
      </div>

      <input 
        type="file" 
        id="fileInput" 
        accept=".json" 
        style={{ display: 'none' }} 
        onChange={handleLoadGraph}
      />
    </div>
  );
}

// Wrap application inside ReactFlowProvider so custom coordinate hooks work smoothly
export default function App() {
  return (
    <ReactFlowProvider>
      <PLGApp />
    </ReactFlowProvider>
  );
}
