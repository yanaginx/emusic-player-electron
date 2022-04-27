import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPlaylistChange: false,
};

export const playlistChangeSlice = createSlice({
  name: "playlistChange",
  initialState,
  reducers: {
    setPlaylistChange: (state, action) => {
      state.isPlaylistChange = action.payload;
    },
    reset: (state) => initialState,
  },
});

export const { setPlaylistChange, reset } = playlistChangeSlice.actions;
export default playlistChangeSlice.reducer;
