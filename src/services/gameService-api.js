import { logout, updateAccessToken } from "../redux/slices/authSlice";
import { showNotification } from "../redux/slices/uiSlice";
import { store } from "../redux/store";
import { io } from "socket.io-client";

const GAME_BASE_URL =
  import.meta.env.VITE_GAME_API_URL || "http://localhost:5005/api/v1/game";

const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/api/v1/auth";

const SOCKET_URL = import.meta.env.VITE_GAME_WS_URL || "http://localhost:5005";

let socket = null;
let connectionHealthInterval = null;

const refreshAccessToken = async () => {
  try {
    const state = store.getState();
    const refreshToken = state.auth?.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(
      `${import.meta.env.VITE_AUTH_API_URL || AUTH_BASE_URL}/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error("Refresh failed");
    }

    const data = await response.json();
    if (!data.accessToken) {
      throw new Error("No access token received");
    }

    store.dispatch(updateAccessToken(data.accessToken));
    return data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error?.message);
    store.dispatch(logout());
    store.dispatch(
      showNotification({
        type: "error",
        message: "Session expired. Please login again.",
      })
    );
    throw error;
  }
};

const isTokenExpiredOrExpiring = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    const timeLeft = payload.exp - currentTime;
    return timeLeft < 60;
  } catch {
    return true;
  }
};

const makeGameRequest = async (endpoint, options = {}) => {
  const url = `${GAME_BASE_URL}${endpoint}`;

  let state = store.getState();
  let accessToken = state.auth?.accessToken;
  const refreshToken = state.auth?.refreshToken;

  console.log("🔐 Game API Token status:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    isTokenExpiring: accessToken ? isTokenExpiredOrExpiring(accessToken) : true,
  });

  // Refresh if needed
  if ((!accessToken || isTokenExpiredOrExpiring(accessToken)) && refreshToken) {
    try {
      console.log("🔄 Refreshing token before API request...");
      accessToken = await refreshAccessToken();
      console.log("✅ Token refreshed successfully");
    } catch (err) {
      console.warn("❌ Token refresh failed before request", err);
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
    console.log("🚀 Making API request to:", url);
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      if (response.status === 401 && refreshToken) {
        console.log("🔄 Received 401, attempting token refresh and retry...");
        try {
          const newAccessToken = await refreshAccessToken();
          
          // Update config with new token
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Retry the request with new token
          const retryResponse = await fetch(url, config);
          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            throw new Error(
              retryData.message || `Request failed with status ${retryResponse.status}`
            );
          }

          return retryData;
        } catch (refreshError) {
          console.error("❌ Retry after refresh failed:", refreshError);
        }
      }

      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          store.dispatch(logout());
          store.dispatch(
            showNotification({
              type: "error",
              message: "Session expired. Please login again.",
            })
          );
          break;
        case 403:
          store.dispatch(
            showNotification({
              type: "error",
              message: "You don't have permission to perform this action.",
            })
          );
          break;
        case 404:
          store.dispatch(
            showNotification({
              type: "error",
              message: "Resource not found.",
            })
          );
          break;
        case 429:
          store.dispatch(
            showNotification({
              type: "warning",
              message: "Too many requests. Please slow down.",
            })
          );
          break;
        default:
          store.dispatch(
            showNotification({
              type: "error",
              message: data.message || "Something went wrong",
            })
          );
      }
      
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error("❌ Game API Request failed:", error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      store.dispatch(
        showNotification({
          type: "error",
          message: "Network error. Please check your connection.",
        })
      );
    }
    
    throw error;
  }
};

export const initializeGameSocket = async () => {
  if (socket && socket.connected) {
    socket.disconnect();
    socket = null;
  }

  // Clear existing health monitoring
  if (connectionHealthInterval) {
    clearInterval(connectionHealthInterval);
    connectionHealthInterval = null;
  }

  let state = store.getState();
  let token = state.auth?.accessToken;

  // 🔥 FIXED: Proper token refresh before socket connection
  if (!token || isTokenExpiredOrExpiring(token)) {
    console.log("🔄 Token missing or expiring, refreshing before socket connection...");
    try {
      token = await refreshAccessToken();
      state = store.getState();
      token = state.auth?.accessToken;
    } catch (error) {
      console.error("❌ Token refresh failed before socket connection:", error);
      return null;
    }
  }

  if (!token) {
    console.error("❌ No access token available for Socket.IO connection");
    return null;
  }

  try {
    console.log("Initializing Socket.IO connection...");
    socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("✅ Game Socket.IO connected successfully, ID:", socket.id);
      
      // Start health monitoring
      connectionHealthInterval = setInterval(() => {
        if (socket && socket.connected) {
          socket.emit("ping", Date.now());
        }
      }, 30000); // Every 30 seconds

      const currentGameId = store.getState().game?.currentGame?.base?._id;
      if (currentGameId) {
        setTimeout(() => {
          joinGameRoom(currentGameId);
        }, 100);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Game Socket.IO disconnected. Reason:", reason);
      
      // Clear health monitoring
      if (connectionHealthInterval) {
        clearInterval(connectionHealthInterval);
        connectionHealthInterval = null;
      }

      if (reason === "io server disconnect") {
        setTimeout(() => {
          if (socket) {
            socket.connect();
          }
        }, 1000);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Game Socket.IO connection error:", error.message);

      // Handle authentication errors
      if (error.message.includes("auth") || error.message.includes("401")) {
        console.log("🔐 Authentication error, attempting token refresh...");
        refreshAccessToken()
          .then((newToken) => {
            if (newToken && socket) {
              console.log("🔄 Updating socket with new token and reconnecting...");
              socket.auth.token = newToken;
              socket.connect();
            }
          })
          .catch((refreshError) => {
            console.error("❌ Token refresh failed:", refreshError);
          });
      }
    });

    socket.on("reconnect", (attempt) => {
      console.log(`🔄 Socket.IO reconnected after ${attempt} attempts`);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`🔄 Socket.IO reconnection attempt ${attempt}`);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Socket.IO reconnection failed");
    });

    socket.on("error", (error) => {
      console.error("❌ Game Socket.IO error:", error);
    });

    socket.on("pong", (latency) => {
      console.log("🏓 Socket.IO pong received, connection healthy");
    });

    return socket;
  } catch (error) {
    console.error("❌ Socket.IO initialization error:", error);
    return null;
  }
};

export const disconnectGameSocket = () => {
  if (connectionHealthInterval) {
    clearInterval(connectionHealthInterval);
    connectionHealthInterval = null;
  }
  
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log("🔌 Game Socket.IO disconnected and cleaned up");
  }
};

export const joinGameRoom = (gameId) => {
  if (!gameId) {
    return;
  }

  if (socket && socket.connected) {
    socket.emit("join-game", gameId);
    console.log(`✅ Joined game room via Socket.IO: ${gameId}`);
  } else {
    console.warn("⚠️ Socket.IO not connected, attempting to reconnect...");

    if (!socket) {
      initializeGameSocket();
    } else if (!socket.connected) {
      socket.connect();
    }

    setTimeout(() => {
      if (socket && socket.connected) {
        socket.emit('join-game', gameId);
        console.log(`🎯 Joined game room after reconnect: ${gameId}`);
      } else {
        console.error(`❌ Failed to join room ${gameId} - socket still not connected`);
      }
    }, 1000);
  }
};

export const leaveGameRoom = (gameId) => {
  if (socket && socket.connected) {
    socket.emit('leave-game', gameId);
    console.log(`🚪 Left game room via Socket.IO: ${gameId}`);
  }
};

export const sendScoreUpdate = (gameId, team, score, eventType = null, playerId = null) => {
  if (socket && socket.connected) {
    socket.emit('update-score', {
      gameId,
      team,
      score,
      eventType,
      playerId
    });
    console.log(`📊 Sent score update via Socket.IO: ${team} = ${score}`);
  } else {
    console.warn("⚠️ Socket.IO not connected, cannot send score update");
  }
};

export const sendGameEvent = (gameId, eventData) => {
  if (socket && socket.connected) {
    socket.emit('add-game-event', {
      gameId,
      eventData
    });
    console.log(`⚡ Sent game event via Socket.IO:`, eventData);
  } else {
    console.warn("⚠️ Socket.IO not connected, cannot send game event");
  }
};

export const getSocket = () => socket;
export const isSocketConnected = () => socket && socket.connected;

// UTILITY FUNCTIONS
export const getConnectionStatus = () => {
  if (!socket) return 'disconnected';
  return socket.connected ? 'connected' : 'disconnected';
};

export const getSocketId = () => socket?.id;

// REST API FUNCTIONS
export const createGameAPI = (payload) =>
  makeGameRequest("/games", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getGamesByTeamAPI = (teamId, queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const query = queryString ? `?${queryString}` : "";
  return makeGameRequest(`/games/team/${teamId}${query}`);
};

export const getGameByIdAPI = (gameId) => makeGameRequest(`/games/${gameId}`);

export const startGameAPI = (gameId) =>
  makeGameRequest(`/games/${gameId}/start`, {
    method: "PUT",
  });

export const updateGameProgressAPI = (gameId, payload) =>
  makeGameRequest(`/games/${gameId}/progress`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const addGameEventAPI = (gameId, payload) =>
  makeGameRequest(`/games/${gameId}/events`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const endGameAPI = (gameId, payload) =>
  makeGameRequest(`/games/${gameId}/end`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const getGameEventsAPI = (gameId) =>
  makeGameRequest(`/games/${gameId}/events`);

export const deleteGameAPI = (gameId) =>
  makeGameRequest(`/games/${gameId}`, {
    method: "DELETE",
  });

// FOOTBALL-SPECIFIC API FUNCTIONS
export const updateFootballMatchStateAPI = (gameId, payload) =>
  makeGameRequest(`/games/${gameId}/football/match-state`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const makeSubstitutionAPI = (gameId, payload) =>
  makeGameRequest(`/games/${gameId}/football/substitution`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

// SHARED GAME FUNCTIONS
export const findSharedGameAPI = (teamId, opponentTeamId, sport) =>
  makeGameRequest(`/games/teams/${teamId}/${opponentTeamId}/${sport}`);

export const createSharedGameAPI = (payload) =>
  makeGameRequest("/games", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// HEALTH CHECK
export const checkGameServiceHealth = () => makeGameRequest("/health");

// SERVICE INFO
export const getGameServiceInfo = () => makeGameRequest("/info");