import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  pendingRegistration: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Start loading
    startLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // Register actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.pendingRegistration = action.payload;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // OTP verification actions
    verifyOtpStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    verifyOtpSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.pendingRegistration = null;
      state.error = null;
    },
    verifyOtpFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout action
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.pendingRegistration = null;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Resend OTP
    resendOtpStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    resendOtpSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    resendOtpFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Forgot Password actions
    forgotPasswordStart:(state)=>{
      state.isLoading=true;
      state.error=null;
    },
    forgotPasswordSuccess:(state)=>{
      state.isLoading = false;
      state.error = null
    },
    forgotPasswordFailure:(state,action)=>{
      state.isLoading = false;
      state.error = action.payload;
    },


    // Reset Password actions
    resetPasswordStart:(state)=>{
      state.isLoading = true;
      state.error = null;
    },
    resetPasswordSuccess:(state)=>{
      state.isLoading = false;
      state.error = null
    },
    resetPasswordFailure:(state,action)=>{
      state.isLoading=false;
      state.error = action.payload
    },


    // Google Login actions
    googleLoginStart:(state)=>{
      state.isLoading=true;
      state.error=null;
    },
    googleLoginSuccess:(state,action)=>{
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null
    },
    googleLoginFailure:(state,action)=>{
      state.isLoading = false;
      state.error = action.payload;
    },
      updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const {
  startLoading,
  registerStart,
  registerSuccess,
  registerFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  resendOtpStart,
  resendOtpSuccess,
  resendOtpFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  googleLoginStart,
  googleLoginSuccess,
  googleLoginFailure,
  updateAccessToken

} = authSlice.actions;

export default authSlice.reducer;
