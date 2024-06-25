import MemberData from "./MemberData";

import '../css/MemberList.css'

export default function MemberList({ memberList }) {
    return (
        <div className="member-container">
            <div className='member-bar-container'>
                <p> 線上成員： </p>
            </div>
            <div className="member-list">
                {memberList.map((memberName, index) => (
                    <MemberData key={index} index={index} userName={memberName}/>
                ))}
            </div>
        </div>
    )
};