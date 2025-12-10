import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPlayer,
  deletePlayer,
  getPlayersByTeam,
  updatePlayer,
} from "../redux/actions/createPlayerActions";
import {
  clearCreatedPlayer,
  clearCurrentPlayer,
  clearError,
} from "../redux/slices/createPlayerSlice";

export const useCreatePlayer = () => {
  const dispatch = useDispatch();
  const playerState = useSelector((state) => state.createPlayer);

  const create = useCallback(
    (playerData) => dispatch(createPlayer(playerData)),
    [dispatch]
  );

  const update = useCallback(
    (playerId, updateData) => dispatch(updatePlayer(playerId, updateData)),
    [dispatch]
  );

  const remove = useCallback(
    (playerId) => dispatch(deletePlayer(playerId)),
    [dispatch]
  );

  const fetchPlayersByTeam = useCallback(
    (teamId) => dispatch(getPlayersByTeam(teamId)),
    [dispatch]
  );

  const clearPlayerError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const clearCurrentPlayerData = useCallback(
    () => dispatch(clearCurrentPlayer()),
    [dispatch]
  );

  const clearCreatedPlayerData = useCallback(
    () => dispatch(clearCreatedPlayer()),
    [dispatch]
  );

  return {
    ...playerState,

    createPlayer: create,
    updatePlayer: update,
    deletePlayer: remove,
    getPlayersByTeam: fetchPlayersByTeam,

    clearPlayerError,
    clearCurrentPlayer: clearCurrentPlayerData,
    clearCreatedPlayer: clearCreatedPlayerData,
  };
};
