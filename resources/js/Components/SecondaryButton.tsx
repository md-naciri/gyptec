import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-xl shadow-sm border border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
