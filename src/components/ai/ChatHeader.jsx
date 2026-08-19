import "./ChatHeader.css";

function ChatHeader({ startNewChat }) {
  return (
    <div className="chat-header">

      <div>
        <h2 className="chat-title">
          📜 WisdomScroll AI
        </h2>

        <p className="chat-subtitle">
          Your personal AI mentor
        </p>
      </div>

      <button
        className="new-chat-btn"
        onClick={startNewChat}
      >
        + New Chat
      </button>

    </div>
  );
}

export default ChatHeader;