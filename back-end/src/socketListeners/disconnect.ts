import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

import { Rooms, Users, Id_to_token } from "../dataBase"
import { db_status } from "./logging"

export default function disconnect(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
) {
        // 檢查用戶是否存在
        if (!Id_to_token[socket.id] || !Users[Id_to_token[socket.id]] || !Rooms[Users[Id_to_token[socket.id]].roomId]) {
            return
        }

        const quitUser = Users[Id_to_token[socket.id]]
        const quitUserRoomId = Users[Id_to_token[socket.id]].roomId

        Rooms[quitUserRoomId].onlineCount--
        const isClosedRoom = Rooms[quitUserRoomId].onlineCount <= 0

        quitUser.is_connected = false
        const dR = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!quitUser || !Rooms[quitUserRoomId]) {
                        
                } else if (!quitUser.is_connected) {
                    io.to(quitUserRoomId).emit('serverMessageEmit', {userName: '[系統]', message: `${quitUser.userName}離開了隊伍`})
                    if (quitUser.is_leader && Object.keys(Rooms[quitUserRoomId].members).length>0) {
                        console.log('leader quit')
                        const keys = Object.keys(Rooms[quitUserRoomId].members);
                        for (let i=0; i<keys.length; i++) {
                            if (keys[i] === Id_to_token[socket.id]) {
                                console.log('spliced previous leader')
                                keys.splice(i, 1)
                            }
                        }
                        if(!(keys.length === 0)) {
                            const randomKey = keys[Math.floor(Math.random() * keys.length)];
                            Rooms[quitUserRoomId].members[randomKey].is_leader = true
                        }
                    }
                    delete Users[Id_to_token[socket.id]]
                    delete Rooms[quitUserRoomId].members[Id_to_token[socket.id]]
                    try {
                        // may not work
                        io.to(quitUserRoomId).emit('update-online', {
                            members: Rooms[quitUserRoomId].members,
                            roomNum: Rooms[quitUserRoomId].onlineCount
                        })
                    } catch {}
                    console.log('deleted user')
                } else {
                    console.log('cancel user deletion')
                }
                console.log(`deleted ${socket.id}`)
                delete Id_to_token[socket.id]
                db_status()
            }, 5000)
        })
        
        // 房間為空時，如果五秒後房間依舊為空，則刪除房間
        if (isClosedRoom) {
            const dR = new Promise((resolve, reject) => {
                if (Rooms[quitUserRoomId].no_user) return;
                else Rooms[quitUserRoomId].no_user = true 
                setTimeout(() => {
                    if (!io.sockets.adapter.rooms.get(quitUserRoomId)){
                        console.log(`delete room: ${quitUserRoomId}`)
                        for (const memberToken in Rooms[quitUserRoomId].members) {
                            delete Users[memberToken]
                        }
                        delete Rooms[quitUserRoomId]
                        db_status()
                    } else {
                        console.log(`cancel deletion: ${quitUserRoomId}`)
                        Rooms[quitUserRoomId].no_user = false 
                        db_status()
                        // may not work
                        io.to(quitUserRoomId).emit('update-online', {
                            members: Rooms[quitUserRoomId].members,
                            roomNum: Rooms[quitUserRoomId].onlineCount
                        })
                    }
                }, 5000)
            })
        } else {
            db_status()
        }

        // 更新房間資訊
        try {
            io.to(quitUserRoomId).emit('update-online', {
                members: Rooms[quitUserRoomId].members,
                roomNum: Rooms[quitUserRoomId].onlineCount
            })
        } catch {}
    }