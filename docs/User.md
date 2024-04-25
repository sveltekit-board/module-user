# User

`User` 클래스는 db의 `user` 테이블과 상호작용합니다.

## 정적 메소드

### *async* User.checkTable

`User.checkTable` 메소드는 `user` 테이블이 존재하는지, 열(column)의 형식이 맞는지 체크합니다. 단, AUTO_INCREMENT 등의 **추가적인** 내용은 체크하지 않습니다. 만약 형식이 올바르지 않다면 해당 테이블을 DROP 합니다.

테이블이 올바르다면 `true`를, 그렇지 않다면 `false`를 반환합니다.

### *async* User.createTable

db에 `user` 테이블을 생성합니다. 이미 `user` 테이블이 존재한다면 에러가 발생할 수 있습니다. `User.checkTable`과 함께 사용하는 것이 좋습니다.

```ts
if(!await User.checkTable()){
    await User.createTable()
}
```

### *async* User.createNewUser

`User.createNewUser` 메소드는 새 유저를 생성합니다. 새 유저가 생성되었다면 해당 유저(`User` 인스턴스)를 반환하고, 그렇지 않으면 `null`을 반환합니다.

```ts
static async createNewUser(data: UserCreatingData): Promise<User | null>

interface UserCreatingData {
    provider: string;
    providerId: string;
    name: string | null;
    nickname: string;
    profileImage: string | null;
}
```


### *async* User.getUser

`User.getUser` 메소드는 db에서 해당 사용자가 있는지 체크하고, `User` 인스턴스 또는 `null`을 반환합니다. 새 `User` 인스턴스를 만들 때 `new User()` 대신 `User.getUser()`을 사용하면 db에서 해당 사용자가 있는지 체크할 수 있습니다.

```ts
static async getUser(provider: string, providerId: string): Promise<User | null>
```

## 메소드

### *async* getData
db에서 유저 데이터를 가져와 반환합니다. 파라미터로 가져올 열의 이름으로 된 배열을 받을 수 있습니다. 파라미터가 없으면 모든 열을 가져옵니다.

```ts
async getData(): Promise<UserMethodResult<UserData>>
async getData(columns:string[]): Promise<UserMethodResult<Partial<UserData>>>
```

#### error
- `USER_DOES_NOT_EXISTS`: 유저가 존재하지 않습니다.

### *async* setNickname

사용자의 닉네임을 설정합니다. cooldown을 설정하여 닉네임 변경 쿨타임을 설정할 수 있습니다(초 단위). 만약 cooldown이 지나지 않았다면 닉네임이 변경되지 않습니다.

```ts
async setNickname(nickname: string, cooldown?: number): Promise<UserMethodResult>
```

#### error
- `USER_DOES_NOT_EXISTS`: 유저가 존재하지 않습니다.
- `CHECK_NICKNAME_CHANGE_COOLDOWN`: 쿨타임이 지나지 않았습니다.
- `NICKNAME_ALREADY_USING`: 이미 해당 닉네임을 사용중입니다.

### *async* setName

사용자의 이름을 설정합니다.

```ts
async setName(nickname: string)
```

#### error
- `USER_DOES_NOT_EXISTS`: 유저가 존재하지 않습니다.
- `NAME_ALREADY_USING`: 이미 해당 닉네임을 사용중입니다.

### *async* setGrade

사용자의 등급을 설정할 수 있습니다. 등급은 0~255의 정수여야합니다.
```ts
async setGrade(grade: number)
```

#### error
- `GRADE_MUST_BE_INTEGER`: 파라미터가 정수가 아닙니다.
- `CHECK_GRADE_RANGE`: 파라미터 범위가 0~255가 아닙니다.
- `USER_DOES_NOT_EXISTS`: 유저가 존재하지 않습니다.
- `NO_GRADE_CHANGE`: 등급이 변경되지 않았습니다.(원래 등급과 같음.)

### *async* setProfileImage

사용자의 프로필 이미지를 설정합니다.

```ts
async setProfileImage(image: string)
```

#### error
- `USER_DOES_NOT_EXISTS`: 유저가 존재하지 않습니다.
- `NO_PROFILE_IMAGE_CHANGE`: 프로필 이미지가 변경되지 않았습니다.(원래 이미지와 같음.)

## UserMethodResult

`User` 클래스의 거의 모든 메소드의 반환값으로 사용됩니다.

```ts
type UserMethodResult<T = any> = { success: true, data?: T } | {success:false, error?: string}
```