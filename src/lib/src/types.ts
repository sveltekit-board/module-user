export interface User{
    order:number;

    provider: string;
    providerId: string;

    registerTime: number;//unix time

    grade: number;

    profileImage: string;
}