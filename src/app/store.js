import { configureStore } from "@reduxjs/toolkit";
import ferReducer from "../features/fer/ferSlice";
import trackReducer from "../features/track/trackSlice";
import playerReducer from "../features/player/playerSlice";

export const store = configureStore({
  reducer: {
    fer: ferReducer,
    trackRedux: trackReducer,
    playerRedux: playerReducer,
  },
});
