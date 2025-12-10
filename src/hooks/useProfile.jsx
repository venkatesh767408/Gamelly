import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
  getProfile, 
  updateProfile, 
  updateProfileField,
  updateUserPhone,
  updateUserLocation,
  updateUserAge,
  updateUserFullname,
  uploadProfilePicture, 
  deleteProfilePicture,
  clearProfileUploadState,
  clearProfileFieldUpdateState,
  clearProfileError 
} from "../redux/actions/profileActions"
import { clearError, updateUserField } from "../redux/slices/profileSlice"

export const useProfile = () => {
    const dispatch = useDispatch()
    const profile = useSelector((state) => state.profile)

    const fetchProfile = useCallback(
        () => dispatch(getProfile()),
        [dispatch]
    )

    const update = useCallback(
        (profileData) => dispatch(updateProfile(profileData)),
        [dispatch]
    )

    // Update single field
    const updateField = useCallback(
        (field, value) => dispatch(updateProfileField(field, value)),
        [dispatch]
    )

    // Convenience methods for specific fields
    const updatePhone = useCallback(
        (phone) => dispatch(updateUserPhone(phone)),
        [dispatch]
    )

    const updateLocation = useCallback(
        (location) => dispatch(updateUserLocation(location)),
        [dispatch]
    )

    const updateAge = useCallback(
        (age) => dispatch(updateUserAge(age)),
        [dispatch]
    )

    const updateFullname = useCallback(
        (fullname) => dispatch(updateUserFullname(fullname)),
        [dispatch]
    )

    const uploadPicture = useCallback(
        (file) => dispatch(uploadProfilePicture(file)),
        [dispatch]
    )

    const removePicture = useCallback(
        () => dispatch(deleteProfilePicture()),
        [dispatch]
    )

    const clearUpload = useCallback(
        () => dispatch(clearProfileUploadState()),
        [dispatch]
    )

    const clearFieldUpdate = useCallback(
        () => dispatch(clearProfileFieldUpdateState()),
        [dispatch]
    )

    const clearProfileError = useCallback(
        () => dispatch(clearError()),
        [dispatch]
    )

    // Optimistic update for immediate UI feedback
    const optimisticUpdate = useCallback(
        (updates) => {
            dispatch(updateUserField(updates))
        },
        [dispatch]
    )

    return {
        // State
        ...profile,
        
        // Actions
        fetchProfile,
        updateProfile: update,
        updateProfileField: updateField,
        updatePhone,
        updateLocation,
        updateAge,
        updateFullname,
        uploadProfilePicture: uploadPicture,
        deleteProfilePicture: removePicture,
        clearUploadState: clearUpload,
        clearFieldUpdateState: clearFieldUpdate,
        clearError: clearProfileError,
        optimisticUpdate,
        
        // Derived state
        hasProfilePicture: !!profile.user?.profilePicture,
        displayName: profile.user?.fullname || profile.user?.username,
        userInitials: profile.user?.fullname 
            ? profile.user.fullname.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2)
            : profile.user?.username?.charAt(0)?.toUpperCase() || 'U'
    }
}