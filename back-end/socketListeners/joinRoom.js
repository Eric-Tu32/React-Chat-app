let db = require('../dataBase')

const joinRoom = (io, socket, userInfo) => {

        socket.join(userInfo.roomId);

        if (!(userInfo.roomId in db.rooms)) { // 若房號不存在，創建房間
            db.rooms[userInfo.roomId] = {
                onlineCount: io.sockets.adapter.rooms.get(userInfo.roomId).size,
                members: [],
            }
        } else { // 否則更新房間資訊
            db.rooms[userInfo.roomId].onlineCount = io.sockets.adapter.rooms.get(userInfo.roomId).size
        }

        // 儲存用戶所在房間
        db.users[socket.id] = {
            userName: userInfo.userName,
            roomId: userInfo.roomId,
        }
        if (!(db.rooms[userInfo.roomId].members.includes(userInfo.userName))) {
            db.rooms[userInfo.roomId].members.push(userInfo.userName)
        }
    
        io.to(userInfo.roomId).emit('update-online', {
            members: db.rooms[userInfo.roomId].members,
            roomNum: db.rooms[userInfo.roomId].onlineCount
        })
}

module.exports = joinRoom