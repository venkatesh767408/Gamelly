import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staff: [],
  staffMember: null,
  createdStaff: null,
  isLoading: false,
  error: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    // ----- Create staff member -----
    createStaffStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createStaffSuccess: (state, action) => {
      state.isLoading = false;
      state.createdStaff = action.payload;
      state.staff.push(action.payload);
      state.error = null;
    },
    createStaffFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ----- Get All staff members -----
    getStaffStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getStaffSuccess: (state, action) => {
      state.isLoading = false;
      state.staff = action.payload;
      state.error = null;
    },
    getStaffFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ----- Update staff -----
    updateStaffStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateStaffSuccess: (state, action) => {
      state.isLoading = false;
      const updatedStaff = action.payload;

      const index = state.staff.findIndex(
        (s) => s.id === updatedStaff.id || s._id === updatedStaff.id
      );

      if (index !== -1) {
        state.staff[index] = updatedStaff;
      }

      if (
        state.staffMember &&
        (state.staffMember.id === updatedStaff.id ||
          state.staffMember._id === updatedStaff.id)
      ) {
        state.staffMember = updatedStaff;
      }

      state.error = null;
    },
    updateStaffFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ----- Delete staff member -----
    deleteStaffStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteStaffSuccess: (state, action) => {
      state.isLoading = false;
      const deletedStaffId = action.payload;

      state.staff = state.staff.filter(
        (s) => s.id !== deletedStaffId && s._id !== deletedStaffId
      );

      if (
        state.staffMember &&
        (state.staffMember.id === deletedStaffId ||
          state.staffMember._id === deletedStaffId)
      ) {
        state.staffMember = null;
      }

      state.error = null;
    },
    deleteStaffFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ----- Utility Clearers -----
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentStaff: (state) => {
      state.staffMember = null;
    },
    clearCreatedStaff: (state) => {
      state.createdStaff = null;
    },
  },
});

export const {
  createStaffStart,
  createStaffSuccess,
  createStaffFailure,
  getStaffStart,
  getStaffSuccess,
  getStaffFailure,
  updateStaffStart,
  updateStaffSuccess,
  updateStaffFailure,
  deleteStaffStart,
  deleteStaffSuccess,
  deleteStaffFailure,
  clearError,
  clearCurrentStaff,
  clearCreatedStaff,
} = staffSlice.actions;

export default staffSlice.reducer;