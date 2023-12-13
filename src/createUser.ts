import { runQuery } from "@sveltekit-board/db"
import { UserError } from "./error"

interface userOption{
    id:string
    password:string
    email?:string
    verified:boolean
    nickname:string
    grade:number
    registerIp:string
}

export async function createUser(option:userOption){
    let email:string|null;
    if(option.email){
        email = option.email;
    }
    else{
        email = null;
    }

    try{
        await runQuery(async(run) => {
            return await run("INSERT INTO `user` (`id`, `password`, `email`, `verified`, `nickname`, `grade`, `registerIp`) VALUES (?, ?, ?,?, ?, ?, ?)", [option.id, option.password, email, option.verified, option.nickname, option.grade, option.registerIp]);
        })
    }
    catch(err){
        throw new UserError("DATABASE_ERROR",'데이터베이스 오류',err)
    }

    return true;
}