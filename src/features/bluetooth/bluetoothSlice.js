import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bluetoothService from "./bluetoothService";

const initialState = {
  device: null,
  allDevices: [],
  isErrorDevices: false,
  isLoadingDevices: false,
  isSuccessDevices: false,
  isSuccessConnectDevice: false,
  isLoadingConnectDevice: false,
  isErrorConnectDevice: false,
  isSuccessDisconnectDevice: false,
  isLoadingDisconnectDevice: false,
  isErrorDisconnectDevice: false,
  bluetoothMessage: "",
};

// Get all bluetooth devices at the call time
export const getDevices = createAsyncThunk(
  "/bluetooth/getDevices",
  async (_, thunkAPI) => {
    try {
      return await bluetoothService.getDevices();
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
export const connectToDevice = createAsyncThunk(
  "/bluetooth/connectToDevice",
  async (info, thunkAPI) => {
    try {
      return await bluetoothService.connectToDevice(info);
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

// Disconnect from bluetooth
export const disconnectFromDevice = createAsyncThunk(
  "/bluetooth/disconnectFromDevice",
  async () => {
    await bluetoothService.disconnectFromDevice();
  }
);

export const bluetoothSlice = createSlice({
  name: "bluetooth",
  initialState,
  reducers: {
    resetBluetooth: (state) => {
      state.allDevices = [];
      state.isLoadingDevices = false;
      state.isErrorDevices = false;
      state.isSuccessDevices = false;
      state.isLoadingConnectDevice = false;
      state.isErrorConnectDevice = false;
      state.isSuccessConnectDevice = false;
      state.isLoadingDisconnectDevice = false;
      state.isErrorDisconnectDevice = false;
      state.isSuccessDisconnectDevice = false;
      state.bluetoothMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDevices.pending, (state) => {
        state.isLoadingDevices = true;
      })
      .addCase(getDevices.fulfilled, (state, action) => {
        state.isLoadingDevices = false;
        state.isSuccessDevices = true;
        state.allDevices = action.payload;
      })
      .addCase(getDevices.rejected, (state, action) => {
        state.isLoadingDevices = false;
        state.isErrorDevices = true;
        state.bluetoothMessage = action.payload;
        state.allDevices = [];
      })
      .addCase(connectToDevice.pending, (state) => {
        state.isLoadingConnectDevice = true;
      })
      .addCase(connectToDevice.fulfilled, (state, action) => {
        state.isLoadingConnectDevice = false;
        state.isSuccessConnectDevice = true;
        state.device = action.payload;
      })
      .addCase(connectToDevice.rejected, (state, action) => {
        state.isLoadingConnectDevice = false;
        state.isErrorConnectDevice = true;
        state.bluetoothMessage = action.payload;
        state.device = null;
      })
      .addCase(disconnectFromDevice.pending, (state) => {
        state.isLoadingDisconnectDevice = true;
      })
      .addCase(disconnectFromDevice.fulfilled, (state, action) => {
        state.isLoadingDisconnectDevice = false;
        state.isSuccessDisconnectDevice = true;
        state.device = action.payload;
      })
      .addCase(disconnectFromDevice.rejected, (state, action) => {
        state.isLoadingDisconnectDevice = false;
        state.isErrorDisconnectDevice = true;
        state.bluetoothMessage = action.payload;
      });
  },
});

export const { resetBluetooth } = bluetoothSlice.actions;
export default bluetoothSlice.reducer;
