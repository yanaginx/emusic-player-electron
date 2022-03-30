import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  player: null,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer: (state, action) => {
      state.player = action.payload;
    },
    reset: (state) => initialState,
  },
});

export const { setPlayer, reset } = playerSlice.actions;
export default playerSlice.reducer;
