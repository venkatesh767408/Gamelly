import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSharedGameAPI,
  findSharedGameAPI,
} from "../services/gameService-api";
import {
  addGameEvent,
  createGame,
  deleteGame,
  endGame,
  getGameById,
  getGameByTeam,
  getGameEvents,
  initializeGameSocketConnection,
  joinGameForLiveUpdates,
  leaveGameRoomUpdates,
  refreshCurrentGame,
  startGame,
  updateGameProgress,
} from "../redux/actions/gameActions";
import {
    clearAllGames,
    clearCreatedGame,
    clearCurrentGame,
    clearError,
  clearGameData,
  clearUpdatedGame,
  gameEnded,
  gameEventAdded,
  gameStateSynced,
  gameUpdated,
  scoreUpdated,
  userJoinedGame,
  userLeftGame,
} from "../redux/slices/gameSlice";

export const useGame = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);



const findOrCreateGame = useCallback(
  async (teamId, opponentTeamId, sport, venue = "Home stadium") => {
    try {
  
      const findResponse = await findSharedGameAPI(teamId, opponentTeamId, sport);

      if (findResponse?.success && findResponse.data) {
        return findResponse.data.base._id; // Fixed path
      }
    } catch (err) {
      console.log("🔍 No active game found or API error:", err.message);

      // Handle specific error cases
      if (err.message?.includes("Game already exists") || err.response?.data?.error?.includes("Game already exists")) {
        const existingGameId = err.response?.data?.existingGameId;
        if (existingGameId) {
          return existingGameId;
        }
      }
    }

    try {
      const newGamePayload = {
        sport,
        teamId,
        opponentTeamId,
        venue,
        startTime: new Date().toISOString(), 
      };

      const createResponse = await createSharedGameAPI(newGamePayload);
      if (createResponse?.success && createResponse.data?.baseGame?._id) {
        console.log("✅ Created new shared game:", createResponse.data.baseGame._id);
        return createResponse.data.baseGame._id;
      } else {
        throw new Error("Failed to create game: Invalid response");
      }
    } catch (error) {
      console.error("❌ Failed to create shared game:", error);
      
      // Handle game already exists error in creation
      if (error.message?.includes("Game already exists") || error.response?.data?.error?.includes("Game already exists")) {
        const existingGameId = error.response?.data?.existingGameId;
        if (existingGameId) {
          return existingGameId;
        }
      }
      
      throw error;
    }
  },
  []
);

  //  CRUD

  const create = useCallback(
    (payload) => dispatch(createGame(payload)),
    [dispatch]
  );

  const remove = useCallback(
    (gameId) => dispatch(deleteGame(gameId)),
    [dispatch]
  );

  const fetchById = useCallback(
    (gameId) => dispatch(getGameById(gameId)),
    [dispatch]
  );

  const fetchByTeam = useCallback(
    (teamId, queryParams = {}) => dispatch(getGameByTeam(teamId, queryParams)),
    [dispatch]
  );

  //  LIVE
  const begin = useCallback(
    (gameId) => dispatch(startGame(gameId)),
    [dispatch]
  );

  const updateProgress = useCallback(
    (gameId, payload) => dispatch(updateGameProgress(gameId, payload)),
    [dispatch]
  );

  const addEvent = useCallback(
    (gameId, eventPayload) => dispatch(addGameEvent(gameId, eventPayload)),
    [dispatch]
  );

  const finish = useCallback(
    (gameId, payload) => dispatch(endGame(gameId, payload)),
    [dispatch]
  );

  const fetchEvents = useCallback(
    (gameId) => dispatch(getGameEvents(gameId)),
    [dispatch]
  );

  //  WEB SOCKET
  const initializeSocket = useCallback(
    () => dispatch(initializeGameSocketConnection()),
    [dispatch]
  );

  const joinLive = useCallback(
    (gameId) => dispatch(joinGameForLiveUpdates(gameId)),
    [dispatch]
  );

  const leaveLive = useCallback(
    (gameId) => dispatch(leaveGameRoomUpdates(gameId)),
    [dispatch]
  );

  const refreshGame = useCallback(
    (gameId) => dispatch(refreshCurrentGame(gameId)),
    [dispatch]
  );

  // Real-time
  const syncGameState = useCallback(
    (gameData) => dispatch(gameStateSynced(gameData)),
    [dispatch]
  );

  const handleScoreUpdate = useCallback(
    (data) => dispatch(scoreUpdated(data)),
    [dispatch]
  );

  const handleGameUpdate = useCallback(
    (data) => dispatch(gameUpdated(data)),
    [dispatch]
  );

  const handleGameEventData = useCallback(
    (data) => dispatch(gameEventAdded(data)),
    [dispatch]
  );

  const handleUserJoined = useCallback(
    (data) => dispatch(userJoinedGame(data)),
    [dispatch]
  );

  const handleUserLeft = useCallback(
    (data) => dispatch(userLeftGame(data)),
    [dispatch]
  );

  const handleGameEnded = useCallback(
    (data) => dispatch(gameEnded(data)),
    [dispatch]
  );


    //  CLEAR
  const clearGameError = useCallback(() => dispatch(clearError()), [dispatch]);
  const clearCurrent = useCallback(() => dispatch(clearCurrentGame()), [dispatch]);
  const clearCreated = useCallback(() => dispatch(clearCreatedGame()), [dispatch]);
  const clearUpdated = useCallback(() => dispatch(clearUpdatedGame()), [dispatch]);
  const clearAll = useCallback(() => dispatch(clearAllGames()), [dispatch]);
  const clearAllData = useCallback(() => dispatch(clearGameData()), [dispatch]);

  //  GETTERS
  const currentGameStatus = gameState.currentGame?.base?.status || "scheduled";
  const isGameLive = currentGameStatus === "live";


  
  const isInLiveGame = (gameId) =>
    gameState.liveGames?.includes(gameId) ?? false;

  const liveGamesCount = gameState.liveGames?.length ?? 0;

  const getCachedGame = (gameId) =>
    gameState.games?.find((g) => g._id === gameId) ??
    gameState.teamGames?.find((g) => g._id === gameId);

  // ✅ Workflows
  const startAndJoinGame = useCallback(
    async (gameId) => {
      await begin(gameId);
      joinLive(gameId);
    },
    [begin, joinLive]
  );

  const startSharedGame = useCallback(
    async (teamId, opponentTeamId, sport, venue = "Home Stadium") => {
      const gameId = await findOrCreateGame(teamId, opponentTeamId, sport, venue);
      await startAndJoinGame(gameId);
      return gameId;
    },
    [findOrCreateGame, startAndJoinGame]
  );

  const loadGameWithRealtime = useCallback(
    async (gameId) => {
      if (!gameState.socketConnected) await initializeSocket();
      const game = await fetchById(gameId);
      if (game?.base?.status === "live") joinLive(gameId);
      return game;
    },
    [fetchById, joinLive, initializeSocket, gameState.socketConnected]
  );


   return {
    ...gameState,

    // CRUD
    createGame: create,
    deleteGame: remove,
    getGameById: fetchById,
    getGamesByTeam: fetchByTeam,

    // Live
    startGame: begin,
    updateGameProgress,
    updateProgress,
    addGameEvent: addEvent,
    endGame: finish,
    getGameEvents: fetchEvents,

    // WS
    initializeGameSocket: initializeSocket,
    joinLiveGame: joinLive,
    leaveLiveGame: leaveLive,
    refreshGame,

    // Shared game
    findOrCreateGame,
    startSharedGame,

    // Real-time handlers
    syncGameState,
    handleScoreUpdate,
    handleGameUpdate,
    handleGameEvent: handleGameEventData,
    handleUserJoined,
    handleUserLeft,
    handleGameEnded,

    // Workflows
    startAndJoinGame,
    loadGameWithRealtime,
    // addEventAndRefresh,

    // Clears
    clearError: clearGameError,
    clearCurrentGame: clearCurrent,
    clearCreatedGame: clearCreated,
    clearUpdatedGame: clearUpdated,
    clearAllGames: clearAll,
    clearAllGameData: clearAllData,

    // helpers
    currentGameStatus,
    isGameLive,
    isInLiveGame,
    liveGamesCount,
    getCachedGame
  };

};
