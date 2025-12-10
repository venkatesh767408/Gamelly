import { showNotification } from "../redux/slices/uiSlice";
import { logout, updateAccessToken } from "../redux/slices/authSlice";
import { store } from "../redux/store";

const PLAYER_BASE_URL =
  import.meta.env.VITE_PLAYER_API_URL || "http://localhost:3002/api/v1/players";
const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/api/v1/auth";

const refreshAccessToken = async () => {
  try {
    const state = store.getState();
    const refreshToken = state.auth?.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Token refresh failed");
    }

    const data = await response.json();
    if (!data.accessToken)
      throw new Error("No access token received from refresh");

    store.dispatch(updateAccessToken(data.accessToken));
    return data.accessToken;
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    if (
      error.message.includes("Invalid") ||
      error.message.includes("expired")
    ) {
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

const isTokenExpiredOrExpiring = (token) => {
  if (!token || token === "testAccessToken") return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    return timeUntilExpiry < 60;
  } catch (error) {
    console.error("Error parsing token:", error);
    return false;
  }
};

const makeRequest = async (endpoint, options = {}) => {
  const url = `${PLAYER_BASE_URL}${endpoint}`;
  const state = store.getState();
  let accessToken = state.auth?.accessToken;
  const refreshToken = state.auth?.refreshToken;

  if (accessToken && isTokenExpiredOrExpiring(accessToken) && refreshToken) {
    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      console.log("Token refresh failed, proceeding with original request");
    }
  }

  // Check if body is FormData
  const isFormData = options.body instanceof FormData;
  
  const config = {
    ...options,
    headers: {
      // Don't set Content-Type for FormData - let browser set it with boundary
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  };

  // Only stringify if it's not FormData
  if (!isFormData && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    console.error("❌ No access token available for request");
    store.dispatch(
      showNotification({
        type: "error",
        message: "Authentication required. Please login again.",
      })
    );
    throw new Error("No access token provided");
  }

  try {
    const response = await fetch(url, config);
    
    // Handle response parsing
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        data = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          message: response.ok ? 'Request successful' : 'Request failed'
        };
      }
    }

    if (!response.ok) {
      if (response.status === 401 && refreshToken) {
        console.log("🔄 Received 401, attempting token refresh and retry...");
        try {
          const newAccessToken = await refreshAccessToken();
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, config);
          
          const retryContentType = retryResponse.headers.get('content-type');
          let retryData;
          
          if (retryContentType && retryContentType.includes('application/json')) {
            retryData = await retryResponse.json();
          } else {
            const text = await retryResponse.text();
            retryData = JSON.parse(text);
          }

          if (!retryResponse.ok) {
            throw new Error(
              retryData.message || "Request failed after token refresh"
            );
          }

          return retryData;
        } catch (refreshError) {
          console.error("Retry after refresh failed:", refreshError);
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
    console.error("Player API Request failed:", error);
    throw error;
  }
};



export const createPlayerAPI = (playerData) => {
  console.log("🔍 createPlayerAPI - Input type:", typeof playerData);
  console.log("🔍 createPlayerAPI - Is FormData?", playerData instanceof FormData);
  
  // If it's FormData, send it directly without stringifying
  if (playerData instanceof FormData) {
    console.log("🚀 Sending FormData directly");
    
    // Log FormData contents for debugging
    console.log("📦 FormData contents:");
    for (let [key, value] of playerData.entries()) {
      console.log(`   ${key}:`, value);
    }
    
    return makeRequest("/createplayer", {
      method: "POST",
      body: playerData, // Send FormData directly
      // No Content-Type header - let browser set it
    });
  } else {
    console.log("🚀 Sending as JSON:", playerData);
    return makeRequest("/createplayer", {
      method: "POST",
      body: playerData, // makeRequest will stringify this
    });
  }
}


export const getPlayersByAPI=(teamId)=>{
    return makeRequest(`/team/${teamId}`,{
          method:"GET"
    })
}


export const updatePlayerAPI = (playerId, updateData) => {
  if (updateData instanceof FormData) {
    return makeRequest(`/${playerId}`, {
      method: "PUT",
      body: updateData,
    });
  } else {
    return makeRequest(`/${playerId}`, {
      method: "PUT",
      body: updateData,
    });
  }
}


export const deletePlayerAPI=(playerId)=>{
    return makeRequest(`/${playerId}`,{
        method:"DELETE"
    })
}
