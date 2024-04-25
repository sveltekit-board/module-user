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

export type UserMethodResult = { success: true, data?: any } | {success:false, error?: any}