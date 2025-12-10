import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from 'redux-persist/integration/react';
import Loader from "./components/common/Loader";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
       <PersistGate loading={<Loader />} persistor={persistor}>
      <App />
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);
