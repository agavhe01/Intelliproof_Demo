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
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => addNewNode('factual')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Factual Claim
        </button>
        <button
          onClick={() => addNewNode('policy')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Policy Claim
        </button>
        <button
          onClick={() => addNewNode('value')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Add Value Claim
        </button>
        {selectedNode && (
          <button
            onClick={deleteSelectedNode}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Selected Node
          </button>
        )}
      </div>

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
