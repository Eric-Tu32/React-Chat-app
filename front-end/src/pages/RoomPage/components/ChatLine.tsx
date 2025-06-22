export default function ChatLine({
    index, 
    msg
} : {
    index: number,
    msg: string
}) {
    return (
        <div key={index} className="chat-message">
            {msg}
        </div>
    )
}