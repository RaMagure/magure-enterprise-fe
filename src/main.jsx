import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { TokenProvider } from "./contexts/TokenContext.jsx";
import { UserProvider } from "./contexts/UserSelf.jsx";
import { HttpsApiResponseProvider } from "./contexts/httpsResponseContext.jsx";
import { AuthTokenSync } from "./contexts/AuthTokenSync.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <TokenProvider>
        <AuthTokenSync>
          <UserProvider>
            <HttpsApiResponseProvider>
              <App />
            </HttpsApiResponseProvider>
          </UserProvider>
        </AuthTokenSync>
      </TokenProvider>
    </AuthProvider>
  </StrictMode>
);
