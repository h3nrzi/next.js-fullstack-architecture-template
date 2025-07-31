import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // jobs: jobReducer,
  },
  // You can add middleware like RTK Query here
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
