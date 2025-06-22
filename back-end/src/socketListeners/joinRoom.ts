import { User, Room, UserInfo } from "@shared/types";
import { Rooms, Users, Id_to_token } from "../dataBase"
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server, Socket } from 'socket.io';

export default function joinRoom (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
    userInfo: UserInfo,
) {
        let set_leader = false
        socket.join(userInfo.roomId);

        if (Rooms && !(userInfo.roomId in Rooms)) { // 若房號不存在，創建房間
            set_leader = true
            Rooms[userInfo.roomId] = {
                onlineCount: io.sockets.adapter.rooms.get(userInfo.roomId)?.size ?? 0,
                members: {},
                no_user: false,
            }
        } else { // 否則更新房間資訊
            Rooms[userInfo.roomId].onlineCount = io.sockets.adapter.rooms.get(userInfo.roomId)?.size ?? 0;
        }

        
        // 若用戶不存在，新增用戶資料
        if(!(userInfo.token in Users)) {
            console.log('new user')
            io.to(socket.id).emit('clearMessageHistory')
            Users[userInfo.token] = {
                is_leader: false,
                is_connected: true,
                userName: userInfo.userName,
                roomId: userInfo.roomId,
            }
            Id_to_token[socket.id] = userInfo.token
            Rooms[userInfo.roomId].members[userInfo.token] = Users[userInfo.token]
            if (set_leader) Users[userInfo.token].is_leader = true
            console.log(Rooms)
            io.to(userInfo.roomId).emit('serverMessageEmit', {userName: '[系統]', message: `${userInfo.userName}加入了房間`})           
        } else { // 若存在，更新 socket 資料
            Users[userInfo.token].is_connected = true
            Id_to_token[socket.id] = userInfo.token
        }
    
        io.to(userInfo.roomId).emit('update-online', {
            members: Rooms[userInfo.roomId].members,
            roomNum: Rooms[userInfo.roomId].onlineCount
        })
}