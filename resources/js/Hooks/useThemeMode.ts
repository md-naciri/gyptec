import { useState, useEffect } from 'react';

export function useThemeMode() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Initial check
        if (typeof document !== 'undefined') {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        setIsDarkMode(document.documentElement.classList.contains('dark'));
                    }
                });
            });

            observer.observe(document.documentElement, { attributes: true });

            return () => {
                observer.disconnect();
            };
        }
    }, []);

    return isDarkMode;
}
