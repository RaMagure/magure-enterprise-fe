// Hook to sync AuthContext with TokenContext
import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useTokenContext } from "./TokenContext";

export const AuthTokenSync = ({ children }) => {
  const { accessToken, isAuthenticated } = useAuth();
  const { setToken, setIsAuthenticated } = useTokenContext();

  // Sync auth state to token context
  useEffect(() => {
    setToken(accessToken);
    setIsAuthenticated(isAuthenticated);
  }, [accessToken, isAuthenticated, setToken, setIsAuthenticated]);

  return children;
};
