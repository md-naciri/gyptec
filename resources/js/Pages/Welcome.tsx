import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Gyptec - Accueil" />
            
            <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f121a] flex flex-col font-sans transition-colors duration-300">
                {/* Navbar (Upper part) */}
                <header className="relative z-50 flex items-center justify-between px-6 py-6 lg:px-12 bg-white/50 dark:bg-[#181c25]/50 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-[#29303d] dark:text-white tracking-tight">MD-NACIRI</span>
                    </div>

                    <nav className="flex items-center gap-4">
                        <ThemeToggle />
                        
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2.5 rounded-full bg-[#29303d] dark:bg-white text-white dark:text-[#29303d] font-bold text-sm shadow-md hover:bg-black dark:hover:bg-gray-100 transition-all"
                            >
                                Accéder au Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-6 py-2.5 rounded-full bg-white dark:bg-[#1f2430] text-[#29303d] dark:text-white border border-gray-200 dark:border-white/10 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
                                >
                                    Se connecter
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Center Content */}
                <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4">
                    {/* Background decorations */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>

                    <div className="text-center max-w-3xl z-10 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm mb-8 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Système de gestion optimisé</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-[#29303d] dark:text-white tracking-tighter leading-tight mb-6">
                            Gérez votre entreprise <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
                                en toute simplicité
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Une solution premium conçue pour gérer vos clients, bons de livraison, encaissements et suivre vos performances en temps réel.
                        </p>

                        {!auth.user && (
                            <Link href={route('login')}>
                                <button className="h-14 px-10 bg-[#29303d] dark:bg-white text-white dark:text-[#29303d] font-black text-lg rounded-full shadow-xl hover:scale-105 transition-transform duration-300">
                                    Démarrer maintenant
                                </button>
                            </Link>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-8 relative z-10 border-t border-gray-200/50 dark:border-white/5 bg-white/50 dark:bg-[#181c25]/50 backdrop-blur-sm">
                    <div className="mx-auto max-w-[1440px] px-6 flex flex-col items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                            <ApplicationLogo className="h-5 w-auto grayscale opacity-50 dark:opacity-30" />
                            <span className="text-sm font-bold text-gray-400 dark:text-gray-500">Gyptec System</span>
                        </div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                            Designed & Developed by 
                            <span className="text-[#29303d] dark:text-white ml-1">
                                MD-NACIRI
                            </span>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
