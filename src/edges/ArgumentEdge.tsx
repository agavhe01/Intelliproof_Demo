import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';
import { type ArgumentEdge } from '../nodes/types';

export function ArgumentEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}: EdgeProps<ArgumentEdge>) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const getEdgeColor = (weight: number) => {
        if (weight > 0) {
            return '#22c55e'; // green for support
        } else if (weight < 0) {
            return '#ef4444'; // red for attack
        }
        return '#6b7280'; // gray for neutral
    };

    const getEdgeStyle = (weight: number) => {
        const color = getEdgeColor(weight);
        return {
            stroke: color,
            strokeWidth: 2,
            strokeDasharray: weight === 0 ? '5,5' : 'none',
        };
    };

    const weight = typeof data?.weight === 'number' ? data.weight : 0;

    return (
        <>
            <BaseEdge path={edgePath} style={getEdgeStyle(weight)} />
            <text
                x={(sourceX + targetX) / 2}
                y={(sourceY + targetY) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-current text-xs"
                style={{ fill: getEdgeColor(weight) }}
            >
                {weight > 0 ? '+' : ''}{weight}
            </text>
        </>
    );
} 