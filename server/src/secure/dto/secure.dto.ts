//-Path: "PokeRotom/server/src/secure/dto/secure.dto.ts"

export const envConfigs = [
    'VITE_MODE',
    'VITE_API_TOKEN_KEY',
    'CLIENT_URL',
    'SERVER_HOST',
    'SERVER_PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRES_IN',
    'BCRYPT_ROUNDS',
    'PASSWORD_HASH_SALT',
] as const;

export type EnvConfig = {
    [key in (typeof envConfigs)[number]]?: string;
};
