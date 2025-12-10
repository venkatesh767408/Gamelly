import { showNotification } from "../redux/slices/uiSlice";
import { logout, updateAccessToken } from "../redux/slices/authSlice";
import { store } from "../redux/store";

const STAFF_BASE_URL =
  import.meta.env.VITE_STAFF_API_URL || "http://localhost:3002/api/v1/staff";
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
  const url = `${STAFF_BASE_URL}${endpoint}`;
  const state = store.getState();
  let accessToken = state.auth?.accessToken;
  const refreshToken = state.auth?.refreshToken;

  if (accessToken && isTokenExpiredOrExpiring(accessToken) && refreshToken) {
    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      console.log(error);
      console.log("Token refresh failed, proceeding with original request");
    }
  }

  const config = {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  };

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
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && refreshToken) {
        console.log("🔄 Received 401, attempting token refresh and retry...");
        try {
          const newAccessToken = await refreshAccessToken();
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, config);
          const retryData = await retryResponse.json();

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



export const createStaffAPI = (staffData)=>{
    return makeRequest("/createstaff",{
        method:"POST",
        body: JSON.stringify(staffData),
    })
}


export const getStaffByAPI=(teamId)=>{
    return makeRequest(`/team/${teamId}`,{
          method:"GET"
    })
}


export const updateStaffAPI = (staffId,updateData)=>{
    return makeRequest(`/${staffId}`,{
        method:"PUT",
         body: JSON.stringify(updateData),

    })
}


export const deleteStaffAPI=(staffId)=>{
    return makeRequest(`/${staffId}`,{
        method:"DELETE"
    })
}
