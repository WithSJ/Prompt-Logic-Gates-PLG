import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Type, Trash2, HelpCircle, CheckSquare, Brain, Database, UploadCloud, X, FileCode } from 'lucide-react';

// Custom Delete Button for Header
const NodeHeader = ({ title, sub, accent, icon: Icon, onDelete }) => (
  <div className="rf-node-header" style={{ '--accent': accent }}>
    <span className="dot" style={{ backgroundColor: accent }}></span>
    {Icon && <Icon size={14} style={{ color: accent }} />}
    <span className="rf-node-title">
      {title}
      {sub && <small>{sub}</small>}
    </span>
    {onDelete && (
      <button 
        className="rf-node-del" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete Node"
      >
        <Trash2 size={13} />
      </button>
    )}
  </div>
);

// File Node Component
export const FileNode = memo(({ id, data, selected, context }) => {
  const onDelete = data.onDeleteNode || (() => {});
  const filename = data.filename || 'prompt.txt';
  
  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--file)' }}>
      <NodeHeader 
        title="File Node" 
        accent="var(--file)" 
        icon={FileText} 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        <div className="filerow">
          <FileText className="ficon" size={14} />
          <input
            type="text"
            value={filename}
            onChange={(e) => data.onChangeFilename(id, e.target.value)}
            className="nodrag"
            placeholder="prompt.txt"
          />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="file"
        className="file"
        style={{ top: '57px' }}
      />
    </div>
  );
});

// Prompt Box Component
export const PromptBoxNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});
  const text = data.text || '';
  const isRephrasing = data.isRephrasing || false;

  const handleRephrase = async (e) => {
    e.stopPropagation();
    if (data.onRephrasePrompt) {
      await data.onRephrasePrompt(id, text);
    }
  };

  const handleKeyDown = (e) => {
    // Intercept Ctrl+Z / Cmd+Z to undo AI rephrasing back to original user text
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      const userText = data.userText;
      if (userText !== undefined && userText !== text) {
        e.preventDefault();
        data.onChangeText(id, userText);
      }
    }
  };

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--prompt)' }}>
      <NodeHeader 
        title="Prompt Box" 
        accent="var(--prompt)" 
        icon={Type} 
        onDelete={onDelete}
      />
      <div className="rf-node-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <textarea
          value={text}
          onChange={(e) => data.onChangeText(id, e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a prompt fragment... e.g., abandoned hospital"
          className="nodrag"
        />
        <button
          className="prompt-rephrase-btn nodrag"
          onClick={handleRephrase}
          disabled={isRephrasing || !text.trim()}
          title="AI Rephrase (Press Ctrl+Z on textarea to undo)"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            height: '26px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease-in-out',
            background: isRephrasing ? 'var(--node-head)' : (text.trim() ? 'rgba(34, 211, 238, 0.12)' : 'var(--bg)'),
            border: `1px solid ${isRephrasing ? 'var(--line)' : (text.trim() ? 'var(--prompt)' : 'var(--line)')}`,
            color: isRephrasing ? 'var(--txt-faint)' : (text.trim() ? 'var(--prompt)' : 'var(--txt-faint)'),
          }}
        >
          {isRephrasing ? (
            <>
              <span className="spin" style={{ width: '10px', height: '10px', borderTopColor: 'var(--prompt)', borderLeftColor: 'transparent', borderStyle: 'solid', borderWidth: '1.5px', borderRadius: '50%', display: 'inline-block' }}></span>
              <span>Rephrasing...</span>
            </>
          ) : (
            <>
              <Brain size={12} />
              <span>AI Rephrase Fragment</span>
            </>
          )}
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="prompt"
        style={{ top: '50%' }}
      />
    </div>
  );
});

