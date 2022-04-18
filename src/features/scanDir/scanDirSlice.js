import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import scanDirService from "./scanDirService";

const initialState = {
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// Get emotions from server
export const scanUsbAndCopy = createAsyncThunk(
  "scanDir/scanUsbAndCopy",
  async (_, thunkAPI) => {
    try {
      return await scanDirService.scanUsbAndCopy();
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

export const scanDirSlice = createSlice({
  name: "scanDir",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanUsbAndCopy.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(scanUsbAndCopy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(scanUsbAndCopy.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = scanDirSlice.actions;
export default scanDirSlice.reducer;
