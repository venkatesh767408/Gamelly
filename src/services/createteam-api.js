import { logout, updateAccessToken } from "../redux/slices/authSlice";
import { showNotification } from "../redux/slices/uiSlice";
import { store } from "../redux/store";

const TEAM_BASE_URL =
  import.meta.env.VITE_CREATE_TEAM_API_URL ||
  "http://localhost:3001/api/v1/team";
const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/api/v1/auth";

// Token refresh function
const refreshAccessToken = async () => {
  try {
    const state = store.getState();
    const refreshToken = state.auth?.refreshToken;

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
  const url = `${TEAM_BASE_URL}${endpoint}`;

  const state = store.getState();
  let accessToken = state.auth?.accessToken;
  const refreshToken = state.auth?.refreshToken;

  if (accessToken && isTokenExpiredOrExpiring(accessToken) && refreshToken) {
    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      console.log("Token refresh failed, proceeding with original request",error);
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
        try {
          const newAccessToken = await refreshAccessToken();
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, config);
          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            throw new Error(retryData.message || "Request failed after token refresh");
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
      throw new Error(data.message || "Something went wrong");
    }
     return data;
  } catch (error) {
    console.error("Team API Request failed:", error);
    throw error;
  }
};


export const createTeamAPI = (TeamData) => {
  return makeRequest("/createteam", {
    method: "POST",
    body: JSON.stringify(TeamData),
  });
};


export const getTeamsAPI = () => {
  return makeRequest("/getteams", {
    method: "GET",
  });
};


export const getTeamByIdAPI = (teamId) => {
  return makeRequest(`/getteam/${teamId}`, {
    method: "GET",
  });
};


export const updateTeamAPI = (teamId, updateData) => {

  return makeRequest(`/updateteam/${teamId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
};

export const deleteTeamAPI = (teamId) => {
  return makeRequest(`/deleteteam/${teamId}`, {
    method: "DELETE",
  });
};

export const getOpponentAPI=(currentTeamId=null)=>{
  const params=currentTeamId?`?currentTeamId =${currentTeamId}`:""
  return makeRequest(`/getopponents${params}`,{
    method:"GET"
  })
}

export const getSpecificOpponentTeamAPI=(opponentId)=>{
  return makeRequest(`/opponent/${opponentId}`,{
    method:"GET"
  })
}

export const addOpponentAPI=(teamId,opponentId)=>{
  return makeRequest("/add-opponents",{
    method:"POST",
    body: JSON.stringify({ teamId, opponentId }),
  })
}


export const deleteOpponentAPI=(teamId,opponentId)=>{
  return makeRequest("/delete-opponent",{
    method:"DELETE",
      body: JSON.stringify({ teamId, opponentId }),
  })
}