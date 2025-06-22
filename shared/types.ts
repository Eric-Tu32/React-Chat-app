export type Room = {
    onlineCount: number,
    members: Record<string, User>,
    no_user: boolean,
}

export type User = {
    // basic information
    is_leader: boolean,
    is_connected: boolean,
    userName: string,
    roomId: string,
}

export type IdTokenMapping = Record<string, string>

export type UserInfo = {
    userName: string;
    token: string;
    roomId: string;
}

export type userMessageData = {
    UserInfo: UserInfo,
    message: string
}