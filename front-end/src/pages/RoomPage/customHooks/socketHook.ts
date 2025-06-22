import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

import {UserInfo, User, Room} from '@shared/types'

const socketHook = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap>, 
    userInfo: UserInfo, 
    setOnlineNum: React.Dispatch<React.SetStateAction<number>>, 
    setMessageHistory: React.Dispatch<React.SetStateAction<string[]>>, 
    setMemberList: React.Dispatch<React.SetStateAction<Record<string, User>>>,
) => {
    useEffect(() => {
        socket.connect()
        socket.emit('joinRoom', userInfo);

        const updateOnline = (status: {
            roomNum: number,
            members: Record<string, User>,
        }) => {  
            setOnlineNum(status.roomNum)
            setMemberList(status.members)
        }

        const serverMessageEmit = (res: {
            userName: string, 
            message: string,
        }) => {
            setMessageHistory((prevMessages) => [...prevMessages, `${res.userName}：${res.message}`]);
        }

        const clearMessageHistory = () => {
            sessionStorage.setItem('chatMessages', JSON.stringify([]));
            setMessageHistory([])
        }

        socket.on('update-online', updateOnline)
        socket.on('serverMessageEmit', serverMessageEmit);
        socket.on('clearMessageHistory', clearMessageHistory)

        return () => {
            socket.off('update-online', updateOnline)
            socket.off('serverMessageEmit', serverMessageEmit);
            socket.off('clearMessageHistory', clearMessageHistory);
            socket.disconnect()
        }
    }, []);
};

export default socketHook;