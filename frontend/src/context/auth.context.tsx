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

      // Return the full response for email verification handling
      return res;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // SET TOKEN (for OAuth)
  // --------------------------
  const setToken = async (token: string) => {
    console.log('🚀 setToken called with token:', token)
    localStorage.setItem('token', token)
    
    try {
      // Wait a moment for rate limiting to reset
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Fetch user profile with retry logic
      console.log('🔍 Fetching user profile...')
      let retryCount = 0
      const maxRetries = 3
      
      while (retryCount < maxRetries) {
        try {
          const meRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          
          console.log('📡 User profile response status:', meRes.status)
          
          if (meRes.status === 429) {
            // Rate limited, wait and retry
            console.log('⏳ Rate limited, waiting before retry...')
            await new Promise(resolve => setTimeout(resolve, 2000))
            retryCount++
            continue
          }
          
          if (!meRes.ok) {
            throw new Error(`HTTP error! status: ${meRes.status}`)
          }
          
          const meData = await meRes.json()
          console.log('👤 User profile data:', meData)
          
          const userObj = meData.user || meData.data || meData
          
          if (userObj) {
            console.log('💾 Storing user data:', userObj)
            localStorage.setItem('user', JSON.stringify(userObj))
            setUser(userObj)
            console.log('✅ User state updated:', userObj)
            console.log('🎯 OAuth flow completed successfully')
            return // Success, exit the retry loop
          } else {
            console.error('❌ No user object in response')
            throw new Error('No user data received')
          }
        } catch (fetchError) {
          retryCount++
          if (retryCount >= maxRetries) {
            throw fetchError
          }
          console.log(`🔄 Retry attempt ${retryCount} failed:`, fetchError)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch user profile after retries:', error)
      // Don't logout immediately, just log the error
      // The user might still be authenticated but we couldn't fetch profile
      console.log('⚠️ Continuing without user profile data')
    }
  };

  // --------------------------
  // COMPREHENSIVE LOGOUT FUNCTION
  // --------------------------
  const logout = () => {
    console.log('🚪 Starting comprehensive logout process...')
    
    try {
      // Clear all authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Clear any other potential user-related data
      sessionStorage.removeItem('oauth_redirect_url');
      sessionStorage.removeItem('oauth_token');
      
      // Clear user state
      setUser(null);
      
      // Clear any cached API responses by triggering a hard refresh
      console.log('✅ All user data cleared, performing hard refresh...')
      
      // Small delay to ensure all state updates are processed
      setTimeout(() => {
        // Use location.reload() for a complete refresh
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Even if there's an error, try to redirect to home
      window.location.href = '/';
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    setToken,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
