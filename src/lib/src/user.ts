import { runQuery } from "@sveltekit-board/db";
import { type UserData, type UserMethodResult } from './types.js'

export default class User {
    provider: string;
    providerId: string;

    /**
     * user 테이블이 있는지, 테이블의 컬럼의 타입은 맞는지 체크합니다. 단, AUTO_INCREMENT 등의 **추가적인** 내용은 체크하지 않습니다.
     * @returns 
     */
    static async checkDB() {
        return await runQuery(async (run) => {
            const tables = Object.values((await run("SHOW TABLES"))[0]);
            if (!tables.includes('user')) return false;

            const columns: any[] = await run("SHOW COLUMNS from `user`");
            if (Object.values(userSchema).length !== Object.values(columns).length) return false;

            return Object.keys(userSchema).every((key) => {
                return columns.find(r => r.Field === key)?.Type === userSchema[key as keyof typeof userSchema];
            })
        })
    }
    /**
     * getUser 메소드를 사용하면 해당 유저의 존재여부도 확인할 수 있습니다.
     * @param provider
     * @param providerId 
     * @returns
     */
    static async getUser(provider: string, providerId: string): Promise<User | null> {
        const userExists = await runQuery(async (run) => {
            let result = await run("SELECT EXISTS(SELECT * FROM `user` WHERE `provider` = ? AND`providerId` = ?);", [provider, providerId]);
            return Boolean(Object.values(result[0])[0]);
        })

        if (!userExists) {
            return null;
        }

        const user = new User(provider, providerId);

        return user;
    }
    /**
     * 새 사용자를 생성합니다.
     * @param data 
     * @returns 
     */
    static async createNewUser(data: UserData): Promise<User | null> {
        const userExists = await runQuery(async (run) => {
            let result = await run("SELECT EXISTS(SELECT * FROM `user` WHERE `provider` = ? AND`providerId` = ?);", [data.provider, data.providerId]);
            return Boolean(Object.values(result[0])[0]);
        })

        if (userExists) return null;

        await runQuery(async (run) => {
            await run("INSERT INTO `user` (`provider`, `providerId`, `name`, `nickname`, `registerTime`, `grade`, `profileImage`) VALUES (?, ?, ?, ?, ?, ?, ?)", [data.provider, data.providerId, data.name, data.nickname, Date.now(), 1, data.profileImage])
        })

        const user = new User(data.provider, data.providerId);

        return user;
    }

    constructor(provider: string, providerId: string) {
        this.provider = provider;
        this.providerId = providerId;
    }

    /**
     * 유저의 닉네임을 설정합니다.
     * @param nickname 설정할 닉네임입니다.
     * @param cooldown 닉네임 변경 쿨타임입니다. 초 단위입니다.
     * @returns 
     */
    async setNickname(nickname: string, cooldown?: number): Promise<UserMethodResult> {
        return await runQuery(async(run): Promise<UserMethodResult> => {
            if(cooldown){
                const result: {nicknameChangedTime:number, nickname: string}[] = await run("SELECT `nicknameChangedTime`, `nickname` FROM `user` WHERE `provider` = ? AND `providerId` = ?", [this.provider, this.providerId]);
                if(result.length === 0){
                    return {
                        success: false,
                        error: 'USER_DOES_NOT_EXISTS'
                    }
                }
                if(result[0].nicknameChangedTime !== null && result[0].nicknameChangedTime + cooldown * 1000 > Date.now()){
                    return {
                        success: false,
                        error: 'CHECK_NICKNAMECHANGE_COOLDOWN'
                    };
                }
                if(result[0].nickname === nickname){
                    return {
                        success: false,
                        error: 'NICKNAME_ALREADY_USING'
                    }
                }
            }

            return {
                success: true,
                data: await run("UPDATE `user` SET `nickname` = ?, `nicknameChangedTime` = ? WHERE `provider` = ? AND `providerId` = ?", [nickname, Date.now(), this.provider, this.providerId])
            }
        })
    }

    /**
     * 유저의 이름을 설정합니다.
     * @param nickname 설정할 이름입니다.
     * @param cooldown 이름 변경 쿨타임입니다. 초 단위입니다.
     * @returns 
     */
    async setName(nickname: string): Promise<UserMethodResult> {
        return await runQuery(async(run): Promise<UserMethodResult> => {
            const result = await run("UPDATE `user` SET `name` = ? WHERE `provider` = ? AND `providerId` = ?", [nickname, this.provider, this.providerId]);

            if(result.affectedRows === 0){
                return {
                    success: false,
                    error: 'USER_DOES_NOT_EXISTS'
                }
            }
            else if(result.changedRows === 0){
                return {
                    success: false,
                    error: 'NAME_ALREADY_USING'
                }
            }
            else {
                return {
                    success: true,
                    data: result
                }
            }
        })
    }
}

const userSchema = {
    'order': 'int(11)',
    'provider': 'tinytext',
    'providerId': 'text',
    'name': 'tinytext',
    'nickname': 'tinytext',
    'nicknameChangedTime': 'bigint(20) unsigned',
    'registerTime': 'bigint(20) unsigned',
    'grade': 'tinyint(3) unsigned',
    'profileImage': 'mediumtext'
}