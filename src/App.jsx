import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { App as CapacitorApp } from "@capacitor/app";

import { auth } from "./firebase";
import { scheduleDailyWisdom } from "./services/notifications";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import History from "./pages/History";
import About from "./pages/About";
import Login from "./pages/Login";
import Explore from "./pages/Explore";
import Saved from "./pages/Saved";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // =========================
  // ANDROID BACK BUTTON
  // =========================

  useEffect(() => {
    let listener;

    const setupBackButton = async () => {
      listener = await CapacitorApp.addListener(
        "backButton",
        ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            CapacitorApp.minimizeApp();
          }
        }
      );
    };

    setupBackButton();

    return () => {
      listener?.remove();
    };
  }, []);

  // =========================
  // FIREBASE AUTH LISTENER
  // =========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        setCheckingAuth(false);

        // =========================
        // NOTIFICATIONS
        // =========================

        if (currentUser) {
          try {
            await scheduleDailyWisdom();

            console.log(
              "Daily wisdom notifications ready."
            );
          } catch (error) {
            console.error(
              "Notification setup failed:",
              error
            );
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================
  // WAIT FOR FIREBASE
  // =========================

  if (checkingAuth) {
    return null;
  }

  // =========================
  // ROUTES
  // =========================

  return (
    <Routes>

      {/* =========================
          LOGIN
          ========================= */}

      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to="/"
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      {/* =========================
          HOME
          ========================= */}

      <Route
        path="/"
        element={
          user ? (
            <Home />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* =========================
          AI CHAT
          ========================= */}

      <Route
        path="/chat"
        element={
          user ? (
            <Chat />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* =========================
          HISTORY
          ========================= */}

      <Route
        path="/history"
        element={
          user ? (
            <History />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* =========================
          EXPLORE
          ========================= */}

      <Route
        path="/explore"
        element={
          user ? (
            <Explore />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* =========================
          SAVED
          ========================= */}

      <Route
        path="/saved"
        element={
          user ? (
            <Saved />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* =========================
          ABOUT
          ========================= */}

      <Route
        path="/about"
        element={
          user ? (
            <About />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* =========================
          UNKNOWN ROUTE
          ========================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;