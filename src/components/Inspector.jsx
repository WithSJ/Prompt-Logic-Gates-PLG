import React, { useState } from 'react';
import { Copy, Download, Trash, ChevronDown, ChevronUp, FileCode, CheckCircle, Sparkles, Zap, Brain, Cpu, Layers } from 'lucide-react';

const CAT_COLORS = { 
  subject: 'var(--not)', 
  environment: 'var(--file)', 
  action: '#fb923c', 
  emotion: '#f472b6', 
  lighting: '#facc15', 
  style: 'var(--or)', 
  camera: 'var(--and)', 
  effects: 'var(--prompt)', 
  detail: 'var(--txt-faint)' 
};

export default function Inspector({ 
  compileResult, 
  onClearCanvas, 
  onExportTxt, 
  fileTitle,
  compilationMode = 'normal',
  onChangeCompilationMode,
  priorityDomain = 'auto',
  onChangePriorityDomain
}) {
  const [copiedPos, setCopiedPos] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);
  const [openStages, setOpenStages] = useState({ 0: true }); // Default expand Stage 1

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text || '');
      if (type === 'pos') {
        setCopiedPos(true);
        setTimeout(() => setCopiedPos(false), 1500);
      } else {
        setCopiedNeg(true);
        setTimeout(() => setCopiedNeg(false), 1500);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleStage = (index) => {
    setOpenStages((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const keptItems = compileResult ? compileResult.items.filter(p => !p._drop) : [];

  return (
    <div className="inspector">
      <div className="insp-head">
        <FileCode size={18} style={{ color: 'var(--file)' }} />
        <span className="ti">{fileTitle || 'prompt.txt'}</span>
        <span className="ro">Read-Only</span>
      </div>

      <div className="insp-scroll">
        {/* Compiler Priority Schema Selector */}
        <div className="osec" style={{ marginBottom: 16 }}>
          <div className="osec-h">
            <span className="sq" style={{ background: priorityDomain === 'auto' ? 'var(--ok)' : priorityDomain === 'image' ? 'var(--prompt)' : priorityDomain === 'code' ? 'var(--and)' : priorityDomain === 'debug' ? 'var(--not)' : priorityDomain === 'architecture' ? 'var(--file)' : 'var(--memory)' }}></span>
            Compiler Priority Schema
          </div>
          <div style={{ marginTop: 8 }}>
            <select 
              value={priorityDomain}
              onChange={(e) => onChangePriorityDomain && onChangePriorityDomain(e.target.value)}
              className="priority-select"
              title="Select dynamic sorting priority schema for compilation flow"
            >
              <option value="auto">💡 Auto Detect (Lexical/AI Classifier)</option>
              <option value="image">🎨 Image Generation (Art & Visuals)</option>
              <option value="code">💻 Code Generation & Programming</option>
              <option value="debug">🐞 Bug Finding & Debugging</option>
              <option value="architecture">🏛 Software Architecture & Design</option>
              <option value="gui">🎨 GUI & UI/UX Design Layout</option>
            </select>
          </div>
        </div>

        {/* Compilation Depth Selector */}
        <div className="osec" style={{ marginBottom: 16 }}>
          <div className="osec-h">
            <span className="sq" style={{ background: compilationMode === 'normal' ? 'var(--prompt)' : compilationMode === 'thinking' ? 'var(--or)' : 'var(--file)' }}></span>
            Compilation Depth
          </div>
          <div className="thought-selector">
            <button 
              className={`thought-btn ${compilationMode === 'normal' ? 'active normal' : ''}`}
              onClick={() => onChangeCompilationMode && onChangeCompilationMode('normal')}
              title="Compile the visual pipeline prompt exactly as it is built (Normal mode)"
            >
              <Zap />
              Normal
            </button>
            <button 
              className={`thought-btn ${compilationMode === 'thinking' ? 'active thinking' : ''}`}
              onClick={() => onChangeCompilationMode && onChangeCompilationMode('thinking')}
              title="Rephrase, polish, and enrich the prompt beautifully using semantic details (Thinking mode)"
            >
              <Brain />
              Thinking
            </button>
            <button 
              className={`thought-btn ${compilationMode === 'deep-thinking' ? 'active deep' : ''}`}
              onClick={() => onChangeCompilationMode && onChangeCompilationMode('deep-thinking')}
              title="Compile the prompt into a deeply detailed technical Markdown specification (DeepThinking mode)"
            >
              <Cpu />
              Deep
            </button>
          </div>
        </div>

        {!compileResult ? (
          <div className="empty-state">
            <Sparkles size={38} style={{ color: 'var(--prompt)' }} />
            <div>
              Wire up a graph on the canvas and hit <b style={{ color: 'var(--prompt)' }}>Compile</b> to assemble your optimized prompt.
            </div>
          </div>
        ) : (
          <>
            {/* 1. Compiled Prompt */}
            <div className="osec">
              <div className="osec-h">
                <span className="sq" style={{ background: 'var(--ok)' }}></span>
                Compiled Prompt
                <button className="copybtn" onClick={() => handleCopy(compileResult.positive, 'pos')}>
                  {copiedPos ? 'copied' : 'copy'}
                </button>
              </div>
              <div className={`obox pos ${compileResult.positive ? '' : 'empty'}`}>
                {compileResult.positive || 'nothing compiled yet'}
              </div>
            </div>

            {/* 3. Visual Compiler Pipeline Debugger */}
            <div className="osec">
              <div className="osec-h">
                <span className="sq" style={{ background: 'var(--or)' }}></span>
                Visual Compiler Pipeline
              </div>
              
              <div className="pipeline-stages">
                {compileResult.stages && compileResult.stages.map((stage, idx) => (
                  <div className="stage-item" key={idx}>
                    <div className="stage-header" onClick={() => toggleStage(idx)}>
                      <span className="num">{idx + 1}</span>
                      <span style={{ color: 'var(--txt)' }}>{stage.name}</span>
                      
                      <span className={`status ${stage.type}`}>
                        {stage.status}
                      </span>
                      
                      <span style={{ marginLeft: 6, display: 'flex', alignItems: 'center' }}>
                        {openStages[idx] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </span>
                    </div>

                    {openStages[idx] && (
                      <div className="stage-content">
                        {stage.desc.split('\n').map((line, lIdx) => (
                          <div key={lIdx} style={{ marginBottom: lIdx < stage.desc.split('\n').length - 1 ? 4 : 0 }}>
                            {line}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Compilation Breakdown */}
            {compileResult.items && compileResult.items.length > 0 && (
              <div className="osec">
                <div className="osec-h">
                  <span className="sq" style={{ background: 'var(--prompt)' }}></span>
                  Compilation Breakdown
                  <span className="ct">{keptItems.length}/{compileResult.items.length} kept</span>
                </div>
                <div className="breakdown">
                  {compileResult.items.map((p, index) => (
                    <div className={`brow ${p._drop ? 'drop' : ''}`} key={index}>
                      <span className="bn" title={p._drop || undefined}>{p.text}</span>
                      <span 
                        className="cat" 
                        style={{ 
                          color: CAT_COLORS[p.category], 
                          background: `color-mix(in srgb, ${CAT_COLORS[p.category]} 15%, transparent)` 
                        }}
                      >
                        {p.category}
                      </span>
                      <span className="pr">{p.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="insp-foot">
        <button className="tbtn" onClick={onExportTxt} disabled={!compileResult}>
          <Download size={14} />
          Export .txt
        </button>
        <button className="tbtn danger" onClick={onClearCanvas}>
          <Trash size={14} />
          Clear All
        </button>
      </div>
    </div>
  );
}
