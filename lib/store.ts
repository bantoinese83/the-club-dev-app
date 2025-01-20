import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/features/user/userSlice';
import dailyLogReducer from '@/features/dailyLog/dailyLogSlice';
import githubReducer from '@/features/github/githubSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    dailyLog: dailyLogReducer,
    github: githubReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
