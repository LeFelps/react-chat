import { Message } from "./types";

const MessageBubble = ({ message, isMine, ...props }: { message: Message, isMine: boolean, props?: any }) => {
    return (
        <div className="flex" {...props}>
            <div className={`rounded-md mt-1 max-w-60 relative ${isMine ? "ml-auto bg-orange-400/50" : "mr-auto bg-zinc-400"}`}>
                <p className="py-1 px-2 message-text">{message.message}<span className="invisible w-16">0000</span></p>
                <span className="ml-2 text-xs py-1 pr-2 absolute bottom-0 right-0">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            </div>
        </div>
    );
};

export default MessageBubble;