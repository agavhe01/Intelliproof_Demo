import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { ArgumentNode } from './nodes/ArgumentNode';
import { ArgumentEdge } from './edges/ArgumentEdge';
import { type ArgumentNode as ArgumentNodeType, type ArgumentEdge as ArgumentEdgeType, type ClaimType } from './nodes/types';

// Example initial nodes
const initialNodes: ArgumentNodeType[] = [
  {
    id: '1',
    type: 'argument',
    position: { x: 0, y: 0 },
    data: {
      text: 'Climate change is real',
      type: 'factual',
      belief: 0.9,
      author: 'John Doe',
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: '2',
    type: 'argument',
    position: { x: 200, y: 100 },
    data: {
      text: 'We should reduce carbon emissions',
      type: 'policy',
      belief: 0.8,
      author: 'Jane Smith',
      createdAt: new Date().toISOString(),
    },
  },
];

// Example initial edges
const initialEdges: ArgumentEdgeType[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    weight: 0.8,
  },
];

const nodeTypes = {
  argument: ArgumentNode,
};

const edgeTypes = {
  argument: ArgumentEdge,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<ArgumentNodeType | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<ArgumentEdgeType | null>(null);

  useEffect(() => {
    const handleNodeUpdate = (event: CustomEvent<{ id: string; field: keyof ArgumentNodeType['data']; value: any }>) => {
      const { id, field, value } = event.detail;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
              ...node,
              data: {
                ...node.data,
                [field]: value,
              },
            }
            : node
        )
      );
    };

    const handleEdgeUpdate = (event: CustomEvent<{ id: string; field: keyof ArgumentEdgeType; value: any }>) => {
      const { id, field, value } = event.detail;
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === id
            ? {
              ...edge,
              [field]: value,
            }
            : edge
        )
      );
    };

    window.addEventListener('nodeUpdate', handleNodeUpdate as EventListener);
    window.addEventListener('edgeUpdate', handleEdgeUpdate as EventListener);
    return () => {
      window.removeEventListener('nodeUpdate', handleNodeUpdate as EventListener);
      window.removeEventListener('edgeUpdate', handleEdgeUpdate as EventListener);
    };
  }, [setNodes, setEdges]);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const newEdge: ArgumentEdgeType = {
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        weight: 0, // Default weight
      };
      setEdges((edges) => addEdge(newEdge, edges));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as ArgumentNodeType);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge as ArgumentEdgeType);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const addNewNode = useCallback((type: ClaimType) => {
    const newNode: ArgumentNodeType = {
      id: `${Date.now()}`,
      type: 'argument',
      position: { x: 100, y: 100 },
      data: {
        text: type === 'value' ? 'New Value' : type === 'policy' ? 'New Policy' : 'New Factual',
        type,
        belief: 0.5,
        author: 'User',
        createdAt: new Date().toISOString(),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) =>
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const deleteSelectedEdge = useCallback(() => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  }, [selectedEdge, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Sidebar: always present, styled dark, with controls at top */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 360,
          background: '#23213a',
          color: '#fff',
          boxShadow: '-2px 0 16px rgba(0,0,0,0.18)',
          zIndex: 20,
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: 0.5, marginBottom: 18 }}>Controls</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              onClick={() => addNewNode('factual')}
              style={{ background: '#15803d', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 0', fontWeight: 600, fontSize: '1rem', marginBottom: 4, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#166534')}
              onMouseOut={e => (e.currentTarget.style.background = '#15803d')}
            >
              Add Factual Node
            </button>
            <button
              onClick={() => addNewNode('policy')}
              style={{ background: '#6d28d9', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 0', fontWeight: 600, fontSize: '1rem', marginBottom: 4, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#5b21b6')}
              onMouseOut={e => (e.currentTarget.style.background = '#6d28d9')}
            >
              Add Policy Node
            </button>
            <button
              onClick={() => addNewNode('value')}
              style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 0', fontWeight: 600, fontSize: '1rem', marginBottom: 4, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#1e40af')}
              onMouseOut={e => (e.currentTarget.style.background = '#1d4ed8')}
            >
              Add Value Node
            </button>
            {selectedNode && (
              <button
                onClick={deleteSelectedNode}
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 0', fontWeight: 600, fontSize: '1rem', marginBottom: 4, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = '#b91c1c')}
                onMouseOut={e => (e.currentTarget.style.background = '#ef4444')}
              >
                Delete Selected Node
              </button>
            )}
            {selectedEdge && (
              <button
                onClick={deleteSelectedEdge}
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 0', fontWeight: 600, fontSize: '1rem', marginBottom: 4, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = '#b91c1c')}
                onMouseOut={e => (e.currentTarget.style.background = '#ef4444')}
              >
                Delete Selected Edge
              </button>
            )}
          </div>
        </div>
        {/* Node Details section, only if a node is selected */}
        {selectedNode && (
          <div style={{ marginTop: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 16, color: '#c7d2fe' }}>Node Details</h2>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>ID
              <div style={{
                background: '#181829',
                padding: '8px 12px',
                borderRadius: 6,
                marginTop: 4,
                marginBottom: 16,
                border: '1px solid #475569',
                fontSize: '0.9em',
                color: '#a5b4fc'
              }}>
                {selectedNode.id}
              </div>
            </label>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Text
              <div style={{
                background: '#181829',
                padding: '8px 12px',
                borderRadius: 6,
                marginTop: 4,
                marginBottom: 16,
                border: '1px solid #475569',
                fontSize: '0.9em',
                color: '#a5b4fc'
              }}>
                <input
                  type="text"
                  value={selectedNode.data.text}
                  onChange={e => {
                    const newText = e.target.value;
                    setNodes((nds) =>
                      nds.map((node) =>
                        node.id === selectedNode.id
                          ? {
                            ...node,
                            data: {
                              ...node.data,
                              text: newText,
                            },
                          }
                          : node
                      )
                    );
                    setSelectedNode(prev => prev ? {
                      ...prev,
                      data: {
                        ...prev.data,
                        text: newText,
                      },
                    } : null);
                  }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    fontSize: 'inherit',
                    outline: 'none',
                    padding: 0,
                  }}
                />
              </div>
            </label>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Type
              <select
                value={selectedNode.data.type}
                onChange={e => {
                  const newType = e.target.value as ClaimType;
                  setNodes((nds) =>
                    nds.map((node) =>
                      node.id === selectedNode.id
                        ? {
                          ...node,
                          data: {
                            ...node.data,
                            type: newType,
                          },
                        }
                        : node
                    )
                  );
                  setSelectedNode(prev => prev ? {
                    ...prev,
                    data: {
                      ...prev.data,
                      type: newType,
                    },
                  } : null);
                }}
                style={{ width: '100%', marginTop: 4, marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #475569', background: '#181829', color: '#fff', fontSize: '1rem' }}
              >
                <option value="factual">Factual</option>
                <option value="policy">Policy</option>
                <option value="value">Value</option>
              </select>
            </label>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Belief
              <input
                type="range"
                min="0"
                max="100"
                value={selectedNode.data.belief !== null ? selectedNode.data.belief * 100 : 50}
                onChange={e => {
                  const newBelief = parseInt(e.target.value) / 100;
                  setNodes((nds) =>
                    nds.map((node) =>
                      node.id === selectedNode.id
                        ? {
                          ...node,
                          data: {
                            ...node.data,
                            belief: newBelief,
                          },
                        }
                        : node
                    )
                  );
                  setSelectedNode(prev => prev ? {
                    ...prev,
                    data: {
                      ...prev.data,
                      belief: newBelief,
                    },
                  } : null);
                }}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '0.95em', textAlign: 'right', color: '#c7d2fe' }}>
                {selectedNode.data.belief !== null ? Math.round(selectedNode.data.belief * 100) : 50}%
              </div>
            </label>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Author
              <div style={{
                background: '#181829',
                padding: '8px 12px',
                borderRadius: 6,
                marginTop: 4,
                marginBottom: 16,
                border: '1px solid #475569',
                fontSize: '0.9em',
                color: '#a5b4fc'
              }}>
                <input
                  type="text"
                  value={selectedNode.data.author}
                  onChange={e => {
                    const newAuthor = e.target.value;
                    setNodes((nds) =>
                      nds.map((node) =>
                        node.id === selectedNode.id
                          ? {
                            ...node,
                            data: {
                              ...node.data,
                              author: newAuthor,
                            },
                          }
                          : node
                      )
                    );
                    setSelectedNode(prev => prev ? {
                      ...prev,
                      data: {
                        ...prev.data,
                        author: newAuthor,
                      },
                    } : null);
                  }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    fontSize: 'inherit',
                    outline: 'none',
                    padding: 0,
                  }}
                />
              </div>
            </label>
            <div style={{ fontSize: '0.95em', color: '#a5b4fc', marginTop: 8 }}>
              Created: {new Date(selectedNode.data.createdAt).toLocaleString()}
            </div>
          </div>
        )}
        {/* Edge Details section, only if an edge is selected */}
        {selectedEdge && (
          <div style={{ marginTop: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 16, color: '#c7d2fe' }}>Edge Details</h2>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>ID
              <div style={{
                background: '#181829',
                padding: '8px 12px',
                borderRadius: 6,
                marginTop: 4,
                marginBottom: 16,
                border: '1px solid #475569',
                fontSize: '0.9em',
                color: '#a5b4fc'
              }}>
                {selectedEdge.id}
              </div>
            </label>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Weight
              <input
                type="range"
                min="-100"
                max="100"
                value={selectedEdge.weight * 100}
                onChange={e => {
                  const newWeight = parseInt(e.target.value) / 100;
                  setEdges((eds) =>
                    eds.map((edge) =>
                      edge.id === selectedEdge.id
                        ? {
                          ...edge,
                          weight: newWeight,
                        }
                        : edge
                    )
                  );
                  setSelectedEdge(prev => prev ? { ...prev, weight: newWeight } : null);
                }}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '0.95em', textAlign: 'right', color: '#c7d2fe' }}>
                {selectedEdge.weight > 0 ? '+' : ''}{Math.round(selectedEdge.weight * 100)}%
              </div>
            </label>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Source Node
              <div style={{
                background: '#181829',
                padding: '8px 12px',
                borderRadius: 6,
                marginTop: 4,
                marginBottom: 16,
                border: '1px solid #475569',
                fontSize: '0.9em',
                color: '#a5b4fc'
              }}>
                {selectedEdge.source}
              </div>
            </label>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Target Node
              <div style={{
                background: '#181829',
                padding: '8px 12px',
                borderRadius: 6,
                marginTop: 4,
                marginBottom: 16,
                border: '1px solid #475569',
                fontSize: '0.9em',
                color: '#a5b4fc'
              }}>
                {selectedEdge.target}
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Remove floating button bar from canvas */}

      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
