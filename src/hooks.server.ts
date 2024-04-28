import User from "$lib/src/user.js";

export async function handle({event, resolve}){
    return await resolve(event);
}