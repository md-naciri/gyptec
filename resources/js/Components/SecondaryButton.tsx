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
                `inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-xl shadow-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181c25] text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:ring-offset-1 dark:focus:ring-offset-[#0f121a] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
