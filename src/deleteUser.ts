import { runQuery } from "@sveltekit-board/db";
import { UserError } from "./error";

export async function deleteUser(id:string){
    try{
        let r = await runQuery(async(run) => {
            return await run("DELETE FROM `user` WHERE `id` = ?", [id]);
        })
        
        if(r.affectedRows == 0){
            throw new UserError("INVALID_ID");
        }
        else{
            return true;
        }
    }
    catch(err){
        throw new UserError("DATABASE_ERROR",undefined, err)
    }
}