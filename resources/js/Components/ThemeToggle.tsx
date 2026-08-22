import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
            window.dispatchEvent(new Event('theme-change')); // Trigger custom event
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
            window.dispatchEvent(new Event('theme-change')); // Trigger custom event
        }
    };

    return (
        <button
            onClick={toggleTheme}
            type="button"
            className="p-2 mr-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors dark:text-gray-400 dark:hover:bg-white/10"
            aria-label="Toggle Dark Mode"
        >
            {isDark ? (
                <Sun size={20} className="text-amber-400" />
            ) : (
                <Moon size={20} className="text-indigo-600" />
            )}
        </button>
    );
}
