import MemberData from "./MemberData";

import '../css/MemberList.css'
import { User } from "@shared/types";

export default function MemberList({ memberList } : {
    memberList: Record<string, User>
}) {
    return (
        <div className="member-container">
            <div className='member-bar-container'>
                <p> 線上成員： </p>
            </div>
            <div className="member-list">
                {Object.values(memberList).map((member, index) => (
                    <MemberData key={index} index={index} member={member}/>
                ))}
            </div>
        </div>
    )
};