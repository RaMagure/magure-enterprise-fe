import { createContext, useCallback, useContext, useState, useEffect } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getToken = useCallback(async () => {
    try {
      // If we already have a valid token, return it
      if (token) {
        return token;
      }

      // If we're already refreshing, wait for it to complete
      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve) => {
          const checkToken = () => {
            if (!isRefreshing) {
              resolve(token);
            } else {
              setTimeout(checkToken, 100);
            }
          };
          checkToken();
        });
      }

      // Otherwise, try to refresh
      const newToken = await legacyRefreshToken();
      return newToken;
    } catch (err) {
      console.error("Error getting token:", err);
      return null;
    }
  }, [token, isRefreshing]);

  // Legacy compatibility - keep this for existing code
  const legacyRefreshToken = useCallback(async () => {
    // Prevent multiple simultaneous refresh requests
    if (isRefreshing) {
      return null;
    }

    try {
      setIsRefreshing(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/user/refresh-token/`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setToken(data.access);
        return data.access;
      } else {
        console.error("Failed to refresh access token");
        setToken(null);
        return null;
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      setToken(null);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  return (
    <TokenContext.Provider value={{ 
      token, 
      setToken, 
      getToken,
      refreshToken: legacyRefreshToken, // For backward compatibility
      isAuthenticated,
      setIsAuthenticated,
      isRefreshing
    }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenContext must be used within a TokenProvider");
  }
  return context;
};
