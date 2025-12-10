import {
  forgotPasswordAPI,
  googleLoginAPI,
  loginUserAPI,
  logoutUserAPI,
  registerUserAPI,
  resendOTPAPI,
  resetPasswordAPI,
  verifyOTPAPI,
  refreshTokenAPI
} from "../../services/Auth-api";
import {
  forgotPasswordFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  googleLoginFailure,
  googleLoginStart,
  googleLoginSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
  registerFailure,
  registerStart,
  registerSuccess,
  resendOtpFailure,
  resendOtpStart,
  resendOtpSuccess,
  resetPasswordFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  verifyOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  updateAccessToken
} from "../slices/authSlice";
import { showNotification } from "../slices/uiSlice";

const PROFILE_BASE_URL =import.meta.env.VITE_PROFILE_API_URL||"http://localhost:3000/api/v1/profile"



// Helper to extract error message
const getErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return "Something went wrong. Please try again.";
};

// In your authActions.js - update the checkAuth action
export const checkAuth = () => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Get tokens from localStorage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    console.log('🔐 Checking auth status:', { 
      hasAccessToken: !!accessToken, 
      hasRefreshToken: !!refreshToken 
    });

    if (!accessToken || !refreshToken) {
      throw new Error("No tokens found");
    }

    // Check if token is expired or about to expire
    const isTokenExpiredOrExpiring = (token) => {
      if (!token || token === "testAccessToken") return false;
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;
        return timeUntilExpiry < 300;
      } catch (error) {
        console.error('Error parsing token:', error);
        return true;
      }
    };

    let validAccessToken = accessToken;
    
    // Refresh token if needed
    if (isTokenExpiredOrExpiring(accessToken)) {
      console.log('🔄 Token needs refresh, refreshing...');
      const refreshResponse = await refreshTokenAPI(refreshToken);
      validAccessToken = refreshResponse.accessToken;
      
      // Store new tokens
      localStorage.setItem('accessToken', validAccessToken);
      if (refreshResponse.refreshToken) {
        localStorage.setItem('refreshToken', refreshResponse.refreshToken);
      }
    }

 


    const userResponse = await fetch(`${PROFILE_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${validAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userResponse.json();

    dispatch(loginSuccess({
      user: userData.data || userData.user, 
      accessToken: validAccessToken,
      refreshToken: refreshToken
    }));

    console.log('✅ Auth check successful with full user data');
    
  } catch (error) {
    console.error('❌ Auth check failed:', error);
    
    // Clear invalid tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    dispatch(loginFailure("Please login again"));
  }
};

// Register user
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    const response = await registerUserAPI(userData);
    dispatch(registerSuccess(response.data));
    dispatch(
      showNotification({
        type: "success",
        message: response.message,
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(registerFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Verify OTP - UPDATED to store tokens
export const verifyOTP = (otpData) => async (dispatch) => {
  try {
    dispatch(verifyOtpStart());

    const response = await verifyOTPAPI(otpData);

    // Store tokens in localStorage
    if (response.accessToken && response.refreshToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    dispatch(
      verifyOtpSuccess({
        user: response.data,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })
    );

    dispatch(
      showNotification({
        type: "success",
        message: response.message,
      })
    );

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(verifyOtpFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Resend OTP
export const resendOTP = (email) => async (dispatch) => {
  try {
    dispatch(resendOtpStart());

    const response = await resendOTPAPI(email);

    dispatch(resendOtpSuccess());

    dispatch(
      showNotification({
        type: "success",
        message: response.message,
      })
    );

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(resendOtpFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Login user - UPDATED to store tokens
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());

    const response = await loginUserAPI(credentials);
    
    // Store tokens in localStorage
    if (response.accessToken && response.refreshToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    dispatch(
      loginSuccess({
        user: response.data,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })
    );

    dispatch(
      showNotification({
        type: "success",
        message: response.message,
      })
    );

    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(loginFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Logout user - UPDATED to clear tokens
export const logoutUser = () => async (dispatch, getState) => {
  try {
    const { refreshToken } = getState().auth;

    if (refreshToken) {
      await logoutUserAPI(refreshToken);
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear localStorage tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    dispatch(logout());
    dispatch(
      showNotification({
        type: "success",
        message: "Logged out successfully",
      })
    );
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordStart());
    const response = await forgotPasswordAPI(email);
    dispatch(forgotPasswordSuccess());
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Password reset OTP sent to your email",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(forgotPasswordFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Reset Password
export const resetPassword = (resetData) => async (dispatch) => {
  try {
    dispatch(resetPasswordStart());
    const response = await resetPasswordAPI(resetData);
    dispatch(resetPasswordSuccess());
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Password reset successfully",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(resetPasswordFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};

// Google Login - UPDATED to store tokens
export const googleLogin = (idToken) => async (dispatch) => {
  try {
    dispatch(googleLoginStart());
    const response = await googleLoginAPI(idToken);
    
    // Store tokens in localStorage
    if (response.accessToken && response.refreshToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    dispatch(googleLoginSuccess({
        user: response.data,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
    }));
    dispatch(
      showNotification({
        type: "success",
        message: response.message || "Google login successful",
      })
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch(googleLoginFailure(errorMessage));
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
      })
    );
    throw error;
  }
};