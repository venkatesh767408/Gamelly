import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [],
  teamGames: [],
  currentGame: null,
  gameEvents: [],
  createdGame: null,
  updatedGame: null,
  endedGame: null,
  isLoading: false,
  error: null,

  liveGames: [],
  socketConnected: false,
};

const updateBaseGameInList = (list, updatedGame) =>
  list.map((game) => (game._id === updatedGame._id ? updatedGame : game));

const safePushEvent = (currentGame, event) => {
  if (currentGame?.sport?.events && Array.isArray(currentGame.sport.events)) {
    currentGame.sport.events.push(event);
  } else if (currentGame?.sport) {
    currentGame.sport.events = [event];
  }
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // CREATE GAME

    createGameStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createGameSuccess: (state, action) => {
      state.isLoading = false;
      state.createdGame = action.payload;
      if (action.payload?.base) {
        state.games.push(action.payload.base);
      }
      state.error = null;
    },

    createGameFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET GAMES BY TEAM

    getGamesByTeamStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    getGamesByTeamSuccess: (state, action) => {
      state.isLoading = false;
      state.teamGames = action.payload;
      state.error = null;
    },
    getGamesByTeamFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET GAME BY ID

    getGameByIdStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getGameByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.currentGame = action.payload;
      state.error = null;
    },

    getGameByIdFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // START GAME

    startGameStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    startGameSuccess: (state, action) => {
      state.isLoading = false;
      const updatedBaseGame = action.payload;

      state.games = updateBaseGameInList(state.games, updatedBaseGame);
      state.teamGames = updateBaseGameInList(state.teamGames, updatedBaseGame);

      if (state.currentGame?.base?._id === updatedBaseGame._id) {
        state.currentGame.base = updatedBaseGame;
      }

      if (!state.liveGames.includes(updatedBaseGame._id)) {
        state.liveGames.push(updatedBaseGame._id);
      }

      state.error = null;
    },

    startGameFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // UPDATE GAME PROGRESS

    updateGameProgressStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    updateGameProgressSuccess: (state, action) => {
      state.isLoading = false;
      const updatedSportGame = action.payload;

      if (state.currentGame) {
        state.currentGame.sport = updatedSportGame;
      }

      state.updatedGame = updatedSportGame;
      state.error = null;
    },

    updateGameProgressFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ADD EVENT

    addGameEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

// In your gameSlice.js, update the addGameEventSuccess reducer:

