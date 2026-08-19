import { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link to="/" className="logo">
        <span className="logo-icon">📜</span>
        <span>WisdomScroll</span>
      </Link>

      {/* LINKS */}

      <div className="links">

        <Link to="/">Home</Link>

        <Link to="/explore">Explore</Link>

        <Link to="/saved">Saved</Link>

        <Link to="/history">History</Link>

        <Link to="/chat">AI Coach</Link>

      </div>

      {/* RIGHT SIDE */}

      <div className="navbar-right">

        {user && (
          <div className="navbar-user">

            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="navbar-avatar"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";

                  e.currentTarget.nextElementSibling.style.display =
                    "flex";
                }}
              />
            ) : null}

            <div
              className="navbar-avatar-placeholder"
              style={{
                display: user.photoURL
                  ? "none"
                  : "flex",
              }}
            >
              {(
                user.displayName ||
                user.email ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="navbar-user-info">

              <span className="navbar-user-name">
                {user.displayName ||
                  "User"}
              </span>

              <span className="navbar-user-email">
                {user.email}
              </span>

            </div>

          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;