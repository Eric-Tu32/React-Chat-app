export default function MemberData ({ index, userName }) {
    return (
        <div key={index} className="member"> 
            <p className="member-name">{userName}</p>
        </div>
    )
}