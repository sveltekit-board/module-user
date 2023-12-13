import { runQuery } from "@sveltekit-board/db";
import { UserError } from "./error";

let byId = async function (id: string) {
    try {
        let result = await runQuery(async (run) => {
            return await run("SELECT * FROM `user` WHERE `id` = ?", [id]);
        });
        return result['0']
    }
    catch (err) {
        throw new UserError('DATABASE_ERROR', undefined, err)
    }
}

let byNickname = async function (nickname: string) {
    try {
        let result = await runQuery(async (run) => {
            return await run("SELECT * FROM `user` WHERE `nickname` = ?", [nickname]);
        });
        return result['0']
    }
    catch (err) {
        throw new UserError('DATABASE_ERROR', undefined, err)
    }
}

let byEmail = async function (email: string) {
    try {
        let result = await runQuery(async (run) => {
            return await run("SELECT * FROM `user` WHERE `email` = ?", [email]);
        });
        return result['0']
    }
    catch (err) {
        throw new UserError('DATABASE_ERROR', undefined, err)
    }
}

let byIdPassword = async function (id:string, password:string){
    try {
        let result = await runQuery(async (run) => {
            return await run("SELECT * FROM `user` WHERE `id` = ? AND `password` = ?", [id, password]);
        });
        return result['0']
    }
    catch (err) {
        throw new UserError('DATABASE_ERROR', undefined, err)
    }
}

const getUser = {
    byId,
    byNickname,
    byEmail,
    byIdPassword
}

export default getUser;