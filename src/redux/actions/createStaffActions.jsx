
import { createStaffAPI, deleteStaffAPI, getStaffByAPI, updateStaffAPI } from "../../services/createStaff-api";
import { createStaffFailure, createStaffStart, createStaffSuccess, deleteStaffFailure, deleteStaffStart, deleteStaffSuccess, getStaffFailure, getStaffStart, getStaffSuccess, updateStaffFailure, updateStaffStart, updateStaffSuccess } from "../slices/createStaffSlice";
import { showNotification } from "../slices/uiSlice";

const getErrorMessage = (error) => {
  if (error.message) return error.message;
  if (error.response?.data?.message) return error.response.data.message;
  return "Something went wrong. Please try again.";
};

export const createStaff = (staffData) => async (dispatch) => {
  try {
    dispatch(createStaffStart());
    const response = await createStaffAPI(staffData);
    dispatch(createStaffSuccess(response.data));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "staff created successfully!",
      })
    );

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(createStaffFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

export const getStaffByTeam = (teamId) => async (dispatch) => {
  try {
    dispatch(getStaffStart());
    const response = await getStaffByAPI(teamId);
    dispatch(getStaffSuccess(response.data));
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(getStaffFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

export const updateStaff = (staffId, updateData) => async (dispatch) => {
  try {
    dispatch(updateStaffStart());
    const response = await updateStaffAPI(staffId, updateData);
    dispatch(updateStaffSuccess(response.data));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "staff updated successfully!",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(updateStaffFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

export const deleteStaff = (staffId) => async (dispatch) => {
  try {
    dispatch(deleteStaffStart());
    const response = await deleteStaffAPI(staffId);
    dispatch(deleteStaffSuccess(staffId));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "staff deleted successfully!",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(deleteStaffFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};
