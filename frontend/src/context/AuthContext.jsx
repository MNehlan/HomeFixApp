import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import api from "../services/api";

import { getFriendlyErrorMessage } from "../utils/errorUtils";

import { AuthContext } from "./AuthContextDefinition";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      return res.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null; // Profile not created yet
      }
      throw err;
    }
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      localStorage.setItem("token", token);

      const profile = await fetchProfile();
      if (!profile) {
        throw new Error("Profile not found. Please contact support or register again.")
      }
      setUser(profile);
      return profile;
    } catch (err) {
      setAuthError(getFriendlyErrorMessage(err));
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem("token", token);

          let profile = await fetchProfile();
          // Retry once if profile not found (handle signup race condition)
          if (!profile) {
            await new Promise(r => setTimeout(r, 1000));
            profile = await fetchProfile();
          }

          setUser(profile);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        logout,
        refreshUser: async () => {
          let profile = await fetchProfile()
          if (!profile) {
            await new Promise(r => setTimeout(r, 1000));
            profile = await fetchProfile();
          }
          setUser(profile)
        },
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};


