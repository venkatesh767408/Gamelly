import {
  addGameEventAPI,
  createGameAPI,
  deleteGameAPI,
  endGameAPI,
  getGameByIdAPI,
  getGameEventsAPI,
  getGamesByTeamAPI,
  initializeGameSocket,
  joinGameRoom,
  startGameAPI,
  updateGameProgressAPI,
} from "../../services/gameService-api";
import {
  addGameEventFailure,
  addGameEventStart,
  addGameEventSuccess,
  clearCurrentGame,
  clearError,
  createGameFailure,
  createGameStart,
  createGameSuccess,
  deleteGameFailure,
  deleteGameStart,
  deleteGameSuccess,
  endGameFailure,
  endGameStart,
  endGameSuccess,
  getGameByIdFailure,
  getGameByIdStart,
  getGameByIdSuccess,
  getGameEventsFailure,
  getGameEventsStart,
  getGameEventsSuccess,
  getGamesByTeamFailure,
  getGamesByTeamStart,
  getGamesByTeamSuccess,
  joinLiveGame,
  leaveLiveGame,
  startGameFailure,
  startGameStart,
  startGameSuccess,
  updateGameProgressFailure,
  updateGameProgressStart,
  updateGameProgressSuccess,
  wsConnected,
  wsDisconnected,
} from "../slices/gameSlice";
import { showNotification } from "../slices/uiSlice";

const getErrorMessage = (error) => {
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  if (typeof error === "string") return error;
  return "Something went wrong";
};

// WEB SOCKET MANAGEMENT
export const initializeGameSocketConnection = () => async (dispatch) => {
  try {
    const socket = await initializeGameSocket(); // 🔥 FIXED: Added await

    if (!socket) {
      throw new Error("Failed to initialize WebSocket");
    }

    // Socket.IO uses different event names
    socket.on("connect", () => {
      dispatch(wsConnected());
      dispatch(
        showNotification({
          type: "success",
          message: "Connected to live updates",
        })
      );
    });

    socket.on("disconnect", () => {
      dispatch(wsDisconnected());
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket error:", error);
      dispatch(
        showNotification({
          type: "error",
          message: "Live updates disconnected",
        })
      );
    });

    return socket;
  } catch (error) {
    console.error("WebSocket initialization failed:", error);
    dispatch(
      showNotification({
        type: "warning",
        message: "Live updates unavailable",
      })
    );
    return null;
  }
};

// JOIN GAME FOR LIVE UPDATES
export const joinGameForLiveUpdates = (gameId) => async (dispatch) => {
  try {
    joinGameRoom(gameId);
    dispatch(joinLiveGame(gameId));
  } catch (error) {
    console.error("Failed to join game room:", error);
  }
};

// LEAVE GAME ROOM
export const leaveGameRoomUpdates = (gameId) => async (dispatch) => {
  try {
    dispatch(leaveLiveGame(gameId));
  } catch (error) {
    console.error("Failed to leave game room:", error);
  }
};

// CREATE GAME
export const createGame = (payload) => async (dispatch) => {
  try {
    dispatch(createGameStart());
    dispatch(clearError());

    const res = await createGameAPI(payload);

    if (res.success) {
      dispatch(createGameSuccess(res.data));

      dispatch(
        showNotification({
          type: "success",
          message: res.message || "Game created successfully",
        })
      );

      try {
        await dispatch(initializeGameSocketConnection());
      } catch (socketError) {
        console.warn('WebSocket initialization failed, but game was created:', socketError);
      }
      return res;
    } else {
      throw new Error(res.error || res.message || "Failed to create game"); 
    }
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('❌ Create game error:', message);
    dispatch(createGameFailure(message));
    dispatch(showNotification({ type: "error", message }));
    throw err;
  }
};

// GET GAMES BY TEAM
export const getGameByTeam = (teamId, queryParams = {}) => async (dispatch) => {
  try {
    dispatch(getGamesByTeamStart());
    dispatch(clearError());

    const res = await getGamesByTeamAPI(teamId, queryParams);
    if (res.success) {
      dispatch(getGamesByTeamSuccess(res.data));
      return res.data;
    } else {
      throw new Error(res.message || "Failed to fetch team games");
    }
  } catch (err) {
    const message = getErrorMessage(err);
    dispatch(getGamesByTeamFailure(message));

    // Don't show notification for 404 - it's expected if no games exist
    if (!message.toLowerCase().includes("not found")) {
      dispatch(showNotification({ type: "error", message }));
    }

    throw err;
  }
};

// GET GAME BY ID
export const getGameById = (gameId) => async (dispatch) => {
  try {
    dispatch(getGameByIdStart());
    dispatch(clearError());
    dispatch(clearCurrentGame()); 

    const res = await getGameByIdAPI(gameId);

    if (res.success) {
      dispatch(getGameByIdSuccess(res.data));

      if (res.data?.base?.status === "live") {
        dispatch(joinGameForLiveUpdates(gameId));
      }

      return res.data;
    } else {
      throw new Error(res.message || "Failed to fetch game");
    }
  } catch (err) {
    const message = getErrorMessage(err);
    dispatch(getGameByIdFailure(message));
    dispatch(showNotification({ type: "error", message }));
    throw err;
  }
};

