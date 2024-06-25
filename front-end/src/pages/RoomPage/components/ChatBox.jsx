import { useRef, useEffect } from "react";
import ChatLine from "./ChatLine";
import ChatInput from "./ChatInput";

import '../css/ChatBox.css'

export default function ChatBox({ messageHistory, sendMessage, headerInfo }) {
    const chatBoxRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messageHistory]); // Scroll to bottom whenever messages change

    const scrollToBottom = () => {
        if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    return (
        <div className="chat-container">
            <div className='status-bar-container'>
                <p> 房間人數：{headerInfo.onlineNum} / 狀態：{headerInfo.isOnline ? "在線" : "離線"}</p>
            </div>
            <div className="chat-header-container">
                <p>房間名稱：{headerInfo.roomId}</p>
            </div>
            <div className="chat-messages" id="chat-messages" ref={chatBoxRef}>
                {messageHistory.map((msg, index) => (
                    <ChatLine key={index} index={index} msg={msg} />
                ))}
            </div>
            <div className="chat-input-form">
                <ChatInput sendMessage={sendMessage}></ChatInput>
            </div>
        </div>
    )
};