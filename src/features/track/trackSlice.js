import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tracks: [],
  track: null,
};

export const trackSlice = createSlice({
  name: "track",
  initialState,
  reducers: {
    setTrackList: (state, action) => {
      state.tracks = action.payload;
    },
    setTrack: (state, action) => {
      state.track = action.payload;
    },
    reset: (state) => initialState,
  },
});

export const { setTrackList, setTrack, reset } = trackSlice.actions;
export default trackSlice.reducer;
