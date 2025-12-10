import { logout, updateAccessToken } from "../redux/slices/authSlice";
import { showNotification } from "../redux/slices/uiSlice";
import { store } from "../redux/store";

const PROFILE_BASE_URL = import.meta.env.VITE_PROFILE_API_URL || "http://localhost:3000/api/v1/profile";
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/api/v1/auth";

// Reuse the same token refresh function from your auth API
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

const makeProfileRequest = async (endpoint, options = {}) => {
  const url = `${PROFILE_BASE_URL}${endpoint}`;

  // Get auth state from Redux store
  const state = store.getState();
  let accessToken = state.auth?.accessToken;
  const refreshToken = state.auth?.refreshToken;

  console.log('🔐 Profile API Token status:', { 
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    endpoint
  });

  // Refresh token if it's expired or about to expire
  if (accessToken && isTokenExpiredOrExpiring(accessToken) && refreshToken) {
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
      // If we get 401, try to refresh token and retry once
      if (response.status === 401 && refreshToken) {
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

      if (response.status === 401) {
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
    console.error("Profile API Request failed:", error);
    throw error;
  }
};

// File upload utility for profile pictures
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Profile API functions
export const getProfileAPI = () => {
  return makeProfileRequest("/");
};

export const updateProfileAPI = (profileData) => {
  return makeProfileRequest("/", {
    method: "PUT",
    body: JSON.stringify(profileData)
  });
};

// NEW: Update specific profile field
export const updateProfileFieldAPI = (field, value) => {
  return makeProfileRequest("/field", {
    method: "PUT",
    body: JSON.stringify({ field, value })
  });
};

export const uploadProfilePictureAPI = async (file) => {
  try {
    console.log('📤 Uploading profile picture...', { 
      fileName: file.name, 
      fileSize: file.size,
      fileType: file.type 
    });

    // Convert file to base64
    const base64String = await convertFileToBase64(file);
    const base64Data = base64String.split(',')[1];

    // Get auth state
    const state = store.getState();
    let accessToken = state.auth?.accessToken;
    const refreshToken = state.auth?.refreshToken;

    // Refresh token if needed
    if (accessToken && isTokenExpiredOrExpiring(accessToken) && refreshToken) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {
        console.log('Token refresh failed, proceeding with upload');
      }
    }

    const url = `${PROFILE_BASE_URL}/picture`;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        file: base64Data,
        mimetype: file.type
      })
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle token refresh and retry for upload
      if (response.status === 401 && refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken();
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          
          const retryResponse = await fetch(url, config);
          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            throw new Error(retryData.message || "Upload failed after token refresh");
          }

          return retryData;
        } catch (refreshError) {
          console.error('Retry after refresh failed:', refreshError);
        }
      }

      if (response.status === 401) {
        store.dispatch(logout());
        store.dispatch(
          showNotification({
            type: "error",
            message: "Session expired. Please login again.",
          })
        );
      }
      throw new Error(data.message || "Profile picture upload failed");
    }

    console.log('✅ Profile picture uploaded successfully');
    return data;
  } catch (error) {
    console.error("❌ Profile picture upload failed:", error);
    throw error;
  }
};

export const deleteProfilePictureAPI = () => {
  return makeProfileRequest("/picture", {
    method: "DELETE"
  });
};

// NEW: Convenience functions for specific field updates
export const updatePhoneAPI = (phone) => {
  return updateProfileFieldAPI('phone', phone);
};

export const updateLocationAPI = (location) => {
  return updateProfileFieldAPI('location', location);
};

export const updateAgeAPI = (age) => {
  return updateProfileFieldAPI('age', age);
};

export const updateFullnameAPI = (fullname) => {
  return updateProfileFieldAPI('fullname', fullname);
};

// Optional: Get user by ID (for public profiles)
export const getUserByIdAPI = (userId) => {
  return makeProfileRequest(`/user/${userId}`);
};

// Optional: Update user preferences
export const updateUserPreferencesAPI = (preferences) => {
  return makeProfileRequest("/preferences", {
    method: "PUT",
    body: JSON.stringify({ preferences })
  });
};