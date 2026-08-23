import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-[#0f121a] transition-colors duration-300 relative pb-20">
            
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
                <ThemeToggle />
            </div>

            <div className="flex flex-col items-center justify-center w-full px-4 sm:px-0">
                <div>
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-white dark:bg-[#181c25] px-6 py-4 shadow-md sm:max-w-md sm:rounded-2xl border border-transparent dark:border-white/5 relative z-10">
                    {children}
                </div>
            </div>

            {/* Footer */}
            <footer className="absolute bottom-0 py-6 w-full">
                <div className="mx-auto max-w-[1440px] px-4 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                        <ApplicationLogo className="h-4 w-auto grayscale opacity-50 dark:opacity-30" />
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500">Gyptec System</span>
                    </div>
                    <div className="text-xs font-bold text-gray-400 dark:text-gray-500">
                        Designed & Developed by{' '}
                        <span className="text-[#29303d] dark:text-gray-400">
                            MD-NACIRI
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
