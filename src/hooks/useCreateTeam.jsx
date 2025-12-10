import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOpponent, createTeam, deleteOpponent, deleteTeam, getOpponents, getSpecificOpponentTeam, getTeamById, getTeams, updateTeam } from "../redux/actions/createteamactions";
import { clearCreatedTeam, clearCurrentTeam, clearError, clearOpponets } from "../redux/slices/CreateTeamSlice";


export const useCreateTeam  = () => {
  const dispatch = useDispatch();
  const createTeamState = useSelector((state) => state.createTeam); 

  const create = useCallback(
    (teamData) => dispatch(createTeam(teamData)),
    [dispatch]
  );

  const update = useCallback(
    (teamId, updateData) => dispatch(updateTeam(teamId, updateData)),
    [dispatch]
  );

  const remove = useCallback(
    (teamId) => dispatch(deleteTeam(teamId)),
    [dispatch]
  );

  const fetchTeams = useCallback(
    () => dispatch(getTeams()),
    [dispatch]
  );

  const fetchTeamById = useCallback(
    (teamId) => dispatch(getTeamById(teamId)),
    [dispatch]
  );

  const clearTeamError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const clearCurrentTeamData = useCallback(
    () => dispatch(clearCurrentTeam()),
    [dispatch]
  );

  const clearCreatedTeamData = useCallback(
    () => dispatch(clearCreatedTeam()),
    [dispatch]
  );

  const fetchOpponents=useCallback(
    (currentTeamId=null)=>dispatch(getOpponents(currentTeamId)),
    [dispatch]
  );

  const fetchSpecificOpponentTeam = useCallback(
  (opponentId) => dispatch(getSpecificOpponentTeam(opponentId)),
  [dispatch]
);

  const addTeamOpponent=useCallback(
    (teamId,opponentId)=>dispatch(addOpponent(teamId,opponentId)),
    [dispatch]
  );

  const removeOpponent=useCallback(
    (teamId,opponentId)=>dispatch(deleteOpponent(teamId,opponentId)),
    [dispatch]
  )

  const clearOpponentData=useCallback(
    ()=>dispatch(clearOpponets()),
    [dispatch]
  )

  return {
    // State
    ...createTeamState,
    
    // Actions
    createTeam: create,
    updateTeam: update,
    deleteTeam: remove,
    getTeams: fetchTeams,
    getTeamById: fetchTeamById,
    getOpponents:fetchOpponents,
    addOpponent:addTeamOpponent,
    deleteOpponent:removeOpponent,
    getSpecificOpponentTeam: fetchSpecificOpponentTeam,
    
    // Utility functions
    clearTeamError,
    clearCurrentTeam: clearCurrentTeamData,
    clearCreatedTeam: clearCreatedTeamData,
    clearOpponets:clearOpponentData
  };
};