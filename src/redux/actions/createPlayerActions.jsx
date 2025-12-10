import {
  createPlayerAPI,
  deletePlayerAPI,
  getPlayersByAPI,
  updatePlayerAPI,
} from "../../services/createPlayer-api";
import {
  createPlayerFailure,
  createPlayerStart,
  createPlayerSuccess,
  deletePlayerFailure,
  deletePlayerStart,
  deletePlayerSuccess,
  getPlayersFailure,
  getPlayersStart,
  getPlayersSuccess,
  updatePlayerFailure,
  updatePlayerStart,
  updatePlayerSuccess,
} from "../slices/createPlayerSlice";
import { showNotification } from "../slices/uiSlice";

const getErrorMessage = (error) => {
  if (error.message) return error.message;
  if (error.response?.data?.message) return error.response.data.message;
  return "Something went wrong. Please try again.";
};

export const createPlayer = (playerData) => async (dispatch) => {
  try {
    dispatch(createPlayerStart());
    const response = await createPlayerAPI(playerData);
    dispatch(createPlayerSuccess(response.data));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Player created successfully!",
      })
    );

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(createPlayerFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

export const getPlayersByTeam = (teamId) => async (dispatch) => {
  try {
    dispatch(getPlayersStart());
    const response = await getPlayersByAPI(teamId);
    dispatch(getPlayersSuccess(response.data));
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(getPlayersFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

export const updatePlayer = (playerId, updateData) => async (dispatch) => {
  try {
    dispatch(updatePlayerStart());
    const response = await updatePlayerAPI(playerId, updateData);
    dispatch(updatePlayerSuccess(response.data));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Player updated successfully!",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(updatePlayerFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

export const deletePlayer = (playerId) => async (dispatch) => {
  try {
    dispatch(deletePlayerStart());
    const response = await deletePlayerAPI(playerId);
    dispatch(deletePlayerSuccess(playerId));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Player deleted successfully!",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(deletePlayerFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};
