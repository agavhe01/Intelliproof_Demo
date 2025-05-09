import type { Node, Edge } from '@xyflow/react';

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type AppNode = PositionLoggerNode;

export type ClaimType = 'factual' | 'policy' | 'value';

export interface ArgumentNode extends Node {
    data: {
        text: string;
        type: ClaimType;
        belief: number | null;
        author: string;
        createdAt: string;
    };
}

export interface ArgumentEdge extends Edge {
    weight: number; // -1 to +1 (attack to support)
}

export interface ArgumentGraph {
    nodes: ArgumentNode[];
    edges: ArgumentEdge[];
}
