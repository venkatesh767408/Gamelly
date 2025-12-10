import {
  createScheduleAPI,
  deleteScheduleAPI,
  getSchedulesByTeamAPI,
  updateScheduleAPI,
} from "../../services/schedule-api";
import {
  createScheduleFailure,
  createScheduleStart,
  createScheduleSuccess,
  deleteScheduleFailure,
  deleteScheduleStart,
  deleteScheduleSuccess,
  getSchedulesByTeamFailure,
  getSchedulesByTeamStart,
  getSchedulesByTeamSuccess,
  updateScheduleFailure,
  updateScheduleStart,
  updateScheduleSuccess,
} from "../slices/scheduleSlice";
import { showNotification } from "../slices/uiSlice";

const getErrorMessage = (error) => {
  if (error.message) return error.message;
  if (error.response?.data?.message) return error.response.data.message;
  return "Something went wrong. Please try again.";
};

export const createSchedule = (scheduleData) => async (dispatch) => {
  try {
    dispatch(createScheduleStart());
    const response = await createScheduleAPI(scheduleData);

    dispatch(createScheduleSuccess(response.data));

    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Schedule created successfully!",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(createScheduleFailure(errorMessage));

    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );

    throw error;
  }
};

export const getSchedulesByTeam = (teamId) => async (dispatch) => {
  try {
    dispatch(getSchedulesByTeamStart());
    const response = await getSchedulesByTeamAPI(teamId);
 console.log('✅ Full API response:', response);
    console.log('✅ Schedules data:', response.data); 

    const schedulesData = response.data || [];
    dispatch(getSchedulesByTeamSuccess(schedulesData));

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(getSchedulesByTeamFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

export const updateSchedule = (scheduleId, updateData) => async (dispatch) => {
  try {
    dispatch(updateScheduleStart());
    const response = await updateScheduleAPI(scheduleId, updateData);

    dispatch(updateScheduleSuccess(response.data));

    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Schedule updated successfully!",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(updateScheduleFailure(errorMessage));

    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );

    throw error;
  }
};

export const deleteSchedule = (scheduleId) => async (dispatch) => {
  try {
    dispatch(deleteScheduleStart());
    const response = await deleteScheduleAPI(scheduleId);

    dispatch(deleteScheduleSuccess(scheduleId));

    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Schedule deleted successfully!",
      })
    );

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(deleteScheduleFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );

    throw error;
  }
};
