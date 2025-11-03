import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

  // Auto-refresh token function
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/refresh-token/`, {
        method: "POST",
        credentials: "include", // This includes the httpOnly refresh token cookie
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access);
        return data.access;
      } else {
        // If refresh fails, logout user
        await logout();
        return null;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      await logout();
      return null;
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/user-info/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/user/login-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.access);
        await fetchUserProfile(data.access);
        return { success: true, data };
      } else {
        return { 
          success: false, 
          error: data.error || "Login failed" 
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: "Network error. Please try again." 
      };
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  // Signup function
  const signup = useCallback(async (email, password, additionalData = {}) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/user/signup-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          email, 
          password, 
          ...additionalData 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.access);
        await fetchUserProfile(data.access);
        return { success: true, data };
      } else {
        return { 
          success: false, 
          error: data.error || "Signup failed" 
        };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        error: "Network error. Please try again." 
      };
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if we have a token
      if (accessToken) {
        await fetch(`${API_BASE_URL}/api/user/logout-user/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
      setAccessToken(null);
    }
  }, [accessToken]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_BASE_URL}/api/user/user-info/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true, data };
      } else {
        return { 
          success: false, 
          error: data.error || "Profile update failed" 
        };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      return { 
        success: false, 
        error: "Network error. Please try again." 
      };
    }
  }, [accessToken]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Try to refresh token to check if user is logged in
        const token = await refreshAccessToken();
        
        if (token) {
          await fetchUserProfile(token);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshAccessToken, fetchUserProfile]);

  // Auto-refresh token periodically
  useEffect(() => {
    if (!accessToken || !isAuthenticated) return;

    // Refresh token every 50 minutes (JWT tokens typically last 1 hour)
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [accessToken, isAuthenticated, refreshAccessToken]);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    accessToken,

    // Actions
    login,
    signup,
    logout,
    updateProfile,
    refreshAccessToken,

    // Setters (for manual state updates if needed)
    setUser,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;