addGameEventSuccess: (state, action) => {
  state.isLoading = false;

  const { event, game } = action.payload;

  // Safety check
  if (!state.currentGame) return;

  // Update sport game data
  if (game) {
    state.currentGame.sport = {
      ...state.currentGame.sport,
      ...game,
    };
  }

  if (!state.currentGame.sport.events) {
    state.currentGame.sport.events = [];
  }
  
  // Add new event to the beginning (most recent first)
  state.currentGame.sport.events.unshift(event);

  // Update score if it changed
  if (game?.score) {
    state.currentGame.sport.score = game.score;
  }

  state.updatedGame = {
    ...state.updatedGame,
    ...game,
  };

  state.error = null;
},

    addGameEventFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // END GAME
    endGameStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    endGameSuccess: (state, action) => {
      state.isLoading = false;
      const fullGameData = action.payload;

      if (fullGameData?.base) {
        state.games = updateBaseGameInList(state.games, fullGameData.base);
        state.teamGames = updateBaseGameInList(
          state.teamGames,
          fullGameData.base
        );
      }

      if (state.currentGame?.base?._id === fullGameData?.base?._id) {
        state.currentGame = fullGameData;
      }

      state.liveGames = state.liveGames.filter(
        (id) => id !== fullGameData?.base?._id
      );

      state.endedGame = fullGameData;
      state.error = null;
    },

    endGameFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET EVENTS
    getGameEventsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getGameEventsSuccess: (state, action) => {
      state.isLoading = false;
      state.gameEvents = action.payload?.events || [];
      state.error = null;
    },
    getGameEventsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // DELETE GAME
    deleteGameStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteGameSuccess: (state, action) => {
      state.isLoading = false;
      const deletedGameId = action.payload;

      // Remove from all game lists
      state.games = state.games.filter((game) => game._id !== deletedGameId);
      state.teamGames = state.teamGames.filter(
        (game) => game._id !== deletedGameId
      );

      // Clear current game if it's the deleted one
      if (state.currentGame?.base?._id === deletedGameId) {
        state.currentGame = null;
      }

      // Remove from live games
      state.liveGames = state.liveGames.filter((id) => id !== deletedGameId);

      state.error = null;
    },
    deleteGameFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // REAL-TIME SYNC ACTIONS
    gameStateSynced: (state, action) => {
      state.currentGame = action.payload;
    },

    scoreUpdated: (state, action) => {
      const { gameId, homeScore, awayScore } = action.payload;
      console.log("🔄 Redux: Processing complete score update", {
        gameId,
        homeScore,
        awayScore,
      });

      if (state.currentGame?.base?._id === gameId && state.currentGame.sport) {
        console.log("✅ Redux: Updating current game scores");
        state.currentGame.sport.score = {
          home: homeScore,
          away: awayScore,
        };
      }

      // Also update in games list
      state.games = state.games.map((game) =>
        game._id === gameId
          ? {
              ...game,
              score: {
                home: homeScore,
                away: awayScore,
              },
            }
          : game
      );
    },

    gameUpdated: (state, action) => {
      console.log("🔄 Redux: Processing game update", action.payload);
      const { gameId, type, ...updateData } = action.payload;

      if (state.currentGame?.base?._id === gameId) {
        if (type === "event_added" && updateData.game) {
          state.currentGame = updateData.game;
        } else if (type === "progress_updated") {
          state.currentGame.sport = {
            ...state.currentGame.sport,
            ...updateData.progress,
          };
        } else if (type === "game_started") {
          state.currentGame.base.status = "live";
          state.currentGame.base.startTime = updateData.startTime;
        }
      }
    },

    gameEventAdded: (state, action) => {
      console.log("🔄 Redux: Processing game event", action.payload);
      const { gameId, event } = action.payload;

      // Add event to current game if it matches
      if (state.currentGame?.base?._id === gameId) {
        if (!state.currentGame.sport.events) {
          state.currentGame.sport.events = [];
        }
        state.currentGame.sport.events.push(event);
      }
    },

    userJoinedGame: (state, action) => {
      console.log("👤 User joined game:", action.payload);
      // You can store active users info if needed
    },

    userLeftGame: (state, action) => {
      console.log("👤 User left game:", action.payload);
      // You can update active users info if needed
    },

    gameEnded: (state, action) => {
      const { gameId, result } = action.payload;
      console.log("🏁 Game ended:", { gameId, result });

      if (state.currentGame?.base?._id === gameId) {
        state.currentGame.base.status = "finished";
        state.currentGame.base.result = result;
        state.liveGames = state.liveGames.filter((id) => id !== gameId);
      }
    },

    //  WEB SOCKET CONNECTION STATUS
    wsConnected: (state) => {
      console.log("🔌 WebSocket connected in Redux");
      state.socketConnected = true;
    },

    wsDisconnected: (state) => {
      console.log("🔌 WebSocket disconnected in Redux");
      state.socketConnected = false;
    },

    //  Join/leave live game tracking
    joinLiveGame: (state, action) => {
      const gameId = action.payload;
      if (!state.liveGames.includes(gameId)) {
        state.liveGames.push(gameId);
      }
    },

    leaveLiveGame: (state, action) => {
      const gameId = action.payload;
      state.liveGames = state.liveGames.filter((id) => id !== gameId);
    },

    // CLEAR ACTIONS
    clearError: (state) => {
      state.error = null;
    },

    clearCurrentGame: (state) => {
      state.currentGame = null;
    },

    clearCreatedGame: (state) => {
      state.createdGame = null;
    },

    clearEndedGame: (state) => {
      state.endedGame = null;
    },

    clearUpdatedGame: (state) => {
      state.updatedGame = null;
    },

    clearAllGames: (state) => {
      state.games = [];
      state.teamGames = [];
      state.currentGame = null;
      state.liveGames = [];
    },

    clearGameData: (state) => {
      state.games = [];
      state.teamGames = [];
      state.currentGame = null;
      state.gameEvents = [];
      state.createdGame = null;
      state.updatedGame = null;
      state.endedGame = null;
      state.liveGames = [];
      state.error = null;
    },
  },
});

export const {
  startLoading,
  createGameStart,
  createGameSuccess,
  createGameFailure,
  getGamesByTeamStart,
  getGamesByTeamSuccess,
  getGamesByTeamFailure,
  getGameByIdStart,
  getGameByIdSuccess,
  getGameByIdFailure,
  startGameStart,
  startGameSuccess,
  startGameFailure,
  updateGameProgressStart,
  updateGameProgressSuccess,
  updateGameProgressFailure,
  addGameEventStart,
  addGameEventSuccess,
  addGameEventFailure,
  endGameStart,
  endGameSuccess,
  endGameFailure,
  getGameEventsStart,
  getGameEventsSuccess,
  getGameEventsFailure,
  deleteGameStart,
  deleteGameSuccess,
  deleteGameFailure,

  // Real-time sync actions
  gameStateSynced,
  scoreUpdated,
  gameUpdated,
  gameEventAdded,
  userJoinedGame,
  userLeftGame,
  gameEnded,

  //  WebSocket connection actions
  wsConnected,
  wsDisconnected,
  joinLiveGame,
  leaveLiveGame,

  // Clear actions
  clearError,
  clearCurrentGame,
  clearCreatedGame,
  clearEndedGame,
  clearUpdatedGame,
  clearAllGames,
  clearGameData,
} = gameSlice.actions;

export default gameSlice.reducer;
