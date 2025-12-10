import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  createStaff, 
  deleteStaff, 
  getStaffByTeam, 
  updateStaff 
} from "../redux/actions/createStaffActions";
import { 
  clearCreatedStaff, 
  clearCurrentStaff, 
  clearError 
} from "../redux/slices/createStaffSlice";

export const useCreateStaff = () => {
  const dispatch = useDispatch();
  const staffState = useSelector((state) => state.createStaff); 

  const create = useCallback(
    (staffData) => dispatch(createStaff(staffData)),
    [dispatch]
  );

  const update = useCallback(
    (staffId, updateData) => dispatch(updateStaff(staffId, updateData)),
    [dispatch]
  );

  const remove = useCallback(
    (staffId) => dispatch(deleteStaff(staffId)),
    [dispatch]
  );

  const fetchStaffByTeam = useCallback(
    (teamId) => dispatch(getStaffByTeam(teamId)),
    [dispatch]
  );

  const clearStaffError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const clearCurrentStaffData = useCallback(
    () => dispatch(clearCurrentStaff()),
    [dispatch]
  );

  const clearCreatedStaffData = useCallback(
    () => dispatch(clearCreatedStaff()),
    [dispatch]
  );

  return {
    ...staffState,
    createStaff: create,      
    updateStaff: update,       
    deleteStaff: remove,        
    getStaffByTeam: fetchStaffByTeam,
    clearStaffError,
    clearCurrentStaff: clearCurrentStaffData,
    clearCreatedStaff: clearCreatedStaffData,
  };
};