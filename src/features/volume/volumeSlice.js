import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import volumeService from "./volumeService";

const initialState = {
  systemVolume: 0,
  isErrorGet: false,
  isLoadingGet: false,
  isSuccessGet: false,
  isSuccessSet: false,
  isLoadingSet: false,
  isErrorSet: false,
  volumeMessage: "",
};

// Get current system volume
export const getVolume = createAsyncThunk(
  "/volume/getVolume",
  async (_, thunkAPI) => {
    try {
      return await volumeService.getVolume();
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

// Set current system volume
export const setVolume = createAsyncThunk(
  "/volume/setVolume",
  async (info, thunkAPI) => {
    try {
      return await volumeService.setVolume(info);
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

export const volumeSlice = createSlice({
  name: "volume",
  initialState,
  reducers: {
    resetVolume: (state) => {
      state.isLoadingSet = false;
      state.isErrorSet = false;
      state.isSuccessSet = false;
      state.isLoadingGet = false;
      state.isErrorGet = false;
      state.isSuccessGet = false;
      state.volumeMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVolume.pending, (state) => {
        state.isLoadingGet = true;
      })
      .addCase(getVolume.fulfilled, (state, action) => {
        state.isLoadingGet = false;
        state.isSuccessGet = true;
        state.systemVolume = action.payload;
      })
      .addCase(getVolume.rejected, (state, action) => {
        state.isLoadingGet = false;
        state.isErrorGet = true;
        state.volumeMessage = action.payload;
      })
      .addCase(setVolume.pending, (state) => {
        state.isLoadingSet = true;
      })
      .addCase(setVolume.fulfilled, (state, action) => {
        state.isLoadingSet = false;
        state.isSuccessSet = true;
        state.systemVolume = action.payload;
      })
      .addCase(setVolume.rejected, (state, action) => {
        state.isLoadingSet = false;
        state.isErrorSet = true;
        state.volumeMessage = action.payload;
      });
  },
});

export const { resetVolume } = volumeSlice.actions;
export default volumeSlice.reducer;
