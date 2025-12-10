import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [],
  opponents: [],
  team: null,
  specificOpponentTeam: null,
  createdTeam: null,
  isLoading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    createTeamStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

  createTeamSuccess: (state, action) => {
  state.isLoading = false;
  const newTeam = action.payload;
  
  // Ensure the team has an _id before adding to array
  if (!newTeam._id && !newTeam.id) {
    console.error('Team created without ID:', newTeam);
    state.error = 'Team created but no ID returned';
    return;
  }
  
  state.createdTeam = newTeam;
  
  // Add to teams array only if it has an ID
  if (newTeam._id || newTeam.id) {
    // Check if team already exists (in case of duplicate)
    const existingIndex = state.teams.findIndex(
      team => (team._id === newTeam._id) || (team.id === newTeam.id)
    );
    
    if (existingIndex === -1) {
      state.teams.push(newTeam);
    } else {
      // Update existing team
      state.teams[existingIndex] = newTeam;
    }
  }
  
  state.error = null;
},

    createTeamFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getTeamsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getTeamsSuccess: (state, action) => {
      state.isLoading = false;
      state.teams = action.payload;
      state.error = null;
    },
    getTeamsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getOpponentsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getOpponentsSuccess: (state, action) => {
      state.isLoading = false;
      state.opponents = action.payload;
      state.error = null;
    },
    getOpponentsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getSpecificOpponentTeamStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getSpecificOpponentTeamSuccess: (state, action) => {
      state.isLoading = false;
      state.specificOpponentTeam = action.payload;
      state.error = null;
    },
    getSpecificOpponentTeamFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    addOpponentStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addOpponentSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
    },

    addOpponentFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteOpponentStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteOpponentSuccess: (state, action) => {
      state.isLoading = false;
      const deleteOpponentId = action.payload;

      state.opponents = state.opponents.filter(
        (opponent) =>
          opponent.id !== deleteOpponentId && opponent._id !== deleteOpponentId
      );

      state.error = null;
    },

    deleteOpponentFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getTeamByIdStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    getTeamByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.team = action.payload;
      state.error = null;
    },
    getTeamByIdFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateTeamStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    updateTeamSuccess: (state, action) => {
      state.isLoading = false;
      const updatedTeam = action.payload;

      // Update in teams array if exists
      const index = state.teams.findIndex(
        (team) => team.id === updatedTeam.id || team._id === updatedTeam.id
      );
      if (index !== -1) {
        state.teams[index] = updatedTeam;
      }

      // Update current team if it's the one being viewed
      if (
        state.team &&
        (state.team.id === updatedTeam.id || state.team._id === updatedTeam.id)
      ) {
        state.team = updatedTeam;
      }

      state.error = null;
    },

    updateTeamFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteTeamStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteTeamSuccess: (state, action) => {
      state.isLoading = false;
      const deletedTeamId = action.payload;

      state.teams = state.teams.filter(
        (team) => team.id !== deletedTeamId && team._id !== deletedTeamId
      );

      if (
        state.team &&
        (state.team.id === deletedTeamId || state.team._id === deletedTeamId)
      ) {
        state.team = null;
      }
      state.error = null;
    },

    deleteTeamFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

     clearError: (state) => {
      state.error = null;
    },

    clearCurrentTeam:(state)=>{
       state.team = null;
    },
    clearCreatedTeam:(state)=>{
      state.createdTeam = null
    },
    clearOpponets:(state)=>{
      state.opponents = []
    }
  },
});


export const {
  startLoading,
  createTeamStart,
  createTeamSuccess,
  createTeamFailure,
  getTeamsStart,
  getTeamsSuccess,
  getTeamsFailure,
  getOpponentsStart,
  getOpponentsSuccess,
  getOpponentsFailure,
  getSpecificOpponentTeamStart,
  getSpecificOpponentTeamSuccess,
  getSpecificOpponentTeamFailure,
  addOpponentStart,
  addOpponentSuccess,
  addOpponentFailure,
  deleteOpponentStart,
  deleteOpponentSuccess,
  deleteOpponentFailure,
  getTeamByIdStart,
  getTeamByIdSuccess,
  getTeamByIdFailure,
  updateTeamStart,
  updateTeamSuccess,
  updateTeamFailure,
  deleteTeamStart,
  deleteTeamSuccess,
  deleteTeamFailure,
  clearError,
  clearCurrentTeam,
  clearCreatedTeam,
  clearOpponets
} = teamSlice.actions;

export default teamSlice.reducer;
