import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Plugin to copy static files (sw.js, icons) to build output
function copyStaticFiles() {
    const filesToCopy = ['sw.js', 'icon-192.png', 'icon-512.png', 'manifest.json'];
    return {
        name: 'copy-static-files',
        writeBundle(options) {
            const outDir = options.dir || resolve(__dirname, '../src/public');
            for (const file of filesToCopy) {
                const src = resolve(__dirname, file);
                const dest = resolve(outDir, file);
                if (fs.existsSync(src)) {
                    fs.copyFileSync(src, dest);
                    console.log(`Copied ${file} to build output`);
                }
            }
        }
    };
}

export default defineConfig({
    root: '.',
    base: '/',
    appType: 'mpa',

    server: {
        port: 5173,
        host: true,
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

    plugins: [copyStaticFiles()]
});
