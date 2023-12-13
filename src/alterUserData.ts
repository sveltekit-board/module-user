import { runQuery } from "@sveltekit-board/db";
import { UserError } from "./error";

let alterNickname = async function(id:string, nickname:string){
    try{
        return await runQuery(async(run) => {
            let same = false;
            try{
                let r = (await run("SELECT * FROM `user` WHERE `id` = ? AND `nickname` = ?", [id, nickname]))['0'];
                if(r){
                    same = true;
                }
            }
            catch(err){
                throw new UserError("DATABASE_ERROR", undefined, err);
            }

            if(same){
                throw new UserError("SAME_NICKNAME");
            }

            try{
                await run("UPDATE `user` SET `nickname` = ? WHERE `id` = ?", [nickname, id]);
            }
            catch(err){
                throw new UserError("DATABASE_ERROR", undefined, err);
            }

            return true;
        })
    }
    catch(err){
        throw err;
    }
}

let alterPassword = async function(id:string, password:string){
    try{
        return await runQuery(async(run) => {
            let same = false;
            try{
                let r = (await run("SELECT * FROM `user` WHERE `id` = ? AND `password` = ?", [id, password]))['0'];
                if(r){
                    same = true;
                }
            }
            catch(err){
                throw new UserError("DATABASE_ERROR", undefined, err);
            }

            if(same){
                throw new UserError("SAME_PASSWORD");
            }

            try{
                await run("UPDATE `user` SET `password` = ? WHERE `id` = ?", [password, id]);
            }
            catch(err){
                throw new UserError("DATABASE_ERROR", undefined, err);
            }

            return true;
        })
    }
    catch(err){
        throw err;
    }
}

let alterGrade = async function(id:string, grade:number){
    try{
        return await runQuery(async(run) => {
            try{
                await run("UPDATE `user` SET `grade` = ? WHERE `id` = ?", [grade, id]);
            }
            catch(err){
                throw new UserError("DATABASE_ERROR", undefined, err);
            }

            return true;
        })
    }
    catch(err){
        throw err;
    }
}

const alterUserData = {
    alterNickname, 
    alterPassword,
    alterGrade
}

export default alterUserData;