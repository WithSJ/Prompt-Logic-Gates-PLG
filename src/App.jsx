import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import { Play, Settings, Save, Upload, HelpCircle, Loader2, FilePlus } from 'lucide-react';
import PLGCanvas from './components/PLGCanvas';
import Inspector from './components/Inspector';
import SettingsModal from './components/SettingsModal';
import { compileGraph } from './compiler/semanticCompiler';

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
      onDeleteNode: () => {
        if (type === 'fileViewer') return;
        setNodes((nds) => nds.filter((n) => n.id !== nId));
        setEdges((eds) => eds.filter((e) => e.source !== nId && e.target !== nId));
      }
    };
  }, [setNodes, setEdges]);

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
        compiledNegative: data.compiledNegative
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
      const result = await compileGraph(nodes, edges, settings);
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
          // Trace intermediate prompt state recursively back through 'file' handle paths
          const traceBackState = (nodeId) => {
            const edge = edges.find((e) => e.target === nodeId && e.targetHandle === 'file');
            if (!edge) return { positive: '', negative: '' };
            
            const sourceNode = nds.find((sn) => sn.id === edge.source);
            if (!sourceNode) return { positive: '', negative: '' };
            
            if (sourceNode.type === 'fileNode') {
              return { positive: '', negative: '' };
            }
            
            if (['and', 'or', 'not', 'askQuestion', 'answerQuestions', 'promptToFile'].includes(sourceNode.type)) {
              return result.gateStates[sourceNode.id] || { positive: '', negative: '' };
            }
            
            if (sourceNode.type === 'fileViewer' || sourceNode.type === 'fileToPrompt') {
              return traceBackState(sourceNode.id);
            }
            
            return { positive: '', negative: '' };
          };

          let stateAtViewer = traceBackState(n.id);
          if (!stateAtViewer.positive && !stateAtViewer.negative) {
            stateAtViewer = {
              positive: result.positive,
              negative: result.negative
            };
          }
          return {
            ...n,
            data: {
              ...n.data,
              compiledPositive: stateAtViewer.positive,
              compiledNegative: stateAtViewer.negative
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
        numInputs: data.numInputs
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

  // Export positive and negative compiled prompt strings to plain text (.txt)
  const handleExportTxt = () => {
    const fvNode = nodes.find((n) => n.type === 'fileViewer');
    const posPrompt = fvNode?.data?.compiledPositive || '';
    const negPrompt = fvNode?.data?.compiledNegative || '';

    if (!posPrompt && !negPrompt) {
      showToast('No compiled prompts inside Prompt File Viewer to export. Compile the graph first.', 'info');
      return;
    }

    const filename = fileTitle || 'prompt.txt';
    const fileBody = `# Compiled Positive Prompt\n${posPrompt}\n\n# Compiled Negative Prompt\n${negPrompt}\n`;
    
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
                <div className="d">Negative prompt control</div>
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
        />

        {/* Right Inspector with Pipeline Debugger */}
        <Inspector 
          compileResult={compileResult}
          onClearCanvas={handleClearCanvas}
          onExportTxt={handleExportTxt}
          fileTitle={fileTitle}
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
