import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";

function Sidebar() {
  const { startNewChat } = useChatContext();

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>📜 WisdomScroll</h2>
        <p>Build yourself.</p>
      </div>

      <button
        className="new-chat-btn"
        onClick={startNewChat}
      >
        + New Chat
      </button>

      <nav className="sidebar-nav">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          🤖 Wisdom
        </NavLink>

      </nav>

      <div className="sidebar-footer">
        Version 1.0
      </div>

    </aside>
  );
}

export default Sidebar;