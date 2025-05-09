import React from 'react';

interface SidebarLabelProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export function SidebarLabel({ children, style }: SidebarLabelProps) {
    return (
        <label
            style={{
                fontWeight: 600,
                color: '#fff',
                display: 'block',
                marginBottom: 10,
                ...style,
            }}
        >
            {children}
        </label>
    );
} 