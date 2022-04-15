import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wifiService from "./wifiService";

const initialState = {
  connection: null,
  allConnections: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  isSuccessConnect: false,
  isLoadingConnect: false,
  isErrorConnect: false,
  message: "",
};

// Get all wifi connections at the call time
export const getNetworks = createAsyncThunk(
  "/wifi/getNetworks",
  async (_, thunkAPI) => {
    try {
      return await wifiService.getNetworks();
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

// Connect to a network with given ssid and password
export const connectToNetwork = createAsyncThunk(
  "/wifi/connectToNetwork",
  async (info, thunkAPI) => {
    try {
      return await wifiService.connectToNetwork(info);
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

// Disconnect from wifi
export const disconnectFromNetwork = createAsyncThunk(
  "/wifi/disconnectFromNetwork",
  async () => {
    await wifiService.disconnectFromNetwork();
  }
);

export const wifiSlice = createSlice({
  name: "wifi",
  initialState,
  reducers: {
    reset: (state) => {
      state.allConnections = [];
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.isLoadingConnect = false;
      state.isErrorConnect = false;
      state.isSuccessConnect = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNetworks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNetworks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allConnections = action.payload;
      })
      .addCase(getNetworks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.allConnections = [];
      })
      .addCase(connectToNetwork.pending, (state) => {
        state.isLoadingConnect = true;
      })
      .addCase(connectToNetwork.fulfilled, (state, action) => {
        state.isLoadingConnect = false;
        state.isSuccessConnect = true;
        state.connection = action.payload;
      })
      .addCase(connectToNetwork.rejected, (state, action) => {
        state.isLoadingConnect = false;
        state.isErrorConnect = true;
        state.message = action.payload;
        state.connection = null;
      })
      .addCase(disconnectFromNetwork.fulfilled, (state) => {
        state.connection = null;
      });
  },
});

export const { reset } = wifiSlice.actions;
export default wifiSlice.reducer;
