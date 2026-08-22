import React, { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="pt-6 pb-2">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-1 text-sm font-medium text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && (
                        <div className="flex shrink-0">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
