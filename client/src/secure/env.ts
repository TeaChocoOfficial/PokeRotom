// -Path: "PokeRotom/client/src/secure/env.ts"

const MODE = String(import.meta.env.VITE_MODE) || 'development';
const HOST = String(import.meta.env.VITE_CLIENT_HOST) || '0.0.0.0';

const env = {
    MODE,
    HOST,
    PORT: Number(import.meta.env.VITE_CLIENT_PORT) || 8000,
    API_URL:
        HOST === '0.0.0.0' && MODE === 'development'
            ? 'http://192.168.1.123:3000'
            : String(import.meta.env.VITE_API_URL) || 'http://127.0.0.1:3000',
    API_TOKEN_KEY: String(import.meta.env.VITE_API_TOKEN_KEY) || '',
} as const;

export default env;
