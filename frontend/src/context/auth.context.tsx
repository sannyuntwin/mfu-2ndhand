"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "@/types";
import { authService } from "@/services/auth.service";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Invalid stored user, resetting.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // --------------------------
  // LOGIN USING authService
  // --------------------------
  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      // Step 1: Call /auth/login
      const loginRes = await authService.login({ email, password });
      console.log("🔥 LOGIN RESPONSE:", loginRes);

      const token = loginRes.token;
      if (!token) throw new Error("Login failed: No token returned.");

      // Store token
      localStorage.setItem("token", token);

      // Step 2: Fetch user profile (/auth/me)
      const meRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const meData = await meRes.json();
      console.log("🔥 USER PROFILE:", meData);

      const userObj = meData.user || meData.data || meData;

      if (!userObj) throw new Error("Failed to fetch user profile.");

      // Store user
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);

      // Redirect based on role
      const role = userObj.role;
      if (role === "ADMIN") window.location.href = "/admin/dashboard";
      else if (role === "SELLER") window.location.href = "/dashboard";
      else window.location.href = "/";

    } catch (err) {
      console.error("Login Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // REGISTER USING authService
  // --------------------------
  const register = async (data: any) => {
    setLoading(true);

    try {
      const res = await authService.register(data);
      console.log("🔥 REGISTER RESPONSE:", res);

      const token = res.token;
      const newUser = res.user;

      if (token) localStorage.setItem("token", token);
      if (newUser) localStorage.setItem("user", JSON.stringify(newUser));

      setUser(newUser);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
