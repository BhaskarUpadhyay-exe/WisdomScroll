import "./ChatHistory.css";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

function ChatHistory({
  messages,
  loading,
}) {
    
    const bottomRef = useRef(null);

useEffect(() => {
  requestAnimationFrame(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  });
}, [messages]);
  return (
    <div className="chat-history">
      {messages.map((message) => (
        <ChatBubble
  key={message.id}
  message={message}
  loading={
    loading &&
    message === messages[messages.length - 1]
  }
/>
      ))}
    
      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatHistory;