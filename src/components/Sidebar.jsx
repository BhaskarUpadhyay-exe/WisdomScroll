import "./Sidebar.css";
import { Link } from "react-router-dom";

import { useChatContext } from "../context/ChatContext";

function Sidebar() {
  const { startNewChat } = useChatContext();
  return (
  <div className="sidebar">
    <h2>WisdomScroll</h2>

    <button
      className="new-chat-btn"
     onClick={startNewChat}
    >
      + New Chat
    </button>

    <div className="chat-list">
      <Link to="/">🏠 Home</Link>

      <br />
      <br />

      <Link to="/chat">🤖 AI Chat</Link>

      <br />
      <br />

      <Link to="/about">👤 About</Link>
    </div>
  </div>
);
}

export default Sidebar;