import { Handle, Position, type NodeProps } from '@xyflow/react';
import { type ArgumentNode } from './types';

export function ArgumentNode({ data, id }: NodeProps<ArgumentNode>) {
    return (
        <div className={`argument-node ${data.type}`}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                <input
                    type="text"
                    value={data.text}
                    onChange={(e) => {
                        const event = new CustomEvent('nodeUpdate', {
                            detail: { id, field: 'text', value: e.target.value }
                        });
                        window.dispatchEvent(event);
                    }}
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        outline: 'none',
                        padding: 0,
                    }}
                />
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
                <select
                    value={data.type}
                    onChange={(e) => {
                        const event = new CustomEvent('nodeUpdate', {
                            detail: { id, field: 'type', value: e.target.value }
                        });
                        window.dispatchEvent(event);
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        outline: 'none',
                        padding: 0,
                    }}
                >
                    <option value="factual">Factual</option>
                    <option value="policy">Policy</option>
                    <option value="value">Claim</option>
                </select>
            </div>

            {data.belief !== null && (
                <div style={{ marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.85em' }}>Belief:</label>
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
                        style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '0.85em', textAlign: 'right' }}>
                        {Math.round(data.belief * 100)}%
                    </div>
                </div>
            )}

            <div style={{ fontSize: '0.85em', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <input
                    type="text"
                    value={data.author}
                    onChange={(e) => {
                        const event = new CustomEvent('nodeUpdate', {
                            detail: { id, field: 'author', value: e.target.value }
                        });
                        window.dispatchEvent(event);
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        fontSize: '0.85em',
                        outline: 'none',
                        padding: 0,
                        width: 'auto',
                    }}
                    placeholder="Author"
                />
                • {new Date(data.createdAt).toLocaleDateString()}
            </div>

            <Handle type="source" position={Position.Bottom} style={{ width: 12, height: 12, background: '#e5e7eb' }} />
            <Handle type="target" position={Position.Top} style={{ width: 12, height: 12, background: '#e5e7eb' }} />
        </div>
    );
} 