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

    window.addEventListener('nodeUpdate', handleNodeUpdate as EventListener);
    return () => {
      window.removeEventListener('nodeUpdate', handleNodeUpdate as EventListener);
    };
  }, [setNodes]);

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
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNewNode = useCallback((type: ClaimType) => {
    const newNode: ArgumentNodeType = {
      id: `${Date.now()}`,
      type: 'argument',
      position: { x: 100, y: 100 },
      data: {
        text: 'New Claim',
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
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: 0.5, marginBottom: 18 }}>Controls</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => addNewNode('factual')}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: '1rem', marginBottom: 4, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
            >
              Add Factual Claim
            </button>
            <button
              onClick={() => addNewNode('policy')}
              style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: '1rem', marginBottom: 4, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#16a34a')}
              onMouseOut={e => (e.currentTarget.style.background = '#22c55e')}
            >
              Add Policy Claim
            </button>
            <button
              onClick={() => addNewNode('value')}
              style={{ background: '#a21caf', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: '1rem', marginBottom: 4, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#701a75')}
              onMouseOut={e => (e.currentTarget.style.background = '#a21caf')}
            >
              Add Value Claim
            </button>
            {selectedNode && (
              <button
                onClick={deleteSelectedNode}
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: '1rem', marginBottom: 4, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = '#b91c1c')}
                onMouseOut={e => (e.currentTarget.style.background = '#ef4444')}
              >
                Delete Selected Node
              </button>
            )}
          </div>
        </div>
        {/* Node Details section, only if a node is selected */}
        {selectedNode && (
          <div style={{ marginTop: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 16, color: '#c7d2fe' }}>Node Details</h2>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Text
              <input
                type="text"
                value={selectedNode.data.text}
                onChange={e => {
                  const event = new CustomEvent('nodeUpdate', {
                    detail: { id: selectedNode.id, field: 'text', value: e.target.value }
                  });
                  window.dispatchEvent(event);
                }}
                style={{ width: '100%', marginTop: 4, marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #475569', background: '#181829', color: '#fff', fontSize: '1rem' }}
              />
            </label>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Type
              <select
                value={selectedNode.data.type}
                onChange={e => {
                  const event = new CustomEvent('nodeUpdate', {
                    detail: { id: selectedNode.id, field: 'type', value: e.target.value }
                  });
                  window.dispatchEvent(event);
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
                  const event = new CustomEvent('nodeUpdate', {
                    detail: { id: selectedNode.id, field: 'belief', value: parseInt(e.target.value) / 100 }
                  });
                  window.dispatchEvent(event);
                }}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '0.95em', textAlign: 'right', color: '#c7d2fe' }}>{selectedNode.data.belief !== null ? Math.round(selectedNode.data.belief * 100) : 50}%</div>
            </label>
            <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: 10 }}>Author
              <input
                type="text"
                value={selectedNode.data.author}
                onChange={e => {
                  const event = new CustomEvent('nodeUpdate', {
                    detail: { id: selectedNode.id, field: 'author', value: e.target.value }
                  });
                  window.dispatchEvent(event);
                }}
                style={{ width: '100%', marginTop: 4, marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #475569', background: '#181829', color: '#fff', fontSize: '1rem' }}
              />
            </label>
            <div style={{ fontSize: '0.95em', color: '#a5b4fc', marginTop: 8 }}>
              Created: {new Date(selectedNode.data.createdAt).toLocaleString()}
            </div>
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
