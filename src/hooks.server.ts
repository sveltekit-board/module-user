import User from "$lib/src/user.js";

if(!await User.checkTable()){
    await User.createTable()
}

export async function handle({event, resolve}){
    return await resolve(event);
}