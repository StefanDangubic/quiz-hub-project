import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import quizReducer from './slices/quizSlice';
import leaderboardReducer from "./slices/leaderboardSlice"
//import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    leaderboard: leaderboardReducer,
   // ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      // },
      serializableCheck:false,
    }),
});

