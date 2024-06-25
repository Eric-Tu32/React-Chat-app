import { useEffect } from 'react';

const socketHook = (socket, userInfo, setOnlineNum, setMessageHistory, setMemberList) => {
    useEffect(() => {
        socket.connect()
        socket.emit('joinRoom', userInfo);

        const updateOnline = (status) => {  
            setOnlineNum(status.roomNum)
            setMemberList(status.members)
        }

        const serverMessageEmit = (res) => {
            // console.log(`client received message: ${res.message}`)
            setMessageHistory((prevMessages) => [...prevMessages, `${res.userName}：${res.message}`]);
        }

        socket.on('update-online', updateOnline)
        socket.on('serverMessageEmit', serverMessageEmit);

        return () => {
            socket.off('update-online', updateOnline)
            socket.off('serverMessageEmit', serverMessageEmit);
            socket.disconnect()
        }
    }, []); 
};

export default socketHook;