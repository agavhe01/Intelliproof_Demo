import { Handle, Position, type NodeProps } from '@xyflow/react';
import { type ArgumentNode, type ClaimType } from './types';

export function ArgumentNode({ data, id }: NodeProps<ArgumentNode>) {
    const getTypeColor = (type: ClaimType) => {
        switch (type) {
            case 'factual':
                return 'bg-blue-100 border-blue-500';
            case 'policy':
                return 'bg-green-100 border-green-500';
            case 'value':
                return 'bg-purple-100 border-purple-500';
            default:
                return 'bg-gray-100 border-gray-500';
        }
    };

    return (
        <div className={`p-4 rounded-lg border-2 ${getTypeColor(data.type)} min-w-[200px]`}>
            <div className="font-medium mb-2">
                <input
                    type="text"
                    value={data.text}
                    onChange={(e) => {
                        const event = new CustomEvent('nodeUpdate', {
                            detail: { id, field: 'text', value: e.target.value }
                        });
                        window.dispatchEvent(event);
                    }}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                />
            </div>

            <div className="text-sm text-gray-600 mb-2">
                <select
                    value={data.type}
                    onChange={(e) => {
                        const event = new CustomEvent('nodeUpdate', {
                            detail: { id, field: 'type', value: e.target.value }
                        });
                        window.dispatchEvent(event);
                    }}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                >
                    <option value="factual">Factual</option>
                    <option value="policy">Policy</option>
                    <option value="value">Value</option>
                </select>
            </div>

            {data.belief !== null && (
                <div className="mb-2">
                    <label className="text-sm text-gray-600">Belief:</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={data.belief * 100}
                        onChange={(e) => {
                            const event = new CustomEvent('nodeUpdate', {
                                detail: { id, field: 'belief', value: parseInt(e.target.value) / 100 }
                            });
                            window.dispatchEvent(event);
                        }}
                        className="w-full"
                    />
                    <div className="text-sm text-gray-500 text-right">
                        {Math.round(data.belief * 100)}%
                    </div>
                </div>
            )}

            <div className="text-xs text-gray-500">
                <input
                    type="text"
                    value={data.author}
                    onChange={(e) => {
                        const event = new CustomEvent('nodeUpdate', {
                            detail: { id, field: 'author', value: e.target.value }
                        });
                        window.dispatchEvent(event);
                    }}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-xs"
                    placeholder="Author"
                />
                • {new Date(data.createdAt).toLocaleDateString()}
            </div>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
        </div>
    );
} 