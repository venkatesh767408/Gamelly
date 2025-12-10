import { showNotification } from "../redux/slices/uiSlice";
import { logout, updateAccessToken } from "../redux/slices/authSlice";
import { store } from "../redux/store";

const SCHEDULE_BASE_URL =
  import.meta.env.VITE_SCHEDULE_API_URL ||
  "http://localhost:3003/api/v1/schedule";
const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/api/v1/auth";

const refreshAccessToken = async () => {
  try {
    const state = store.getState();
    const refreshToken = state.auth?.refreshToken;

    console.log("🔄 Attempting token refresh...");

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

    if (!refreshToken.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Token refresh failed");
    }

    const data = await response.json();

    if (!data.accessToken) {
      throw new Error("No access token received from refresh");
    }

    store.dispatch(updateAccessToken(data.accessToken));
    console.log("✅ Token refreshed successfully");
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
  const url = `${SCHEDULE_BASE_URL}${endpoint}`;
  const state = store.getState();
  let accessToken = state.auth?.accessToken;
  const refreshToken = state.auth?.refreshToken;

  console.log("🔐 Schedule API Token status:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    endpoint: endpoint
  });

  // If no access token, try to use refresh token
  if (!accessToken && refreshToken) {
    try {
      console.log("🔄 No access token, attempting refresh...");
      accessToken = await refreshAccessToken();
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      store.dispatch(logout());
      throw new Error("Authentication failed");
    }
  }

  const config = {
    method: options.method || 'GET',
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (accessToken && accessToken !== "testAccessToken") {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    console.warn("⚠️ No valid access token available");
    store.dispatch(
      showNotification({
        type: "error",
        message: "Authentication required. Please login again.",
      })
    );
    throw new Error("No valid access token provided");
  }

  // Add body for non-GET requests
  if (options.body && config.method !== 'GET') {
    config.body = options.body;
  }

  try {
    console.log("🚀 Making API request to:", url);
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.warn("⚠️ Non-JSON response:", text);
      throw new Error(`Invalid response format: ${text}`);
    }

    if (!response.ok) {
      console.error("❌ API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      if (response.status === 401 && refreshToken) {
        console.log("🔄 401 received, attempting token refresh...");
        try {
          const newAccessToken = await refreshAccessToken();
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, config);
          const retryData = await retryResponse.json();
          
          if (!retryResponse.ok) {
            throw new Error(retryData.message || "Request failed after retry");
          }
          return retryData;
        } catch (refreshError) {
          console.error("❌ Retry after refresh failed:", refreshError);
          store.dispatch(logout());
          throw new Error("Session expired. Please login again.");
        }
      }

      if (response.status === 403) {
        throw new Error("Access forbidden. Please check your permissions.");
      }

      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    console.log("✅ API Request successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Schedule API Request failed:", error);
    throw error;
  }
};


export const createScheduleAPI=(scheduleData)=>{
    return makeRequest("/createschedule",{
        method:"POST",
        body:JSON.stringify(scheduleData)
    })
}


export const getSchedulesByTeamAPI=(teamId)=>{
    return makeRequest(`/getschedules/${teamId}`,{
        method:"GET"
    })
}

export const updateScheduleAPI=(scheduleId,updateData)=>{
    return makeRequest(`/updateschedule/${scheduleId}`,{
        method:"PUT",
        body:JSON.stringify(updateData)
    })
}

export const deleteScheduleAPI=(scheduleId)=>{
    return makeRequest(`/deleteschedule/${scheduleId}`,{
        method:"DELETE"
    })
}
