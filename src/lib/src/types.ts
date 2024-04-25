export interface UserData {
    order: number;

    provider: string;
    providerId: string;

    name: string | null;
    nickname: string;

    registerTime: number;//unix time

    grade: number;

    profileImage: string | null;
}

export interface UserCreatingData {
    provider: string;
    providerId: string;
    name: string | null;
    nickname: string;
    profileImage: string | null;
}

export type UserMethodResult<T = any> = { success: true, data?: T } | {success:false, error?: string}