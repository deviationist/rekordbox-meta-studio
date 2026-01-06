import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            '@/routes': path.resolve(__dirname, './resources/js/routes.ts'), // Point to your wrapper
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'rb.ichiva.no',
            protocol: 'wss',
            clientPort: 443,
            path: '/__vite_hmr',  // <-- Add explicit path
        },
        origin: 'https://rb.ichiva.no',
    },
    esbuild: {
        jsx: 'automatic',
    },
});
