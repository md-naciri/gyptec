import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center h-10 px-4 text-sm font-semibold rounded-lg bg-primary-600 text-white transition-colors duration-150 hover:bg-primary-600/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
