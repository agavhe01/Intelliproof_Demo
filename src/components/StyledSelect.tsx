import React from 'react';

interface StyledSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

export function StyledSelect({ value, onChange, options }: StyledSelectProps) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
                width: '100%',
                marginTop: 4,
                marginBottom: 16,
                padding: 8,
                borderRadius: 6,
                border: '1px solid #475569',
                background: '#181829',
                color: '#fff',
                fontSize: '1rem'
            }}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
} 