import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from "firebase/auth";

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";

import { auth } from "../firebase";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // =========================
  // GOOGLE LOGIN
  // =========================

 const handleGoogleLogin = async () => {
  if (loading) return;

  setLoading(true);

  try {
    // =========================================
    // ANDROID — NATIVE GOOGLE SIGN-IN
    // =========================================

    if (Capacitor.getPlatform() === "android") {
      console.log(
        "Starting native Android Google login..."
      );

      const result =
        await FirebaseAuthentication.signInWithGoogle({
          skipNativeAuth: true,
          useCredentialManager: true,
        });

      console.log(
        "Native Google result:",
        result
      );

      const idToken =
        result?.credential?.idToken;

      if (!idToken) {
        throw new Error(
          "Google did not return an ID token."
        );
      }

      // Convert the native Google ID token
      // into a Firebase JS credential.
      const credential =
        GoogleAuthProvider.credential(
          idToken
        );

      const firebaseResult =
        await signInWithCredential(
          auth,
          credential
        );

      const user =
        firebaseResult.user;

      console.log(
        "Android Firebase login successful"
      );

      console.log(
        "User UID:",
        user.uid
      );

      console.log(
        "User email:",
        user.email
      );

      // App.jsx will detect Firebase auth
      // automatically through onAuthStateChanged.
      navigate("/", {
        replace: true,
      });

      return;
    }

    // =========================================
    // WEB — EXISTING GOOGLE POPUP LOGIN
    // =========================================

    const provider =
      new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    console.log(
      "Starting web Google login..."
    );

    const result =
      await signInWithPopup(
        auth,
        provider
      );

    const user =
      result.user;

    console.log(
      "Web Google login successful"
    );

    console.log(
      "User UID:",
      user.uid
    );

    console.log(
      "User email:",
      user.email
    );

    navigate("/", {
      replace: true,
    });

  } catch (error) {
    console.error(
      "Google login error:",
      error
    );

    // User cancelled the Google picker
    if (
      error?.code ===
      "auth/popup-closed-by-user"
    ) {
      return;
    }

    if (
      error?.code ===
      "auth/popup-blocked"
    ) {
      alert(
        "Google login popup was blocked. Please try again."
      );
      return;
    }

    if (
      error?.code ===
      "auth/cancelled-popup-request"
    ) {
      return;
    }

    if (
      error?.code ===
      "auth/unauthorized-domain"
    ) {
      alert(
        "This website is not authorized for Google login in Firebase."
      );
      return;
    }

    if (
      error?.code ===
      "auth/operation-not-allowed"
    ) {
      alert(
        "Google Sign-In is not enabled in Firebase."
      );
      return;
    }

    if (
      error?.code ===
      "auth/network-request-failed"
    ) {
      alert(
        "Network error. Please check your internet connection and try again."
      );
      return;
    }

    alert(
      `Could not sign in with Google.\n\n${
        error?.message || "Unknown error"
      }`
    );

  } finally {
    setLoading(false);
  }
};

  // =========================
  // UI
  // =========================

  return (
    <div className="login-page">

      <div className="login-container">

        {/* BRAND */}

        <div className="login-brand">

          <div className="login-brand-icon">
            📜
          </div>

          <h1>
            WisdomScroll
          </h1>

        </div>

        {/* HEADING */}

        <div className="login-heading">

          <h2>
            Escape the scroll.
          </h2>

          <p>
            Keep your promises.
          </p>

        </div>

        {/* DESCRIPTION */}

        <p className="login-description">
          Focus, reflect, and become
          the person you said you'd
          become.
        </p>

        {/* GOOGLE LOGIN */}

        <button
          type="button"
          className="google-btn"
          onClick={
            handleGoogleLogin
          }
          disabled={loading}
          style={{
            opacity: loading
              ? 0.6
              : 1,

            cursor: loading
              ? "wait"
              : "pointer",
          }}
        >

          <span className="google-icon">
            G
          </span>

          {loading
            ? "Signing in..."
            : "Continue with Google"}

        </button>

        {/* DIVIDER */}

        <div className="login-divider">

          <span></span>

          <p>Secure login</p>

          <span></span>

        </div>

        {/* LOGIN INFORMATION */}

        <p
          className="login-footer"
          style={{
            lineHeight: "1.6",
          }}
        >
          Sign in securely with your
          Google account.
          <br />
          Your account is protected by
          Firebase Authentication.
        </p>

      </div>

    </div>
  );
}

export default Login;