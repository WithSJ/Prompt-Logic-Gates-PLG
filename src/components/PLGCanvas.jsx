import React, { useRef, useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useReactFlow, 
  addEdge, 
  MarkerType 
} from '@xyflow/react';
import { nodeTypes } from './CustomNodes';

// Custom connection line style based on HSL theme
const connectionLineStyle = {
  strokeWidth: 2.5,
  strokeDasharray: '6 5'
};

export default function PLGCanvas({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  setNodes, 
  setEdges,
  onNodeSelect,
  showToast,
  bindNodeCallbacks
}) {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
 
  // Validate connections: File to File, Prompt to Prompt, Questions to Questions
  const isValidConnection = useCallback((connection) => {
    // 1. Prevent connecting a node to itself
    if (connection.source === connection.target) return false;
 
    // 2. Resolve handle types based on handles ID
    const isSourceFile = connection.sourceHandle === 'file';
    const isTargetFile = connection.targetHandle === 'file';
    const isSourceQuestions = connection.sourceHandle === 'questions';
    const isTargetQuestions = connection.targetHandle === 'questions';
 
    // File connections must match on both ends
    if (isSourceFile !== isTargetFile) return false;
    // Questions connections must match on both ends
    if (isSourceQuestions !== isTargetQuestions) return false;
 
    // 3. Ensure single connection per input handle (target)
    const targetHasEdge = edges.some(
      (edge) => edge.target === connection.target && edge.targetHandle === connection.targetHandle
    );
    if (targetHasEdge) return false;
 
    return true;
  }, [edges]);
 
  // Connect handler
  const onConnect = useCallback((params) => {
    // Determine edge color based on handle type
    const isFileEdge = params.sourceHandle === 'file';
    const isQuestionsEdge = params.sourceHandle === 'questions';
    const isMemoryEdge = params.sourceHandle === 'memory';
    const edgeColor = isFileEdge ? 'var(--file)' : isQuestionsEdge ? '#fb923c' : isMemoryEdge ? 'var(--memory)' : 'var(--prompt)';
 
    const newEdge = {
      ...params,
      id: `e_${params.source}_${params.sourceHandle}_to_${params.target}_${params.targetHandle}`,
      style: { stroke: edgeColor },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
        color: edgeColor,
      },
    };
 
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);
 
  // Drag over canvas helper
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
 
  // Drop element on canvas helper
  const onDrop = useCallback((event) => {
    event.preventDefault();
 
    const type = event.dataTransfer.getData('application/reactflow') || event.dataTransfer.getData('add');
    if (!type) return;
 
    if (type === 'fileViewer') {
      const exists = nodes.some((n) => n.type === 'fileViewer');
      if (exists) {
        if (showToast) {
          showToast('Only one Prompt File Viewer node is allowed.', 'err');
        } else {
          alert('Only one Prompt File Viewer node is allowed in the project.');
        }
        return;
      }
    }
 
    // Resolve node position on react flow grid
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
 
    const nodeId = `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    
    // Inject methods inside node data so nodes can update parent state directly
    const newNode = {
      id: nodeId,
      type,
      position,
      data: {
        title: type === 'contextMemory' ? 'Context Memory' : type.toUpperCase(),
        filename: type === 'fileNode' ? 'prompt.txt' : undefined,
        text: type === 'promptBox' ? '' : undefined,
        questions: type === 'askQuestion' || type === 'answerQuestions' ? [] : undefined,
        answers: type === 'answerQuestions' ? {} : undefined,
        numQuestions: type === 'askQuestion' ? 3 : undefined,
        files: type === 'contextMemory' ? [] : undefined,
        extractedMemory: type === 'contextMemory' ? '' : undefined,
        isExtracting: type === 'contextMemory' ? false : undefined,
        ...bindNodeCallbacks(nodeId, type)
      },
    };
 
    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes, setEdges, nodes, showToast, bindNodeCallbacks]);

  // Handle click node selections
  const onNodeClick = useCallback((_, node) => {
    onNodeSelect(node);
  }, [onNodeSelect]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div className="canvas-wrap" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        connectionLineStyle={connectionLineStyle}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
      >
        <Controls 
          showInteractive={false} 
          style={{ 
            backgroundColor: 'var(--panel2)', 
            border: '1px solid var(--line)', 
            borderRadius: '9px',
            boxShadow: '0 8px 24px -10px rgba(0,0,0,0.7)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        />
        <Background color="var(--line2)" gap={24} size={1} />
      </ReactFlow>

      <div className="hint">
        <kbd>drag handle</kbd> connect &nbsp; <kbd>drag bg</kbd> pan<br />
        <kbd>scroll</kbd> zoom &nbsp; <kbd>Del / Backspace</kbd> delete selected
      </div>
    </div>
  );
}
