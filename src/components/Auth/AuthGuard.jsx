import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingPage from "./LoadingPage";
import AuthModal from "./AuthModal";

const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Show auth modal only after loading is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
    } else if (isAuthenticated) {
      setShowAuthModal(false);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div>
      <LoadingPage />
      <AuthModal
        open={showAuthModal}
        onClose={() => {
          // Don't allow closing the modal if not authenticated
          // The user must sign in or sign up
        }}
      />
    </div>
  );
};

export default AuthGuard;
