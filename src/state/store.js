import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-slice";
import tripReducer from "./trip-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    trip: tripReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
