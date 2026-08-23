import { useState, PropsWithChildren, ReactNode, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';

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
        <div className="flex flex-col min-h-screen bg-[#f3f4f6] dark:bg-[#0f121a] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            {toastMessage && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
                    <div className={`rounded-xl px-4 py-3 shadow-xl border flex items-center gap-3 ${toastMessage.type === 'success' ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
                        {toastMessage.type === 'success' ? (
                            <div className="bg-green-50 text-green-600 p-1.5 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            </div>
                        ) : (
                            <div className="bg-red-50 text-red-600 p-1.5 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                        )}
                        <span className="font-bold text-[15px] text-[#29303d]">{toastMessage.text}</span>
                    </div>
                </div>
            )}
            {/* Mobile Warning Banner */}
            <div className="block md:hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-100 dark:border-blue-800/30">
                <div className="px-4 py-3 flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                        <div className="bg-blue-100 dark:bg-blue-500/20 p-1.5 rounded-full shadow-sm">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="14" x="2" y="3" rx="2" />
                                <line x1="8" x2="16" y1="21" y2="21" />
                                <line x1="12" x2="12" y1="17" y2="21" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-[13px] font-medium text-blue-800 dark:text-blue-300 leading-snug">
                        Pour une expérience optimale et plus de confort, nous vous recommandons d'utiliser l'application sur un <span className="font-bold">ordinateur</span> ou une <span className="font-bold">tablette</span>.
                    </p>
                </div>
            </div>
            
            {/* Navbar Premium */}
            <nav className="bg-[#ecebe8]/50 dark:bg-[#181c25]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 sticky top-0 z-40 transition-all duration-300 print:hidden">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 justify-between items-center gap-8">
                        {/* Logo Area */}
                        <div className="flex shrink-0 items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto" />
                            </Link>
                        </div>

                        {/* Center Navigation */}
                        <div className="hidden lg:flex flex-1 justify-center items-center gap-1.5">
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
                            {user.roles?.includes('superadmin') && (
                                <NavLink
                                    href={route('users.index')}
                                    active={route().current('users.*')}
                                >
                                    Utilisateurs
                                </NavLink>
                            )}

                            {/* Dropdown Configuration */}
                            <div className="relative inline-flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className={`inline-flex items-center px-4 py-2 text-[14px] font-medium rounded-lg transition-all duration-200 focus:outline-none border ${
                                                route().current('produits.*') || route().current('prix-clients.*')
                                                ? 'bg-white/60 dark:bg-white/10 text-[#29303d] dark:text-white shadow-sm border-gray-200 dark:border-white/10 font-bold'
                                                : 'text-gray-500 dark:text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 hover:text-[#29303d] dark:hover:text-white'
                                            }`}
                                        >
                                            Tarification
                                            <svg className={`ml-1.5 h-4 w-4 transition-transform ${route().current('produits.*') || route().current('prix-clients.*') ? 'text-[#29303d] dark:text-white' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content width="48" contentClasses="bg-white dark:bg-[#181c25]">
                                        <Dropdown.Link href={route('produits.index')}>Produits</Dropdown.Link>
                                        <Dropdown.Link href={route('prix-clients.index')}>Prix par Client</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            {/* Dropdown Remises */}
                            <div className="relative inline-flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className={`inline-flex items-center px-4 py-2 text-[14px] font-medium rounded-lg transition-all duration-200 focus:outline-none border ${
                                                route().current('remises.*')
                                                ? 'bg-white/60 dark:bg-white/10 text-[#29303d] dark:text-white shadow-sm border-gray-200 dark:border-white/10 font-bold'
                                                : 'text-gray-500 dark:text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 hover:text-[#29303d] dark:hover:text-white'
                                            }`}
                                        >
                                            Remises
                                            <svg className={`ml-1.5 h-4 w-4 transition-transform ${route().current('remises.*') ? 'text-[#29303d] dark:text-white' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content width="48" contentClasses="bg-white dark:bg-[#181c25]">
                                        <Dropdown.Link href={route('remises.baremes')}>Barèmes Remises</Dropdown.Link>
                                        <Dropdown.Link href={route('remises.calculs')}>Calculer Remises</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Right Area (Admin/Profile) */}
                        <div className="hidden lg:flex lg:items-center shrink-0">
                            <ThemeToggle />
                            
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-1.5 text-[14px] font-bold text-[#29303d] dark:text-white transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-50/80 dark:hover:bg-white/5 rounded-lg focus:outline-none"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-[#ecebe8] dark:bg-[#2a303c] border border-gray-200 dark:border-white/10 flex items-center justify-center mr-3 text-xs font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">
                                                    {user.name.substring(0, 2)}
                                                </div>
                                                {user.name}
                                                <svg
                                                    className="ml-2 h-4 w-4 text-gray-400 dark:text-gray-500"
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

                                    <Dropdown.Content align="right" width="48" contentClasses="bg-white dark:bg-[#181c25]">
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Mon Profil
                                        </Dropdown.Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="!text-red-600 hover:!bg-red-50"
                                        >
                                            Déconnexion
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center lg:hidden">
                            <ThemeToggle />
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
                        ' lg:hidden'
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
                            href={route('rapports.index')}
                            active={route().current('rapports.*')}
                        >
                            Rapports
                        </ResponsiveNavLink>
                        {user.roles?.includes('superadmin') && (
                            <ResponsiveNavLink
                                href={route('users.index')}
                                active={route().current('users.*')}
                            >
                                Utilisateurs
                            </ResponsiveNavLink>
                        )}
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
                            Prix Spéciaux
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('remises.baremes')}
                            active={route().current('remises.baremes')}
                        >
                            Barèmes Remises
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('remises.calculs')}
                            active={route().current('remises.calculs')}
                        >
                            Calculer Remises
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
                                Profil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Déconnexion
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-[#1f2430] shadow-sm border-b border-gray-100 dark:border-white/5">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="mt-auto py-6 border-t border-gray-200 dark:border-white/5 bg-white/40 dark:bg-[#181c25]/30 print:hidden">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="h-6 w-auto grayscale opacity-60 dark:opacity-40" />
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Gyptec System</span>
                    </div>
                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
                        Designed & Developed by{' '}
                        <span className="text-[#29303d] dark:text-white">
                            MD-NACIRI
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
