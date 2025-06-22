import { useState } from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { socket } from './javascripts/socket';

import socketHook from './customHooks/socketHook';

import ChatBox from './components/ChatBox';
import MemberList from './components/MemberList';

import './css/RoomPage.css'

import {UserInfo, User, userMessageData} from "@shared/types"

export default function RoomPage() {
    const STORAGE_KEY = 'chatMessages';
    const location = useLocation();
    const userName = location.state.userName
    const token = location.state.token
    const { roomId } = useParams();
    let userInfo: UserInfo = {
        userName: userName,
        token: token,
        roomId: roomId!,
    }
    
    const [onlineNum, setOnlineNum] = useState(0)
    const [isConnected, setIsConnected] = useState(true)
    const [messageHistory, setMessageHistory] = useState<string[]>(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    const [memberList, setMemberList] = useState<Record<string, User>>({});

    socketHook(
        socket, 
        userInfo, 
        setOnlineNum, 
        setMessageHistory, 
        setMemberList,
    )

    function sendMessage(
        e: React.FormEvent<HTMLFormElement>, 
        message: string, 
        setMessage: React.Dispatch<React.SetStateAction<string>>,
    ) {
        e.preventDefault()
        if (!message.trim()) return
        const msgData: userMessageData = {
            UserInfo: userInfo,
            message: message
        }
        socket.emit('clientChatMessage', msgData);
        setMessage('');
    }

    return (
        <div className="room-main-container">
            <div className='Left-container'>
                <div className='Upper-left-container'>
                        <ChatBox 
                            messageHistory={messageHistory} 
                            sendMessage={sendMessage}
                            headerInfo={{
                                onlineNum: onlineNum,
                                isOnline: isConnected,
                                roomId: roomId!,
                            }}
                        />
                </div>
                <div className='Lower-left-container'>
                        <MemberList memberList={memberList} />
                </div>
            </div>
            <div className="Right-container">
            </div>  
        </div>
    )
}