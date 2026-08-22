import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-4 py-2 text-[14px] rounded-lg transition-all duration-200 focus:outline-none border ' +
                (active
                    ? 'bg-[#29303d] dark:bg-primary-600 text-white font-bold shadow-md border-transparent'
                    : 'text-gray-500 dark:text-gray-400 font-medium border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-50/80 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
