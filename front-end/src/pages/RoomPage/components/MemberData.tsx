import { User } from "@shared/types"

export default function MemberData ({ index, member }: {
    index: number,
    member: User,
}) {
    return (
        <div key={index} className="member"> 
            <p className="member-name">{member.is_leader ? member.userName + " (L)" : member.userName}</p>
        </div>
    )
}