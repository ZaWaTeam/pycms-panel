export interface IAuthState {
    logged: boolean,
    user: IUserCredentials,
}

export interface IUserCredentials {
    id?: number,
    username: string,
    email: string,
}

export interface IAuthCredentials {
    access_token: string,
    type: "bearer" | "unset",
    expires_in: Date
}

export interface IUserLogin {
    username: string,
    password: string,
}