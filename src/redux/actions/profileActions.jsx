import {
  getProfileAPI,
  updateProfileAPI,
  updateProfileFieldAPI,
  updatePhoneAPI,
  updateLocationAPI,
  updateAgeAPI,
  updateFullnameAPI,
  uploadProfilePictureAPI,
  deleteProfilePictureAPI,
} from "../../services/Profile-api";
import {
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
  uploadProfilePictureSuccess,
  uploadProfilePictureFailure,
  uploadProfilePictureProgress,
  deleteProfilePictureStart,
  deleteProfilePictureSuccess,
  deleteProfilePictureFailure,
  clearUploadState,
  clearFieldUpdateState,
  clearError,
  updatePhone,
  updateLocation,
  updateAge,
  updateFullname,
} from "../slices/profileSlice";
import { showNotification } from "../slices/uiSlice";

// Helper to extract error message
const getErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return "Something went wrong. Please try again.";
};

// Get user profile
export const getProfile = () => async (dispatch) => {
  try {
    dispatch(getProfileStart());
    const response = await getProfileAPI();
    dispatch(getProfileSuccess(response.data));
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(getProfileFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Update profile (all fields)
export const updateProfile = (profileData) => async (dispatch) => {
  try {
    dispatch(updateProfileStart());
    const response = await updateProfileAPI(profileData);
    dispatch(updateProfileSuccess(response.data));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Profile updated successfully",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(updateProfileFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Update specific profile field
export const updateProfileField = (field, value) => async (dispatch) => {
  try {
    dispatch(updateProfileFieldStart());
    
    // Optimistic update for better UX
    switch (field) {
      case 'phone':
        dispatch(updatePhone(value));
        break;
      case 'location':
        dispatch(updateLocation(value));
        break;
      case 'age':
        dispatch(updateAge(value));
        break;
      case 'fullname':
        dispatch(updateFullname(value));
        break;
      default:
        // For other fields, use generic update
        break;
    }

    const response = await updateProfileFieldAPI(field, value);
    dispatch(updateProfileFieldSuccess(response.data));
    
    dispatch(
      showNotification({
        type: "success",
        message: response.message || `${field} updated successfully`,
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(updateProfileFieldFailure(errorMessage));
    dispatch(clearFieldUpdateState());
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Convenience functions for specific field updates
export const updateUserPhone = (phone) => async (dispatch) => {
  return dispatch(updateProfileField('phone', phone));
};

export const updateUserLocation = (location) => async (dispatch) => {
  return dispatch(updateProfileField('location', location));
};

export const updateUserAge = (age) => async (dispatch) => {
  return dispatch(updateProfileField('age', age));
};

export const updateUserFullname = (fullname) => async (dispatch) => {
  return dispatch(updateProfileField('fullname', fullname));
};

// Upload profile picture
export const uploadProfilePicture = (file) => async (dispatch) => {
  try {
    dispatch(uploadProfilePictureStart());

    // Simulate upload progress (you can replace this with real progress tracking)
    const simulateProgress = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 90) {
          clearInterval(interval);
          dispatch(uploadProfilePictureProgress(90));
        } else {
          dispatch(uploadProfilePictureProgress(Math.floor(progress)));
        }
      }, 200);
      return interval;
    };

    const progressInterval = simulateProgress();

    const response = await uploadProfilePictureAPI(file);
    
    // Clear progress simulation
    clearInterval(progressInterval);
    dispatch(uploadProfilePictureProgress(100));
    
    dispatch(uploadProfilePictureSuccess(response.data));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Profile picture uploaded successfully",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(uploadProfilePictureFailure(errorMessage));
    dispatch(clearUploadState());
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Delete profile picture
export const deleteProfilePicture = () => async (dispatch) => {
  try {
    dispatch(deleteProfilePictureStart());
    const response = await deleteProfilePictureAPI();
    dispatch(deleteProfilePictureSuccess());
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Profile picture removed successfully",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(deleteProfilePictureFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Clear upload state
export const clearProfileUploadState = () => async (dispatch) => {
  dispatch(clearUploadState());
};

// Clear field update state
export const clearProfileFieldUpdateState = () => async (dispatch) => {
  dispatch(clearFieldUpdateState());
};

// Clear profile error
export const clearProfileError = () => async (dispatch) => {
  dispatch(clearError());
};