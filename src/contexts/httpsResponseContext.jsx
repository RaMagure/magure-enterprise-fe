import axios from "axios";
import { createContext, useCallback, useContext } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useTokenContext } from "./TokenContext.jsx";

export const HttpsApiResponse = createContext(undefined);

const AxiosService = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

const createApiErrorResponse = (error) => {
  let errorMessage = "An error occurred while processing your request.";

  if (error.response) {
    // Handle different response formats
    if (error.response.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.status === 401) {
      errorMessage = "Authentication credentials were not provided.";
    } else {
      errorMessage = `Server error: ${error.response.status}`;
    }
  } else if (error.request) {
    errorMessage = "No response received from the server.";
  } else {
    errorMessage = error.message;
  }
  return {
    success: false,
    errorMsg: errorMessage,
    response: {},
  };
};

export const HttpsApiResponseProvider = ({ children }) => {
  const { token, getToken, isAuthenticated } = useTokenContext();

  AxiosService.defaults.headers.common["Content-Type"] = "application/json";
  AxiosService.defaults.headers.common["Accept"] = "application/json";

  // Add response interceptor to handle token refresh on 401
  AxiosService.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await getToken();
          if (newToken) {
            AxiosService.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return AxiosService(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed in interceptor:", refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  const attachToken = useCallback(async () => {
    try {
      if (token) {
        AxiosService.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      } else if (isAuthenticated) {
        // Try to get/refresh token if we don't have one but are authenticated
        const refreshedToken = await getToken();
        if (refreshedToken) {
          AxiosService.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${refreshedToken}`;
        } else {
          // If we can't get a token but should be authenticated, clear auth header
          delete AxiosService.defaults.headers.common["Authorization"];
        }
      } else {
        // Remove authorization header if not authenticated
        delete AxiosService.defaults.headers.common["Authorization"];
      }
    } catch (error) {
      console.error("Error fetching credentials:", error);
      // On error, remove auth header to prevent stale token usage
      delete AxiosService.defaults.headers.common["Authorization"];
    }
  }, [isAuthenticated, token, getToken]);

  const get = useCallback(
    async (endpoint) => {
      await attachToken();
      return AxiosService.get(endpoint)
        .then((response) => {
          console.log(`GET request to ${endpoint}:`, response.status);
          if (response?.data?.nextCursor) {
            return {
              success: true,
              errorMsg: "",
              response: response.data,
              nextCursor: response.data.nextCursor,
            };
          }
          return {
            success: true,
            errorMsg: "",
            response: response.data,
          };
        })
        .catch((error) => {
          console.error(`GET: ${endpoint} failed:`, error?.response);
          return createApiErrorResponse(error);
        });
    },
    [attachToken]
  );

  const post = useCallback(
    async (endpoint, data, headers = {}) => {
      await attachToken();
      return AxiosService.post(endpoint, data, { headers })
        .then((response) => {
          console.log(`POST request to ${endpoint}:`, response.status);
          return {
            success: true,
            errorMsg: "",
            response: response.data,
          };
        })
        .catch((error) => {
          console.error(`POST: ${endpoint} failed:`, error?.response);
          return createApiErrorResponse(error);
        });
    },
    [attachToken]
  );

  const put = useCallback(
    async (endpoint, data) => {
      await attachToken();
      return AxiosService.put(endpoint, data)
        .then((response) => {
          console.log(`PUT request to ${endpoint}:`, response.status);
          return {
            success: true,
            errorMsg: "",
            response: response.data,
          };
        })
        .catch((error) => {
          console.error(`PUT: ${endpoint} failed:`, error?.response);
          return createApiErrorResponse(error);
        });
    },
    [attachToken]
  );

  const deleteMe = useCallback(
    async (endpoint, data) => {
      await attachToken();
      return AxiosService.delete(endpoint, data)
        .then((response) => {
          console.log(`DELETE request to ${endpoint}:`, response.status);
          return {
            success: true,
            errorMsg: "",
            response: response.data,
          };
        })
        .catch((error) => {
          console.error(`DELETE: ${endpoint} failed:`, error?.response);
          return createApiErrorResponse(error);
        });
    },
    [attachToken]
  );

  return (
    <HttpsApiResponse.Provider value={{ token, get, post, put, deleteMe }}>
      {children}
    </HttpsApiResponse.Provider>
  );
};

export const useHttpsApiResponse = () => {
  const context = useContext(HttpsApiResponse);
  if (!context) {
    throw new Error(
      "useHttpsApiResponse must be used within a HttpsApiResponseProvider"
    );
  }
  return context;
};
