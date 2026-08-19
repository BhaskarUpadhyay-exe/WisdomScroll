import "./Layout.css";
import Navbar from "./Navbar";

function Layout({
  children,
  darkMode,
  setDarkMode,
  showNavbar = true,
}) {
  return (
    <div className="app-layout">

      <div className="main-content">

        {showNavbar && <Navbar />}

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

        <div className="page-content">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Layout;