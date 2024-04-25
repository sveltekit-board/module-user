import User from "$lib/src/user.js";

export async function load(){
    const user = new User('test', 'test123');
    console.log(await user.setName('asdasda'))
}