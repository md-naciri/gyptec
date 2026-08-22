import React, { ReactNode } from 'react';

interface FilterCardProps {
    children: ReactNode;
    className?: string;
}

export default function FilterCard({ children, className = '' }: FilterCardProps) {
    return (
        <div className={`p-4 rounded-lg shadow-sm border border-gray-200 bg-white mb-4 ${className}`}>
            {children}
        </div>
    );
}
