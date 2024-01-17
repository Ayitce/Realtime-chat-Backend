export type TUser = {
    _id: string
    username: string
    password: string
}

export type TUserQuery = TUser & { _id: string } | null

export type TUserLogin = TUserLogin & { login: () => Promise<TUserQuery> }

export type TUserSave = TUser & { save: () => Promise<TUserQuery> }

