import { useState } from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { socket } from './javascripts/socket';

import socketHook from './customHooks/socketHook';

import ChatBox from './components/ChatBox';
import MemberList from './components/MemberList';

import './css/RoomPage.css'

export default function RoomPage() {
    const location = useLocation();
    const userName = location.state.userName
    const { roomId } = useParams();
    let userInfo = {
        userName: userName,
        roomId: roomId,
    }
    
    const [onlineNum, setOnlineNum] = useState(0)
    const [isConnected, setIsConnected] = useState(true)
    const [messageHistory, setMessageHistory] = useState([]);
    const [memberList, setMemberList] = useState([])

    socketHook(socket, userInfo, setOnlineNum, setMessageHistory, setMemberList)

    function sendMessage(e, message, setMessage) {
        e.preventDefault()
        if (!message.trim()) return
        socket.emit('clientChatMessage', {userInfo: userInfo, message: message});
        setMessage('');
    }

    return (
        <div className="room-main-container">
            <div className='Upper-container'>
                <div className='left-column-container'>
                    <ChatBox 
                        messageHistory={messageHistory} 
                        sendMessage={sendMessage}
                        headerInfo={{
                            onlineNum: onlineNum,
                            isOnline: isConnected,
                            roomId: roomId,
                        }}
                    />
                </div>
                <div className='right-column-container'>
                    <MemberList memberList={memberList} />
                </div>
            </div>
        </div>
    )
}