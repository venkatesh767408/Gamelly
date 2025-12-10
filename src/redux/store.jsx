import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice"
import uiReducer from "./slices/uiSlice";
import createTeamReducer from "./slices/CreateTeamSlice";
import createPlayerReducer from "./slices/createPlayerSlice"
import createStaffReducer from "./slices/createStaffSlice"
import scheduleReducer from "./slices/scheduleSlice"
import gameReducer from "./slices/gameSlice"


const authPersistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['accessToken', 'refreshToken', 'user', 'isAuthenticated']
};


const profilePersistConfig={
    key:"profile",
    storage:storage,
    whitelist:["user"]
};

const teamPersistConfig = {
  key: 'createTeam',
  storage: storage,
  whitelist: ['teams'] 
};


const playerPersistConfig = {
  key: "createPlayer",
  storage: storage,
  whitelist: ["players"]
};

const staffPersistConfig = {
  key: "createStaff",
  storage: storage,
  whitelist: ["staff"]
};

const schedulePersistConfig = {
  key: "schedule",
  storage: storage,
  whitelist: ["schedules", "createdSchedule"] 
};

const gamePersistConfig={
  key:"game",
  storage:storage,
  whitelist:["games"]
}


const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistProfileReducer = persistReducer(profilePersistConfig,profileReducer)
const persistedTeamReducer = persistReducer(teamPersistConfig, createTeamReducer);
const persistedPlayerReducer = persistReducer(playerPersistConfig, createPlayerReducer);
const persistedStaffReducer = persistReducer(staffPersistConfig, createStaffReducer);
const persistedScheduleReducer = persistReducer(schedulePersistConfig, scheduleReducer);
const persistedGameReducer = persistReducer(gamePersistConfig,gameReducer)


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    profile:persistProfileReducer,
    ui: uiReducer,
    createTeam: persistedTeamReducer,
    createPlayer: persistedPlayerReducer,
    createStaff: persistedStaffReducer,
    schedule: persistedScheduleReducer,
    game:persistedGameReducer
 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.MODE !== "production"
});

export const persistor = persistStore(store);
export default store;