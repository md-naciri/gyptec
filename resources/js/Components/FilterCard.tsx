import React, { ReactNode } from 'react';

interface FilterCardProps {
    children: ReactNode;
    className?: string;
}

export default function FilterCard({ children, className = '' }: FilterCardProps) {
    return (
        <div className={`p-4 rounded-xl shadow-sm border border-gray-200 bg-white mb-6 ${className}`}>
            {children}
        </div>
    );
}
