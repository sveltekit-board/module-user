import { runQuery } from "@sveltekit-board/db"
import { UserError } from "./error"
import getUser from "./getUser"

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

    if(await getUser.byId(option.id)){
        throw new UserError("DUPLICATED_ID");
    }
    if(option.email){
        if(await getUser.byEmail(option.email)){
            throw new UserError("DUPLICATED_EMAIL");
        }
    }
    if(await getUser.byNickname(option.nickname)){
        throw new UserError("DUPLICATED_NICKNAME");
    }

    try{
        await runQuery(async(run) => {
            return await run("INSERT INTO `user` (`id`, `password`, `email`, `verified`, `nickname`,`grade`, `register_ip`, `nick_date`, `register_date`) VALUES (?, ?, ?,?, ?, ?, ?, NOW(), NOW())", [option.id, option.password, email, option.verified, option.nickname, option.grade, option.registerIp]);
        })
    }
    catch(err){
        throw new UserError("DATABASE_ERROR",'데이터베이스 오류',err)
    }

    return true;
}