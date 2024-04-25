export interface User {
    order: number;

    provider: string;
    providerId: string;

    name: string | null;
    nickname: string;

    registerTime: number;//unix time

    grade: number;

    profileImage: string;
}

export interface UserData {
    provider: string;
    providerId: string;
    name: string | null;
    nickname: string;
    profileImage: string;
}

export type UserMethodResult<T = any> = { success: true, data?: T } | {success:false, error?: string}