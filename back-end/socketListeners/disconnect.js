let db = require('../dataBase')

const disconnect = (io, socket) => {
        // 檢查用戶是否存在
        if (!db.users[socket.id]) {
            return
        }

        const quitUserRoomId = db.users[socket.id].roomId
        const quitUserName = db.users[socket.id].userName

        db.rooms[quitUserRoomId].onlineCount--
        const isClosedRoom = db.rooms[db.users[socket.id].roomId].onlineCount <= 0

        delete db.users[socket.id]
        if (isClosedRoom) {
            // console.log(`delete room: ${quitUserRoomId}`)
            delete db.rooms[quitUserRoomId]
        } else {
            db.rooms[quitUserRoomId].members = db.rooms[quitUserRoomId].members.filter(item => item !== quitUserName)
            io.to(quitUserRoomId).emit('update-online', {
                members: db.rooms[quitUserRoomId].members,
                roomNum: db.rooms[quitUserRoomId].onlineCount
            })
        }
        
        // console.log(Object.keys(db.rooms).length)
        // console.log(Object.keys(db.users).length)
}

module.exports = disconnect