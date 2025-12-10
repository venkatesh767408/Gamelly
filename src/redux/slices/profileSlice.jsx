import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  uploadProgress: 0,
  isUploading: false,
  isUpdatingField: false, 
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Start loading
    startLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // Get profile actions
    getProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    getProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update profile actions
    updateProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.user = { ...state.user, ...action.payload };
      state.error = null;
    },
    updateProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update profile field actions (for single field updates)
    updateProfileFieldStart: (state) => {
      state.isUpdatingField = true;
      state.error = null;
    },
    updateProfileFieldSuccess: (state, action) => {
      state.isUpdatingField = false;
      state.user = { ...state.user, ...action.payload };
      state.error = null;
    },
    updateProfileFieldFailure: (state, action) => {
      state.isUpdatingField = false;
      state.error = action.payload;
    },

    // Upload profile picture actions
    uploadProfilePictureStart: (state) => {
      state.isUploading = true;
      state.uploadProgress = 0;
      state.error = null;
    },
    uploadProfilePictureProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    uploadProfilePictureSuccess: (state, action) => {
      state.isUploading = false;
      state.uploadProgress = 100;
      state.user = { 
        ...state.user, 
        profilePicture: action.payload.profilePicture 
      };
      state.error = null;
    },
    uploadProfilePictureFailure: (state, action) => {
      state.isUploading = false;
      state.uploadProgress = 0;
      state.error = action.payload;
    },

    // Delete profile picture actions
    deleteProfilePictureStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteProfilePictureSuccess: (state) => {
      state.isLoading = false;
      state.user = { 
        ...state.user, 
        profilePicture: null 
      };
      state.error = null;
    },
    deleteProfilePictureFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear profile picture upload state
    clearUploadState: (state) => {
      state.isUploading = false;
      state.uploadProgress = 0;
      state.error = null;
    },

    // Clear field update state
    clearFieldUpdateState: (state) => {
      state.isUpdatingField = false;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset profile state
    resetProfile: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.uploadProgress = 0;
      state.isUploading = false;
      state.isUpdatingField = false;
    },

    // Sync with auth (when user logs in, we can populate profile)
    syncWithAuth: (state, action) => {
      state.user = action.payload;
    },

    // Update user field locally (optimistic updates)
    updateUserField: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Specific field updates (optimistic)
    updatePhone: (state, action) => {
      if (state.user) {
        state.user.phone = action.payload;
      }
    },
    updateLocation: (state, action) => {
      if (state.user) {
        state.user.location = action.payload;
      }
    },
    updateAge: (state, action) => {
      if (state.user) {
        state.user.age = action.payload;
      }
    },
    updateFullname: (state, action) => {
      if (state.user) {
        state.user.fullname = action.payload;
      }
    },
  },
});

export const {
  startLoading,
  getProfileStart,
  getProfileSuccess,
  getProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  updateProfileFieldStart,
  updateProfileFieldSuccess,
  updateProfileFieldFailure,
  uploadProfilePictureStart,
  uploadProfilePictureProgress,
  uploadProfilePictureSuccess,
  uploadProfilePictureFailure,
  deleteProfilePictureStart,
  deleteProfilePictureSuccess,
  deleteProfilePictureFailure,
  clearUploadState,
  clearFieldUpdateState,
  clearError,
  resetProfile,
  syncWithAuth,
  updateUserField,
  updatePhone,
  updateLocation,
  updateAge,
  updateFullname,
} = profileSlice.actions;

export default profileSlice.reducer;