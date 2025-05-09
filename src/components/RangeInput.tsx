import React from 'react';

interface RangeInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    showPercentage?: boolean;
}

export function RangeInput({ value, onChange, min = 0, max = 100, showPercentage = true }: RangeInputProps) {
    return (
        <>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={e => onChange(parseInt(e.target.value))}
                style={{ width: '100%' }}
            />
            {showPercentage && (
                <div style={{ fontSize: '0.95em', textAlign: 'right', color: '#c7d2fe' }}>
                    {value > 0 ? '+' : ''}{Math.round(value)}%
                </div>
            )}
        </>
    );
} 