import { useState, PropsWithChildren, ReactNode, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props as any;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [toastMessage, setToastMessage] = useState<{ type: string, text: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            setToastMessage({ type: 'error', text: flash.error });
        }
        
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {toastMessage && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
                    <div className={`rounded-md px-4 py-3 shadow-lg flex items-center gap-3 ${toastMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {toastMessage.type === 'success' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                        <span className="font-medium text-sm">{toastMessage.text}</span>
                    </div>
                </div>
            )}
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center relative">
                        <div className="flex items-center h-full">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-10 w-auto" />
                                </Link>
                            </div>
                        </div>

                        <div className="hidden space-x-2 sm:flex h-full items-center absolute left-1/2 transform -translate-x-1/2">
                            <NavLink
                                href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('bon-livraisons.index')}
                                    active={route().current('bon-livraisons.*')}
                                >
                                    Ventes
                                </NavLink>
                                <NavLink
                                    href={route('encaissements.index')}
                                    active={route().current('encaissements.*')}
                                >
                                    Encaissements
                                </NavLink>
                                <NavLink
                                    href={route('clients.index')}
                                    active={route().current('clients.*')}
                                >
                                    Clients
                                </NavLink>
                                <NavLink
                                    href={route('rapports.index')}
                                    active={route().current('rapports.*')}
                                >
                                    Rapports
                                </NavLink>

                                {/* Dropdown Configuration */}
                                <div className="relative inline-flex items-center h-full">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className={`inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150 focus:outline-none ${
                                                    route().current('produits.*') || route().current('prix-clients.*')
                                                        ? 'bg-primary-100/50 text-primary-600 font-semibold'
                                                        : 'text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                            >
                                                Configuration
                                                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('produits.index')}>Produits</Dropdown.Link>
                                            <Dropdown.Link href={route('prix-clients.index')}>Prix par Client</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>

                                {/* Dropdown Remises */}
                                <div className="relative inline-flex items-center h-full">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className={`inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150 focus:outline-none ${
                                                    route().current('remises.*')
                                                        ? 'bg-primary-100/50 text-primary-600 font-semibold'
                                                        : 'text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                            >
                                                Remises
                                                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('remises.baremes')}>Barèmes Remises</Dropdown.Link>
                                            <Dropdown.Link href={route('remises.calculs')}>Calculer Remises</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                        <div className="hidden sm:flex sm:items-center">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-semibold tracking-wide text-gray-600 transition duration-150 ease-in-out hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('bon-livraisons.index')}
                            active={route().current('bon-livraisons.*')}
                        >
                            Ventes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('encaissements.index')}
                            active={route().current('encaissements.*')}
                        >
                            Encaissements
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('clients.index')}
                            active={route().current('clients.*')}
                        >
                            Clients
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('produits.index')}
                            active={route().current('produits.*')}
                        >
                            Produits
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('prix-clients.index')}
                            active={route().current('prix-clients.*')}
                        >
                            Prix par Client
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
