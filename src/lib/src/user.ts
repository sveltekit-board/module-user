import { runQuery } from "@sveltekit-board/db";

export default class User {
    // @ts-expect-error
    provider: string; providerId: string;

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
     * User 인스턴스를 생성하려면 `new User()` 대신 `User.getUser()`를 사용해야 합니다.
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

        const user = new User();
        user.provider = provider;
        user.providerId = providerId;

        return user;
    }
    static async createNewUser(provider: string, providerId: string): Promise<User | null> {
        const userExists = await runQuery(async (run) => {
            let result = await run("SELECT EXISTS(SELECT * FROM `user` WHERE `provider` = ? AND`providerId` = ?);", [provider, providerId]);
            return Boolean(Object.values(result[0])[0]);
        })

        if (userExists) return null;

        await runQuery(async(run) => {
            await run("INSERT INTO `user` (`provider`, `providerId`, `registerTime`, `grade`) VALUES (?, ?, ?, ?)", [provider, providerId, Date.now(), 0])
        })

        const user = new User();
        user.provider = provider;
        user.providerId = providerId;

        return user;
    }
}

const userSchema = {
    'order': 'int(11)',
    'provider': 'tinytext',
    'providerId': 'text',
    'registerTIme': 'bigint(20) unsigned',
    'grade': 'tinyint(3) unsigned',
    'profileImage': 'mediumtext'
}