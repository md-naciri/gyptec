import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-[#0f121a] pt-6 sm:justify-center sm:pt-0 transition-colors duration-300 relative">
            
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <ThemeToggle />
            </div>
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white dark:bg-[#181c25] px-6 py-4 shadow-md sm:max-w-md sm:rounded-2xl border border-transparent dark:border-white/5">
                {children}
            </div>
        </div>
    );
}
