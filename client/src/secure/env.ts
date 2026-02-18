// -Path: "PokeRotom/client/src/secure/env.ts"

const Env = {
    API_URL: (import.meta.env.VITE_API_URL ||
        'http://127.0.0.1:3000') as string,
    API_TOKEN_KEY: import.meta.env.VITE_API_TOKEN_KEY as string,
} as const;

export default Env;
