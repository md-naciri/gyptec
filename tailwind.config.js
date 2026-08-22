import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#f0f5fa',
                    100: '#e1ebf4',
                    200: '#c3d8e9',
                    300: '#a5c4df',
                    400: '#699ecb',
                    500: '#3661A0', // Base Gyptec Blue
                    600: '#315790',
                    700: '#294978',
                    800: '#203a60',
                    900: '#1a304e',
                },
                secondary: {
                    50: '#fefcf4',
                    100: '#fcf8e9',
                    200: '#f8f0d3',
                    300: '#f5e7bc',
                    400: '#efd78e',
                    500: '#F5B027', // Base Gyptec Yellow
                    600: '#dd9e23',
                    700: '#b8841d',
                    800: '#936a17',
                    900: '#785613',
                },
            }
        },
    },

    plugins: [forms],
};