// START GAME
export const startGame = (gameId) => async (dispatch) => {
  try {
    dispatch(startGameStart());
    dispatch(clearError());

    console.log('🚀 Starting game:', gameId);

    dispatch(
      showNotification({
        type: "info",
        message: "Starting game...",
      })
    );

    const res = await startGameAPI(gameId);

    console.log('🚀 Start game response:', res);

    if (res.success) {
      dispatch(startGameSuccess(res.data));
      dispatch(
        showNotification({
          type: "success",
          message: res.message || "Game started successfully",
        })
      );

      try {
        dispatch(joinGameForLiveUpdates(gameId));
      } catch (socketError) {
        console.warn('Failed to join game room, but game was started:', socketError);
      }

      return res; 
    } else {
      throw new Error(res.error || res.message || "Failed to start game");
    }
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('❌ Start game error:', message);
    dispatch(startGameFailure(message));
    dispatch(showNotification({ type: "error", message }));
    throw err;
  }
};

// UPDATE GAME PROGRESS
export const updateGameProgress = (gameId, payload) => async (dispatch) => {
  try {
    dispatch(updateGameProgressStart());
    const res = await updateGameProgressAPI(gameId, payload);
    if (res.success) {
      dispatch(updateGameProgressSuccess(res.data));
      return res.data;
    } else {
      throw new Error(res.message || "Failed to update game progress");
    }
  } catch (err) {
    const message = getErrorMessage(err);
    dispatch(updateGameProgressFailure(message));
    console.warn("Game progress update failed:", message);
    throw err;
  }
};

// ADD GAME EVENT
export const addGameEvent = (gameId, eventPayload) => async (dispatch) => {
  try {
    dispatch(addGameEventStart());
    const res = await addGameEventAPI(gameId, eventPayload);

    if (res.success) {
      dispatch(addGameEventSuccess(res.data));

      const importantEvents = ["goal", "home_run", "point_3", "wicket"];
      if (importantEvents.includes(eventPayload.eventType)) {
        dispatch(
          showNotification({
            type: "success",
            message: res.message || "Event recorded successfully",
          })
        );
      }
      return res.data;
    } else {
      throw new Error(res.message || "Failed to add game event");
    }
  } catch (err) {
    const message = getErrorMessage(err);
    dispatch(addGameEventFailure(message));
    dispatch(showNotification({ type: "error", message }));
    throw err;
  }
};

// END GAME
export const endGame = (gameId, payload) => async (dispatch) => {
  try {
    dispatch(endGameStart());
    dispatch(clearError());

    const res = await endGameAPI(gameId, payload);

    if (res.success) {
      dispatch(endGameSuccess(res.data));
      dispatch(
        showNotification({
          type: "success",
          message: res.message || "Game ended successfully",
        })
      );

      dispatch(leaveGameRoomUpdates(gameId));
      return res.data;
    } else {
      throw new Error(res.message || "Failed to end game");
    }
  } catch (err) {
    const message = getErrorMessage(err);
    dispatch(endGameFailure(message));
    dispatch(showNotification({ type: "error", message }));
    throw err;
  }
};

// GET GAME EVENTS
export const getGameEvents = (gameId) => async (dispatch) => {
  try {
    dispatch(getGameEventsStart());
    dispatch(clearError());

    const res = await getGameEventsAPI(gameId);

    if (res.success) {
      dispatch(getGameEventsSuccess(res.data));
      return res.data;
    } else {
      throw new Error(res.message || "Failed to fetch game events");
    }
  } catch (err) {
    const message = getErrorMessage(err);
    dispatch(getGameEventsFailure(message));
    console.warn("Failed to fetch game events:", message);
    throw err;
  }
};

// DELETE GAME
export const deleteGame = (gameId) => async (dispatch) => {
  try {
    dispatch(deleteGameStart());
    dispatch(clearError());
    const res = await deleteGameAPI(gameId);

    if (res.success) {
      dispatch(deleteGameSuccess(gameId));
      dispatch(
        showNotification({
          type: "success",
          message: res.message || "Game deleted successfully",
        })
      );
      dispatch(leaveGameRoomUpdates(gameId));
      return res;
    } else {
      throw new Error(res.message || "Failed to delete game");
    }
  } catch (err) {
    const message = getErrorMessage(err);
    dispatch(deleteGameFailure(message));
    dispatch(showNotification({ type: "error", message }));
    throw err;
  }
};

// CLEAR GAME DATA
export const clearGameData = () => async (dispatch) => {
  dispatch(clearCurrentGame());
  dispatch(clearError());
};

// REFRESH GAME DATA 
export const refreshCurrentGame = (gameId) => async (dispatch) => {
  if (gameId) {
    return dispatch(getGameById(gameId));
  }
};