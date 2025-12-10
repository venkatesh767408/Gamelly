import { logout, updateAccessToken } from "../redux/slices/authSlice";
import { showNotification } from "../redux/slices/uiSlice";
import { store } from "../redux/store";

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/api/v1/auth";

// Token refresh function
const refreshAccessToken = async () => {
  try {
    const state = store.getState();
    const refreshToken = state.auth?.refreshToken;

    console.log('🔄 Attempting token refresh...');
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Token refresh failed");
    }

    const data = await response.json();
    
    if (!data.accessToken) {
      throw new Error("No access token received from refresh");
    }

    // Update the store with new access token
    store.dispatch(updateAccessToken(data.accessToken));

    console.log('✅ Token refreshed successfully');
    return data.accessToken;
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    
    // Only logout if it's a true authentication failure
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      store.dispatch(logout());
      store.dispatch(
        showNotification({
          type: "error",
          message: "Session expired. Please login again.",
        })
      );
    }
    throw error;
  }
};

// Check if token is expired or about to expire
const isTokenExpiredOrExpiring = (token) => {
  if (!token || token === "testAccessToken") return false; // Don't check test tokens
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Consider token expired if it has less than 1 minute left
    return timeUntilExpiry < 60;
  } catch (error) {
    console.error('Error parsing token:', error);
    return false; // Don't treat parsing errors as expiration
  }
};

const makeRequest = async (endpoint, options = {}) => {
  const url = `${AUTH_BASE_URL}${endpoint}`;

  // Get auth state from Redux store
  const state = store.getState();
  let accessToken = state.auth?.accessToken;
  const refreshToken = state.auth?.refreshToken;

  console.log('🔐 Auth API Token status:', { 
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    endpoint
  });

  // For auth endpoints (except refresh), don't attempt token refresh
  const isAuthEndpoint = !endpoint.includes('/refresh');
  
  // Refresh token if it's expired or about to expire (only for non-auth endpoints)
  if (isAuthEndpoint && accessToken && isTokenExpiredOrExpiring(accessToken) && refreshToken) {
    try {
      console.log('🔄 Token needs refresh, refreshing...');
      accessToken = await refreshAccessToken();
    } catch (error) {
      console.log('Token refresh failed, proceeding with original request');
    }
  }

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // If we get 401 and it's not the refresh endpoint, try to refresh token and retry once
      if (response.status === 401 && refreshToken && isAuthEndpoint) {
        console.log('🔄 Received 401, attempting token refresh and retry...');
        try {
          const newAccessToken = await refreshAccessToken();
          
          // Retry the request with new token
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, config);
          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            throw new Error(retryData.message || "Request failed after token refresh");
          }

          return retryData;
        } catch (refreshError) {
          console.error('Retry after refresh failed:', refreshError);
          // Fall through to original error handling
        }
      }

      if (response.status === 401 && !endpoint.includes("/verify-otp")) {
        store.dispatch(logout());
        store.dispatch(
          showNotification({
            type: "error",
            message: "Session expired. Please login again.",
          })
        );
      }
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("Auth API Request failed:", error);
    throw error;
  }
};

export const registerUserAPI = (userData) => {
  return makeRequest("/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });
};

export const verifyOTPAPI = (otpData) => {
  return makeRequest("/verify-otp", {
    method: "POST",
    body: JSON.stringify(otpData)
  });
};

export const resendOTPAPI = (email) => {
  return makeRequest("/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email })
  });
};

export const loginUserAPI = (credentials) => {
  return makeRequest("/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
};

export const refreshTokenAPI = (refreshToken) => {
  return makeRequest("/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken })
  });
};

export const logoutUserAPI = (refreshToken) => {
  return makeRequest("/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken })
  });
};

export const forgotPasswordAPI = (email) => {
  return makeRequest("/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email })
  });
};

export const resetPasswordAPI = (resetData) => {
  return makeRequest("/reset-password", {
    method: "POST",
    body: JSON.stringify(resetData)
  });
};

export const googleLoginAPI = (idToken) => {
  return makeRequest("/google", {
    method: "POST",
    body: JSON.stringify({ idToken })
  });
};