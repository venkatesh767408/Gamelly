import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  notification: null,
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    showNotification: (state, action) => {
      state.notification = action.payload;
    },

    hideNotification: (state) => {
      state.notification = null;
    },

    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
  },
});

export const {
  setLoading,
  showNotification,
  hideNotification,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
