// - Path: "PokeRotom/client/src/types/auth.ts"

export type UserLogin = {
    username: string;
    password: string;
};

export type UserRegister = {
    name: string;
    username: string;
    password: string;
    starterId: number;
};

export type ResponseUser = {
    id: string;
    uid?: number;
    name?: string;
    username?: string;
    online?: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export type User = {
    id: string;
    uid: number;
    name: string;
    username: string;
    online: number;
};
