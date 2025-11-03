import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AuthenticatedLayout from "./components/Layout/AuthenticatedLayout";
import ChatInterface from "./components/Chat/ChatInterface";
import SettingsPage from "./components/Settings/SettingsPage";
import { AuthGuard, ProtectedRoute } from "./components/Auth";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Landing/Auth route */}
          <Route path="/" element={<AuthGuard />} />

          {/* Protected routes with layout */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ChatInterface />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <SettingsPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
