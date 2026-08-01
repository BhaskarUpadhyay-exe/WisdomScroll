import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children, darkMode, setDarkMode, onNewChat }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar onNewChat={onNewChat} />

      <div style={{ flex: 1 }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px",
            borderRadius: "10px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div
          style={{
            backgroundColor: darkMode ? "#111827" : "#FFFFFF",
            color: darkMode ? "white" : "black",
            minHeight: "100vh",
          }}
        >
          <Navbar />

          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;