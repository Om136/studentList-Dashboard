import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type AuthError,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { AuthContext } from "./AuthContextDef";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("Auth state changed:", user ? "User logged in" : "No user");
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setSigningIn(true);
      setError(null);
      console.log("Starting sign-in process...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Sign-in successful:", result.user.email);
    } catch (err) {
      console.error("Sign-in error:", err);
      const authError = err as AuthError;
      let errorMessage = "Failed to sign in";

      if (authError.code === "auth/configuration-not-found") {
        errorMessage =
          "Firebase authentication is not properly configured. Please check your Firebase setup.";
      } else if (authError.code === "auth/popup-blocked") {
        errorMessage =
          "Pop-up was blocked by your browser. Please allow pop-ups for this site.";
      } else if (authError.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled. Please try again.";
      }

      setError(errorMessage);
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("Sign-out error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign out");
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signingIn,
        error,
        signIn,
        signOut,
        clearError,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
