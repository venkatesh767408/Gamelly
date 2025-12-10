import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSchedule,
  deleteSchedule,
  getSchedulesByTeam,
  updateSchedule,
} from "../redux/actions/scheduleActions";
import {
  clearCreatedSchedule,
  clearError,
  clearSchedules,
} from "../redux/slices/scheduleSlice";

export const useSchedule = () => {
  const dispatch = useDispatch();
  const scheduleState = useSelector((state) => state.schedule);

  const create = useCallback(
    (scheduleData) => dispatch(createSchedule(scheduleData)),
    [dispatch]
  );

  const update = useCallback(
    (scheduleId, updateData) =>
      dispatch(updateSchedule(scheduleId, updateData)),
    [dispatch]
  );

  const remove = useCallback(
    (scheduleId) => dispatch(deleteSchedule(scheduleId)),
    [dispatch]
  );

  const fetchScheduleByTeam = useCallback(
    (teamId) => dispatch(getSchedulesByTeam(teamId)),
    [dispatch]
  );

  const clearScheduleError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const clearCreatedScheduleData = useCallback(
    () => dispatch(clearCreatedSchedule()),
    [dispatch]
  );

  const clearAllSchedules = useCallback(
    () => dispatch(clearSchedules()),
    [dispatch]
  );


  return{
    ...scheduleState,


    createSchedule:create,
    updateSchedule:update,
    deleteSchedule:remove,
    getSchedulesByTeam:fetchScheduleByTeam,


    clearError:clearScheduleError,
    clearCreatedSchedule:clearCreatedScheduleData,
    clearSchedules:clearAllSchedules
  }
};
