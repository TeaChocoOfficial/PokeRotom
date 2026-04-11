// -Path: "PokeRotom/client/vite.config.ts"
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import tsconfig from './tsconfig.app.json';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type AliasOptions } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';

const alias: AliasOptions = {};
const paths = tsconfig.compilerOptions.paths;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyPaths = Object.keys(paths) as (keyof typeof paths)[];

keyPaths.forEach((keys) => {
    const list = paths[keys];
    let key = keys.replace(/(\/\*|\*\/)/g, '');
    if (key === '') key = '/';
    if (Array.isArray(list))
        alias[key] = path.resolve(
            __dirname,
            list[0].replace(/(\/\*|\*\/)/g, ''),
        );
    else if (typeof list === 'string')
        alias[key] = path.resolve(
            __dirname,
            (list as string).replace(/(\/\*|\*\/)/g, ''),
        );
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const host = env.VITE_CLIENT_HOST;
    const port = Number(env.VITE_CLIENT_PORT);

    return {
        resolve: { alias: alias },
        plugins: [
            react(),
            tailwindcss(),
            babel({ presets: [reactCompilerPreset()] }),
        ],
        server: {
            strictPort: true,
            port: port || 8000,
            host: host || '0.0.0.0',
            hmr:
                host && port
                    ? {
                          protocol: 'ws',
                          host: host === '0.0.0.0' ? 'localhost' : host,
                          port,
                      }
                    : undefined,
            watch: { ignored: ['**/src-tauri/**'] },
        },
    };
});
