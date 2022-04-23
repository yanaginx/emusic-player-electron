import { configureStore } from "@reduxjs/toolkit";
import ferReducer from "../features/fer/ferSlice";
import trackReducer from "../features/track/trackSlice";
import playerReducer from "../features/player/playerSlice";
import wifiReducer from "../features/wifi/wifiSlice";
import scanDirReducer from "../features/scanDir/scanDirSlice";
import handGestureReducer from "../features/handGesture/handGestureSlice";
import bluetoothReducer from "../features/bluetooth/bluetoothSlice";
import volumeReducer from "../features/volume/volumeSlice";

export const store = configureStore({
  reducer: {
    fer: ferReducer,
    trackRedux: trackReducer,
    playerRedux: playerReducer,
    wifi: wifiReducer,
    scanDir: scanDirReducer,
    handGesture: handGestureReducer,
    bluetooth: bluetoothReducer,
    volume: volumeReducer,
  },
});
