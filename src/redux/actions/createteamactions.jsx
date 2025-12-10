import {
  createTeamAPI,
  getTeamByIdAPI,
  getTeamsAPI,
  updateTeamAPI,
  deleteTeamAPI,
  getOpponentAPI,
  addOpponentAPI,
  deleteOpponentAPI,
  getSpecificOpponentTeamAPI,
} from "../../services/createteam-api";
import {
  createTeamFailure,
  createTeamStart,
  createTeamSuccess,
  getTeamByIdFailure,
  getTeamByIdStart,
  getTeamByIdSuccess,
  getTeamsFailure,
  getTeamsStart,
  getTeamsSuccess,
  updateTeamStart,
  updateTeamSuccess,
  updateTeamFailure,
  deleteTeamStart,
  deleteTeamSuccess,
  deleteTeamFailure,
  getOpponentsStart,
  getOpponentsSuccess,
  getOpponentsFailure,
  addOpponentStart,
  addOpponentSuccess,
  addOpponentFailure,
  deleteOpponentStart,
  deleteOpponentSuccess,
  deleteOpponentFailure,
  getSpecificOpponentTeamStart,
  getSpecificOpponentTeamSuccess,
  getSpecificOpponentTeamFailure,
} from "../slices/CreateTeamSlice";
import { showNotification } from "../slices/uiSlice";

const getErrorMessage = (error) => {
  if (error.message) return error.message;
  if (error.response?.data?.message) return error.response.data.message;
  return "Something went wrong. Please try again.";
};

export const createTeam = (teamData) => async (dispatch) => {
  try {
    dispatch(createTeamStart());

    const response = await createTeamAPI(teamData);
    
    // Check the actual response structure
    console.log('Create team response:', response);
    
    // The team data might be in response.data or directly in response
    const team = response.data || response;
    
    dispatch(createTeamSuccess(team));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Team created successfully!",
      })
    );

    return team; // Return the team data with _id
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(createTeamFailure(errorMessage));

    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );

    throw error;
  }
};

export const getTeams = () => async (dispatch) => {
  try {
    dispatch(getTeamsStart());
    const response = await getTeamsAPI();
    dispatch(getTeamsSuccess(response.data));
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(getTeamsFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );

    throw error;
  }
};

export const getTeamById = (teamId) => async (dispatch) => {
  try {
    dispatch(getTeamByIdStart());
    const response = await getTeamByIdAPI(teamId);
    dispatch(getTeamByIdSuccess(response.data));

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(getTeamByIdFailure(errorMessage));

    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

export const updateTeam = (teamId, updateData) => async (dispatch) => {
  try {
    dispatch(updateTeamStart());

  
    const response = await updateTeamAPI(teamId, updateData);
    dispatch(updateTeamSuccess(response.data));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Team updated successfully!",
      })
    );

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(updateTeamFailure(errorMessage));

    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );

    throw error;
  }
};

export const deleteTeam = (teamId) => async (dispatch) => {
  try {
    dispatch(deleteTeamStart());

    const response = await deleteTeamAPI(teamId);
    dispatch(deleteTeamSuccess(teamId));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Team deleted successfully!",
      })
    );

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(deleteTeamFailure(errorMessage));

    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );

    throw error;
  }
};


export const getOpponents=(currentTeamId=null)=>async(dispatch)=>{
  try {
    dispatch(getOpponentsStart())
    const response = await getOpponentAPI(currentTeamId)
    dispatch(getOpponentsSuccess(response.data))
    return response
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    dispatch(getOpponentsFailure(errorMessage))
    dispatch(
      showNotification({
        type:"error",
        message:errorMessage
      })
    )
    throw error
  }
}

export const getSpecificOpponentTeam=(opponentId)=>async(dispatch)=>{
  try {
    dispatch(getSpecificOpponentTeamStart())
    const response = await getSpecificOpponentTeamAPI(opponentId)

    dispatch(getSpecificOpponentTeamSuccess(response.data))

    dispatch(
      showNotification({
        type:"success",
        message:response.message || "Opponent team fetched successfully!",  
      })
    )
  } catch (error) {
       const errorMessage = getErrorMessage(error);
    dispatch(getSpecificOpponentTeamFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );

    throw error;
  }
}


export const addOpponent=(teamId,opponentId)=>async(dispatch)=>{
  try {
    dispatch(addOpponentStart())
    const  response = await addOpponentAPI(teamId,opponentId)
    dispatch(addOpponentSuccess(response.data))
    
    dispatch(
      showNotification({
        type:"success",
        message:response.message || "Opponent added successfully!",
      })
    )
    return response 
  } catch (error) {
     const errorMessage = getErrorMessage(error)
     dispatch(addOpponentFailure(errorMessage))
     dispatch(
      showNotification({
        type:"error",
        message:errorMessage
      })
     )
     throw error
  }
}


export const deleteOpponent=(teamId,opponentId)=>async(dispatch)=>{
  try {
    dispatch(deleteOpponentStart())
    const response = await deleteOpponentAPI(teamId,opponentId)
    dispatch(deleteOpponentSuccess({opponentId}))
    dispatch(
      showNotification({
        type:"success",
        message:response.message || "Opponent deleted successfully!",
      })
    )
    return response
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    dispatch(deleteOpponentFailure(errorMessage))

    dispatch(
      showNotification({
        type:"error",
        message:errorMessage
      })
    )
    throw error
  }
}