import axios from "axios";

const API_URL = "http://localhost:5000/api/bluetooth/";

// Get bluetooth devices
const getDevices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Connect to a bluetooth device with mac address
const connectToDevice = async (info) => {
  const response = await axios.post(API_URL + "connect", info);
  return response.data;
};

// Disconnect from network
const disconnectFromDevice = async (info) => {
  const response = await axios.post(API_URL + "disconnect", info);
  return response.data;
};

// Get paired bluetooth device
const getPairedDevice = async () => {
  const response = await axios.get(API_URL + "paired");
  return response.data;
};

const bluetoothService = {
  getDevices,
  getPairedDevice,
  connectToDevice,
  disconnectFromDevice,
};

export default bluetoothService;
