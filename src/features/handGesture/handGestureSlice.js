import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handGestureService from "./handGestureService";

const initialState = {
  isOn: false,
  isHandError: false,
  isHandLoading: false,
  isHandSuccess: false,
  handMessage: "",
};

// Enable hand gesture
export const enable = createAsyncThunk(
  "handGesture/enable",
  async (_, thunkAPI) => {
    try {
      return await handGestureService.enableHandGesture();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Disable hand gesture
export const disable = createAsyncThunk(
  "handGesture/disable",
  async (_, thunkAPI) => {
    try {
      return await handGestureService.disableHandGesture();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const handGestureSlice = createSlice({
  name: "handGesture",
  initialState,
  reducers: {
    resetHand: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(enable.pending, (state) => {
        state.isHandLoading = true;
      })
      .addCase(enable.fulfilled, (state, action) => {
        state.isHandLoading = false;
        state.isHandSuccess = true;
        state.isOn = true;
      })
      .addCase(enable.rejected, (state, action) => {
        state.isHandLoading = false;
        state.isHandError = true;
        state.handMessage = action.payload;
      })
      .addCase(disable.fulfilled, (state, action) => {
        state.isOn = false;
      });
  },
});

export const { resetHand } = handGestureSlice.actions;
export default handGestureSlice.reducer;
