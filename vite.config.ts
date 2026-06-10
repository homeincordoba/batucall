import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'serve-firebase-config',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/firebase-applet-config.json') {
              try {
                const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
                const config = fs.readFileSync(configPath, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(config);
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to read firebase config' }));
              }
            } else {
              next();
            }
          });
        },
        generateBundle() {
          try {
            const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
            const config = fs.readFileSync(configPath, 'utf-8');
            this.emitFile({
              type: 'asset',
              fileName: 'firebase-applet-config.json',
              source: config
            });
          } catch (e) {
            console.warn("Could not emit firebase-applet-config.json to bundle:", e);
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
