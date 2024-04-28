import User from "$lib/src/user.js";

export async function load(){
    if(!await User.checkTable()){
        await User.fixTable()
    }
}