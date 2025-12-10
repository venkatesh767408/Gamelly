import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
  resetPassword, 
  forgotPassword, 
  loginUser, 
  logoutUser, 
  registerUser, 
  resendOTP, 
  verifyOTP, 
  googleLogin,
  checkAuth 
} from "../redux/actions/authActions"
import { clearError } from "../redux/slices/authSlice"

export const useAuth = () => {
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)

    // Check for existing auth on app load
    useEffect(() => {
        console.log('🔐 App loaded, checking authentication...');
        dispatch(checkAuth());
    }, [dispatch]);

    const logout = useCallback(() => {
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear service worker cache if any
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        dispatch(logoutUser());
        
        // Force reload to clear React state and cache
        setTimeout(() => {
            window.location.href = "/";
        }, 100);
    }, [dispatch]);

    const register = useCallback(
        (userData) => dispatch(registerUser(userData)),
        [dispatch]
    )

    const verifyOtp = useCallback(
        (otpData) => dispatch(verifyOTP(otpData)),
        [dispatch]
    )

    const resendOtp = useCallback(
        (email) => dispatch(resendOTP(email)),
        [dispatch]
    )

    const login = useCallback(
        (credentials) => dispatch(loginUser(credentials)),
        [dispatch]
    )

    const clearAuthError = useCallback(
        () => dispatch(clearError()),
        [dispatch]
    )

    const requestPasswordReset = useCallback(
        (email) => dispatch(forgotPassword(email)),
        [dispatch]
    )

    const confirmPasswordReset = useCallback(
        (resetData) => dispatch(resetPassword(resetData)),
        [dispatch]
    )

    const GoogleLogin = useCallback(
        (idToken) => dispatch(googleLogin(idToken)),
        [dispatch]
    )

    return {
        ...auth,
        register,
        verifyOtp,
        resendOtp,
        login,
        logout,
        clearAuthError,
        requestPasswordReset,
        confirmPasswordReset,
        GoogleLogin
    }
}