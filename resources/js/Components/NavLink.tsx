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
                'inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150 focus:outline-none ' +
                (active
                    ? 'bg-primary-100/50 text-primary-600 font-semibold'
                    : 'text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
