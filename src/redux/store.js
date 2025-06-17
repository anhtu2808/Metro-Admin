import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import layoutReducer from './layoutSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    layout: layoutReducer,
  },
});
