import { runQuery } from "@sveltekit-board/db";
import { type UserData, type UserMethodResult } from './types.js'

export default class User {
    provider: string;
    providerId: string;

    /**
     * user 테이블이 있는지, 테이블의 컬럼의 타입은 맞는지 체크합니다. 단, AUTO_INCREMENT 등의 **추가적인** 내용은 체크하지 않습니다.
     * 만약 형식이 올바르지 않다면 해당 테이블을 DROP 합니다.
     * @returns 
     */
    static async checkTable() {
        return await runQuery(async (run) => {
            const result = await run("SHOW TABLES");
            if(result.length === 0){
                return false;
            }
            
            const tables = Object.values((result)[0]);
            if (!tables.includes('user')) return false;
            
            const columns: any[] = await run("SHOW COLUMNS from `user`");
            if (Object.values(userSchema).length !== Object.values(columns).length) return false;
            
            const isCorrect =  Object.keys(userSchema).every((key) => {
                const b =  columns.find(r => r.Field === key)?.Type === userSchema[key as keyof typeof userSchema];
                return b;
            })

            if(!isCorrect){
                await run("DROP TABLE `user`")
            }

            return isCorrect;
        })
    }
    /**
     * user 테이블을 생성합니다. `checkDB` 메소드로 테이블이 있는지 확인한 후 사용하세요.
     * @returns 
     */
    static async createTable() {
        return await runQuery(async (run) => {
            await run(/*sql*/`\
            CREATE TABLE \`user\` (
                \`order\` int(11) NOT NULL,
                \`provider\` tinytext NOT NULL,
                \`providerId\` text NOT NULL,
                \`name\` tinytext DEFAULT NULL,
                \`nickname\` tinytext NOT NULL,
                \`nicknameChangedTime\` bigint(20) UNSIGNED DEFAULT NULL,
                \`registerTime\` bigint(20) UNSIGNED NOT NULL,
                \`grade\` tinyint(3) UNSIGNED NOT NULL,
                \`profileImage\` mediumtext DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
            `)
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
        return await runQuery(async (run): Promise<UserMethodResult> => {
            if (cooldown) {
                const result: { nicknameChangedTime: number, nickname: string }[] = await run("SELECT `nicknameChangedTime`, `nickname` FROM `user` WHERE `provider` = ? AND `providerId` = ?", [this.provider, this.providerId]);
                if (result.length === 0) {
                    return {
                        success: false,
                        error: 'USER_DOES_NOT_EXISTS'
                    }
                }
                if (result[0].nicknameChangedTime !== null && result[0].nicknameChangedTime + cooldown * 1000 > Date.now()) {
                    return {
                        success: false,
                        error: 'CHECK_NICKNAMECHANGE_COOLDOWN'
                    };
                }
                if (result[0].nickname === nickname) {
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
        return await runQuery(async (run): Promise<UserMethodResult> => {
            const result = await run("UPDATE `user` SET `name` = ? WHERE `provider` = ? AND `providerId` = ?", [nickname, this.provider, this.providerId]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    error: 'USER_DOES_NOT_EXISTS'
                }
            }
            else if (result.changedRows === 0) {
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

    /**
     * 사용자의 등급을 설정합니다.
     * @param grade 0~255의 정수여야합니다.
     */
    async setGrade(grade: number): Promise<UserMethodResult> {
        if (!Number.isInteger(grade)) {
            return {
                success: false,
                error: "GRADE_MUST_BE_INTEGER"
            }
        }
        if (grade < 0 || grade > 255) {
            return {
                success: false,
                error: "CHECK_GRADE_RANGE"
            }
        }
        return await runQuery(async (run): Promise<UserMethodResult> => {
            const result = await run("UPDATE `user` SET `grade` = ? WHERE `provider` = ? AND `providerId` = ?", [grade, this.provider, this.providerId]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    error: 'USER_DOES_NOT_EXISTS'
                }
            }
            else if (result.changedRows === 0) {
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

    /**
     * 사용자의 프로필 이미지를 설정합니다.
     * @param image base64로 인코딩된 이미지 또는 url 등
     * @returns 
     */
    async setProfileImage(image: string): Promise<UserMethodResult> {
        return await runQuery(async (run): Promise<UserMethodResult> => {
            const result = await run("UPDATE `user` SET `profileImage` = ? WHERE `provider` = ? AND `providerId` = ?", [image, this.provider, this.providerId]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    error: 'USER_DOES_NOT_EXISTS'
                }
            }
            else if (result.changedRows === 0) {
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