// AND Gate Node Component
export const ANDNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--and)' }}>
      <NodeHeader 
        title="AND Gate" 
        sub="merge & rank" 
        accent="var(--and)" 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        <div className="gate-desc">
          Reads <b>file</b> → ranks <b>A & B</b> by importance → merges in priority order.
        </div>
      </div>
      {/* Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="file"
        className="file"
        style={{ top: '50px' }}
        title="Input File State"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="prompt"
        style={{ top: '78px' }}
        title="Prompt A"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        className="prompt"
        style={{ top: '106px' }}
        title="Prompt B"
      />

      {/* Source Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="file"
        className="file"
        style={{ top: '78px' }}
      />
    </div>
  );
});

// OR Gate Node Component
export const ORNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--or)' }}>
      <NodeHeader 
        title="OR Gate" 
        sub="context select" 
        accent="var(--or)" 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        <div className="gate-desc">
          Reads <b>file</b> → compares <b>A vs B</b> → keeps the best-fitting context candidate.
        </div>
      </div>
      {/* Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="file"
        className="file"
        style={{ top: '50px' }}
        title="Input File State"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="prompt"
        style={{ top: '78px' }}
        title="Prompt A"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        className="prompt"
        style={{ top: '106px' }}
        title="Prompt B"
      />

      {/* Source Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="file"
        className="file"
        style={{ top: '78px' }}
      />
    </div>
  );
});

// NOT Gate Node Component
export const NOTNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--not)' }}>
      <NodeHeader 
        title="NOT Gate" 
        sub="suppress" 
        accent="var(--not)" 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        <div className="gate-desc">
          Reads <b>file</b> → strips <b>A</b> and injects negative instructions to suppress A.
        </div>
      </div>
      {/* Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="file"
        className="file"
        style={{ top: '50px' }}
        title="Input File State"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="prompt"
        style={{ top: '78px' }}
        title="Concept A to suppress"
      />

      {/* Source Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="file"
        className="file"
        style={{ top: '64px' }}
      />
    </div>
  );
});

// File Viewer Node Component
export const FileViewerNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});
  const posText = data.compiledPositive || '';

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--file)', width: '280px' }}>
      <NodeHeader 
        title="Prompt File Viewer" 
        sub="realtime state" 
        accent="var(--file)" 
        icon={FileText} 
        onDelete={null}
      />
      <div className="rf-node-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--ok)', fontWeight: '600' }}>
            Compiled Prompt
          </div>
          <div style={{ 
            background: 'var(--bg)', 
            border: '1px solid var(--line)', 
            borderRadius: '6px', 
            padding: '6px 8px', 
            fontSize: '11.5px', 
            fontFamily: 'var(--mono)', 
            minHeight: '70px', 
            maxHeight: '130px', 
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            color: posText ? 'var(--txt)' : 'var(--txt-faint)',
            fontStyle: posText ? 'normal' : 'italic',
            lineHeight: '1.4'
          }}>
            {posText || 'empty baseline'}
          </div>
        </div>
      </div>
      
      {/* Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="file"
        className="file"
        style={{ top: '50%' }}
        title="Input File State"
      />
      {/* Source Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="file"
        className="file"
        style={{ top: '50%' }}
        title="Output File State"
      />
    </div>
  );
});

// File to Prompt Converter Node Component
export const FileToPromptNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--file)' }}>
      <NodeHeader 
        title="File to Prompt" 
        sub="type converter" 
        accent="var(--file)" 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        <div className="gate-desc">
          Reads compiled <b>file</b> ➜ outputs as text <b>prompt</b>.
        </div>
      </div>
      {/* Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="file"
        className="file"
        style={{ top: '50%' }}
        title="Input File State"
      />
      {/* Source Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="prompt"
        style={{ top: '50%' }}
        title="Output Prompt Text"
      />
    </div>
  );
});

// Ask Clarifying Questions Node Component
export const AskQuestionNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});
  const questions = data.questions || [];

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': '#fb923c', width: '260px' }}>
      <NodeHeader 
        title="Ask AI Questions" 
        sub="clarification" 
        accent="#fb923c" 
        icon={HelpCircle} 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--txt-dim)', fontWeight: '500' }}>Question Count:</span>
          <input
            type="number"
            min="1"
            max="10"
            value={data.numQuestions !== undefined ? data.numQuestions : 3}
            onChange={(e) => {
              const val = Math.max(1, Math.min(10, parseInt(e.target.value) || 3));
              data.onChangeNumQuestions(id, val);
            }}
            className="nodrag"
            style={{
              width: '45px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: '5px',
              color: '#fb923c',
              padding: '2px 6px',
              fontSize: '11px',
              fontFamily: 'var(--mono)',
              textAlign: 'center',
              fontWeight: '600'
            }}
          />
        </div>

        {questions.length === 0 ? (
          <div style={{ fontSize: '11px', color: 'var(--txt-faint)', fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>
            Compile the graph to analyze prompt and generate clarifying questions...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--txt-dim)', marginBottom: '2px', fontWeight: '500' }}>
              AI is confused about these details:
            </div>
            {questions.map((q, idx) => (
              <div key={idx} style={{ 
                fontSize: '11px', 
                lineHeight: '1.4', 
                background: 'var(--bg)', 
                border: '1px solid var(--line)', 
                borderRadius: '6px', 
                padding: '6px 8px', 
                color: 'var(--txt-dim)' 
              }}>
                <b>{idx + 1}.</b> {q}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="file"
        className="file"
        style={{ top: '40%' }}
        title="Input File State"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="questions"
        className="questions"
        style={{ top: '70%' }}
        title="Already Asked Questions List to Exclude"
      />
      {/* Source Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="questions"
        className="questions"
        style={{ top: '50%' }}
        title="Clarifying Questions List"
      />
    </div>
  );
});

// Provide Answers Node Component
export const AnswerQuestionsNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});
  const questions = data.questions || [];
  const answers = data.answers || {};

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': '#fb923c', width: '320px' }}>
      <NodeHeader 
        title="Provide Answers" 
        sub="prompt refiner" 
        accent="#fb923c" 
        icon={CheckSquare} 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        {questions.length === 0 ? (
          <div style={{ fontSize: '11px', color: 'var(--txt-faint)', fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>
            Connect to Ask Question node output pin to display and answer clarifying questions...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {questions.map((q, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--txt-dim)', lineHeight: '1.3' }}>
                  <b>Q{idx + 1}:</b> {q}
                </div>
                <textarea
                  value={answers[idx] || ''}
                  onChange={(e) => data.onChangeAnswer(id, idx, e.target.value)}
                  placeholder="Type your answer..."
                  className="nodrag"
                  style={{ 
                    minHeight: '40px', 
                    fontSize: '11.5px', 
                    padding: '6px 8px',
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    color: 'var(--txt)',
                    resize: 'vertical',
                    width: '100%',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="questions"
        className="questions"
        style={{ top: '35%' }}
        title="Clarifying Questions List"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="file"
        className="file"
        style={{ top: '65%' }}
        title="Input File State"
      />

      {/* Source Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="prompt"
        style={{ top: '40%' }}
        title="Output Clarified Prompt Text"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="file"
        className="file"
        style={{ top: '70%' }}
        title="Output Compiled File Stream"
      />
    </div>
  );
});

// Prompt Concatenate Node Component
export const PromptConcatNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});
  const numInputs = data.numInputs !== undefined ? data.numInputs : 2;
  
  const rows = Array.from({ length: numInputs });
  
  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--ok)', width: '200px' }}>
      <NodeHeader 
        title="Prompt Concat" 
        sub="join prompts" 
        accent="var(--ok)" 
        onDelete={onDelete}
      />
      <div className="rf-node-body" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--txt-dim)', fontWeight: '500' }}>Inputs Count:</span>
          <input
            type="number"
            min="2"
            max="10"
            value={numInputs}
            onChange={(e) => {
              const val = Math.max(2, Math.min(10, parseInt(e.target.value) || 2));
              data.onChangeNumInputs(id, val);
            }}
            className="nodrag"
            style={{
              width: '45px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: '5px',
              color: 'var(--ok)',
              padding: '2px 6px',
              fontSize: '11px',
              fontFamily: 'var(--mono)',
              textAlign: 'center',
              fontWeight: '600'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          {rows.map((_, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '11px', 
              fontFamily: 'var(--mono)', 
              color: 'var(--txt-faint)', 
              height: '20px', 
              paddingLeft: '4px' 
            }}>
              Prompt {idx + 1}
            </div>
          ))}
        </div>
      </div>
      
      {/* Dynamic Left Input Handles */}
      {rows.map((_, idx) => {
        const topOffset = 62 + idx * 28;
        return (
          <Handle
            key={idx}
            type="target"
            position={Position.Left}
            id={`p${idx}`}
            className="prompt"
            style={{ top: `${topOffset}px` }}
            title={`Input Prompt ${idx + 1}`}
          />
        );
      })}
      
      {/* Right Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="prompt"
        style={{ top: '50%' }}
        title="Joined Prompt Output"
      />
    </div>
  );
});

// Prompt to File Node Component
export const PromptToFileNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--file)' }}>
      <NodeHeader 
        title="Prompt to File" 
        sub="type converter" 
        accent="var(--file)" 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        <div className="gate-desc">
          Takes text <b>prompt</b> ➜ rewrites as compiled <b>file</b> baseline stream.
        </div>
      </div>
      {/* Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        className="prompt"
        style={{ top: '50%' }}
        title="Input Prompt Text"
      />
      {/* Source Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="file"
        className="file"
        style={{ top: '50%' }}
        title="Output File Stream"
      />
    </div>
  );
});

// Context Memory Node Component
export const ContextMemoryNode = memo(({ id, data, selected }) => {
  const onDelete = data.onDeleteNode || (() => {});
  const files = data.files || [];
  const extractedMemory = data.extractedMemory || '';
  const isExtracting = data.isExtracting || false;

  const triggerFileSelect = () => {
    document.getElementById("file_upload_" + id)?.click();
  };

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length > 0) {
      data.onAddFiles(id, fileList);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const fileList = Array.from(e.dataTransfer.files || []);
    const validFiles = fileList.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['md', 'txt', 'html', 'json', 'xml'].includes(ext);
    });
    if (validFiles.length > 0) {
      data.onAddFiles(id, validFiles);
    }
  };

  const enabled = data.enabled !== false;

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': enabled ? 'var(--memory)' : 'var(--txt-faint)', width: '280px', opacity: enabled ? 1 : 0.75 }}>
      <NodeHeader 
        title="Context Memory" 
        sub={enabled ? "active global" : "inactive"} 
        accent={enabled ? "var(--memory)" : "var(--txt-faint)"} 
        icon={Brain} 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        {/* Toggle active switch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontSize: '10px', color: 'var(--txt-dim)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Global Context:</span>
          <button 
            className="nodrag" 
            onClick={() => data.onToggleEnabled?.(id)}
            style={{
              background: enabled ? 'rgba(52, 211, 153, 0.12)' : 'rgba(248, 113, 113, 0.12)',
              border: '1px solid ' + (enabled ? 'var(--ok)' : 'var(--err)'),
              borderRadius: '6px',
              color: enabled ? 'var(--ok)' : 'var(--err)',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: enabled ? 'var(--ok)' : 'var(--err)', display: 'inline-block' }}></span>
            {enabled ? 'ACTIVE' : 'INACTIVE'}
          </button>
        </div>
        {/* Upload dashed zone */}
        <div 
          className="memory-upload-zone nodrag"
          onClick={triggerFileSelect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <UploadCloud size={18} />
          <span style={{ fontSize: '11px', fontWeight: '500' }}>Drop or Click to Upload</span>
          <span style={{ fontSize: '9px', opacity: 0.6 }}>.md, .txt, .html, .json, .xml</span>
        </div>
        <input 
          type="file" 
          multiple 
          id={"file_upload_" + id} 
          style={{ display: 'none' }} 
          accept=".md,.txt,.html,.json,.xml" 
          onChange={handleFileChange}
          className="nodrag"
        />

        {/* Uploaded Files list */}
        {files.length > 0 && (
          <div className="memory-file-list nodrag">
            {files.map((file, idx) => (
              <div className="memory-file-item" key={idx}>
                <FileCode size={12} style={{ color: 'var(--memory)' }} />
                <span className="name" title={file.name}>{file.name}</span>
                <span className="size">{(file.size / 1024).toFixed(1)}k</span>
                <button 
                  className="del"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onDeleteFile(id, idx);
                  }}
                  title="Remove File"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Build Button */}
        <button
          className="memory-btn nodrag"
          onClick={() => data.onExtractMemory(id)}
          disabled={isExtracting || files.length === 0}
        >
          {isExtracting ? (
            <>
              <span className="spin" style={{ borderTopColor: '#fff', width: '12px', height: '12px' }}></span>
              <span>Syncing Memory...</span>
            </>
          ) : (
            <>
              <Brain size={13} />
              <span>Build Context Memory</span>
            </>
          )}
        </button>

        {/* Extracted Text Preview */}
        <div className="memory-section-title">Context Memory Preview (.md)</div>
        <textarea
          value={extractedMemory}
          onChange={(e) => data.onChangeMemoryText(id, e.target.value)}
          placeholder="No memory built yet. Load files above and click 'Build Context Memory' to parse key terms..."
          className="nodrag"
          style={{ 
            minHeight: '100px', 
            fontSize: '11px', 
            fontFamily: 'var(--mono)',
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: '6px',
            color: 'var(--txt)',
            resize: 'vertical',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
      </div>


    </div>
  );
});

// Pack custom node types for React Flow registry
export const nodeTypes = {
  fileNode: FileNode,
  promptBox: PromptBoxNode,
  and: ANDNode,
  or: ORNode,
  not: NOTNode,
  fileViewer: FileViewerNode,
  fileToPrompt: FileToPromptNode,
  askQuestion: AskQuestionNode,
  answerQuestions: AnswerQuestionsNode,
  promptConcat: PromptConcatNode,
  promptToFile: PromptToFileNode,
  contextMemory: ContextMemoryNode,
};
