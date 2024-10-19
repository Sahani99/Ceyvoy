import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserValue: (state, action) => {
      state.user = action.payload;
    },
    resetUserValue: (state) => {
      state.user = null;
    },
  },
});

export const { setUserValue, resetUserValue } = userSlice.actions;
export default userSlice.reducer;
