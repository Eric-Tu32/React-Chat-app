export default function ChatLine({index, msg}) {
    return (
        <div key={index} className="chat-message">
            {msg}
        </div>
    )
}