import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Type, Trash2, HelpCircle, CheckSquare } from 'lucide-react';

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

  return (
    <div className={`rf-node ${selected ? 'selected' : ''}`} style={{ '--accent': 'var(--prompt)' }}>
      <NodeHeader 
        title="Prompt Box" 
        accent="var(--prompt)" 
        icon={Type} 
        onDelete={onDelete}
      />
      <div className="rf-node-body">
        <textarea
          value={text}
          onChange={(e) => data.onChangeText(id, e.target.value)}
          placeholder="Type a prompt fragment... e.g., abandoned hospital"
          className="nodrag"
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="prompt"
        style={{ top: '68px' }}
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
          Reads <b>file</b> → writes <b>A</b> into negative memory to suppress it.
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
        title="Negative Prompt A"
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
  const negText = data.compiledNegative || '';

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
            Positive Prompt
          </div>
          <div style={{ 
            background: 'var(--bg)', 
            border: '1px solid var(--line)', 
            borderRadius: '6px', 
            padding: '6px 8px', 
            fontSize: '11px', 
            fontFamily: 'var(--mono)', 
            minHeight: '34px', 
            maxHeight: '70px', 
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            color: posText ? 'var(--txt)' : 'var(--txt-faint)',
            fontStyle: posText ? 'normal' : 'italic'
          }}>
            {posText || 'empty baseline'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--not)', fontWeight: '600' }}>
            Negative Prompt
          </div>
          <div style={{ 
            background: 'var(--bg)', 
            border: '1px solid var(--line)', 
            borderRadius: '6px', 
            padding: '6px 8px', 
            fontSize: '11px', 
            fontFamily: 'var(--mono)', 
            minHeight: '34px', 
            maxHeight: '70px', 
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            color: negText ? 'var(--txt)' : 'var(--txt-faint)',
            fontStyle: negText ? 'normal' : 'italic'
          }}>
            {negText || 'none'}
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
        style={{ top: '40%' }}
        title="Clarifying Questions List"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="file"
        className="file"
        style={{ top: '70%' }}
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
};
