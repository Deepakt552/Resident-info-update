import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '192.168.43.116', // YOUR local IP
        port: 5173,
        strictPort: true,
        hmr: {
            host: '192.168.43.116', // must match
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});
