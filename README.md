# @sveltekit-board/user

sveltekit을 위한 user 라이브러리입니다. [@sveltekit-board/auth](https://github.com/sveltekit-board/module-auth)와 함께 사용하세요.

## 사용법
```ts
/* src/hooks.server.ts */
import User from '@sveltekit-board/user';
import auth, { providers } from '@sveltekit-board/auth';
import { sequence } from '@sveltejs/kit/hooks';

//처음 서버를 실행할 때 테이블을 체크합니다.
if(!await User.checkTable()){
    await User.createTable()
}

const github = new providers.Github({
    clientId: process.env.GITHUB_CLIENT_ID,//client id
    clientSecret: process.env.GITHUB_CLIENT_SECRET//client secret
})

export const handle = sequence(auth([github], {
    key: process.env.AUTH_KEY, 
    maxAge: 3600, 
    autoRefreshMaxAge: true
}), async function({event, resolve}){
    //hook에 사용할 함수
    return await resolve(event)
})
```

```ts
/* src/routes/+page.server.ts */
import User from '@sveltekit-board/user';

export async function load({locals}){
    let user;
    if(locals.user){
        user = await User.getUser(locals.user.provider, locals.user.providerId)
    }

    return {
        userName: await user.getData(['name'])
    }
}
```

## 살펴보기

[`User`](https://github.com/sveltekit-board/module-user/blob/main/docs/User.md)