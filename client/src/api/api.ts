//-Path: "motiva/client/src/services/axios.ts"
import axios from 'axios';
import Env from '../secure/env';
import type { QueryOptions } from '../types/types';

const serverRest = axios.create({
    baseURL: Env.API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

serverRest.interceptors.request.use(
    (config) => {
        const token = Env.API_TOKEN_KEY;
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error),
);

export const queryToString = <Query extends QueryOptions>(
    query?: Query,
): string => {
    if (!query) return '';

    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (typeof value === 'boolean') {
            if (value) params.append(key, '');
        } else if (typeof value === 'number')
            params.append(key, value.toString());
        else if (value !== '') params.append(key, value as string);
    });

    const result = params.toString();
    return result ? `?${result}` : '';
};

export default serverRest;
