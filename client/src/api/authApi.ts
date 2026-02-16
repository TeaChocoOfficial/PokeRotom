//-Path: "PokeRotom/client/src/api/authApi.ts"
import serverRest from './api';
import type { User, UserLogin, UserRegister } from '../types/auth';

export const authAPI = {
    login: (data: UserLogin) =>
        serverRest.post<{ message: string; user: User }>(
            '/user/auth/login',
            data,
        ),
    register: (data: UserRegister) =>
        serverRest.post<{ message: string; user: User }>(
            '/user/auth/register',
            data,
        ),
    logout: () => serverRest.post('/user/auth/logout'),
    getAuth: () => serverRest.get<User>('/user/auth'),
};
