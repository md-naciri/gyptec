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
                'inline-flex items-center px-4 py-2 text-[14px] rounded-xl transition-all duration-200 focus:outline-none border ' +
                (active
                    ? 'bg-[#29303d] text-white font-bold shadow-md border-transparent'
                    : 'text-gray-500 font-medium border-transparent hover:border-gray-200 hover:bg-gray-50/80 hover:text-gray-900') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
