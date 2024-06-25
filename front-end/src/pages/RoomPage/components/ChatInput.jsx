import { useState } from "react";

export default function ChatInput({ sendMessage }) {
    const [message, setMessage] = useState('');

    return (
        <form onSubmit={e => sendMessage(e, message, setMessage)} className='chat-input-form'>
            <input 
                className="chat-input" 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="說點什麼..." 
            />
            <button id="send-btn">傳送</button>
        </form>
    )
}