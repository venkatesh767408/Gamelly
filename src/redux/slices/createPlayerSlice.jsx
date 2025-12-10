import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players: [],
  player: null,
  createdPlayer: null,
  isLoading: false,
  error: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // ----- Create Player -----
    createPlayerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createPlayerSuccess: (state, action) => {
      state.isLoading = false;
      state.createdPlayer = action.payload;
      state.players.push(action.payload);
      state.error = null;
    },
    createPlayerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ----- Get All Players -----
    getPlayersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getPlayersSuccess: (state, action) => {
      state.isLoading = false;
      state.players = action.payload;
      state.error = null;
    },
    getPlayersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ----- Update Player -----
    updatePlayerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updatePlayerSuccess: (state, action) => {
      state.isLoading = false;
      const updatedPlayer = action.payload;


      const index = state.players.findIndex(
        (p) => p.id === updatedPlayer.id || p._id === updatedPlayer.id
      );

      if (index !== -1) {
        state.players[index] = updatedPlayer;
      }

      if (
        state.player &&
        (state.player.id === updatedPlayer.id ||
          state.player._id === updatedPlayer.id)
      ) {
        state.player = updatedPlayer;
      }

      state.error = null;
    },
    updatePlayerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ----- Delete Player -----
    deletePlayerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deletePlayerSuccess: (state, action) => {
      state.isLoading = false;
      const deletedPlayerId = action.payload;

    
      state.players = state.players.filter(
        (p) => p.id !== deletedPlayerId && p._id !== deletedPlayerId
      );

      if (
        state.player &&
        (state.player.id === deletedPlayerId ||
          state.player._id === deletedPlayerId)
      ) {
        state.player = null;
      }

      state.error = null;
    },
    deletePlayerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ----- Utility Clearers -----
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPlayer: (state) => {
      state.player = null;
    },
    clearCreatedPlayer: (state) => {
      state.createdPlayer = null;
    },
  },
});

export const {
  startLoading,
  createPlayerStart,
  createPlayerSuccess,
  createPlayerFailure,
  getPlayersStart,
  getPlayersSuccess,
  getPlayersFailure,
  updatePlayerStart,
  updatePlayerSuccess,
  updatePlayerFailure,
  deletePlayerStart,
  deletePlayerSuccess,
  deletePlayerFailure,
  clearError,
  clearCurrentPlayer,
  clearCreatedPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
