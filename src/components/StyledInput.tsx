import React from 'react';

interface StyledInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function StyledInput({ value, onChange, placeholder }: StyledInputProps) {
    return (
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
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
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
    );
} 