import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    base: '/',

    server: {
        port: 5173,
        proxy: {
            // Proxy API requests to the backend
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false
            },
            // Proxy socket.io
            '/socket.io': {
                target: 'http://localhost:3000',
                ws: true
            },
            // Proxy static files
            '/covers': {
                target: 'http://localhost:3000',
                changeOrigin: true
            },
            '/downloads': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },

    build: {
        outDir: '../src/public',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: './index.html',
                login: './login.html'
            }
        }
    },

    plugins: []
});
