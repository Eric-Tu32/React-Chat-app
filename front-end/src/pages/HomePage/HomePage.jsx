import { useState } from "react";
import { useNavigate } from "react-router-dom"

import './css/HomePage.css'

export default function HomePage() {

    const [userName, setUserName] = useState(''); // 儲存用戶名
    const [roomID, setRoomID] = useState(''); // 儲存房間ID
    const navigate = useNavigate()

    function redirectRoom(e, roomID, userName) {
        e.preventDefault()
        if (roomID.trim() && userName.trim()){
            navigate(`room/${roomID}`, {state: {
                userName: userName,
            }})
        }
    }

    return (
        <div className="home-main-container" id="home-main-container">
            <div className="header-container">
                <h2>多人線上聊天</h2>
            </div>
            <div className="home-container">
                <div className="LoginForm">
                    <form onSubmit={e => redirectRoom(e, roomID, userName)} className="login-form">
                        <div className="form-group">
                            <input 
                                placeholder='暱稱'
                                className='form-input'
                                id='username'
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                type="text" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                placeholder='房間ID'
                                className='form-input'
                                value={roomID}
                                onChange={e => setRoomID(e.target.value)}
                                type="text" 
                                required 
                            />
                        </div>
                        <button className='form-btn'>加入/創建房間</button>
                    </form>
                </div>
            </div>
        </div>
    )
}