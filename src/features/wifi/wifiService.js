import axios from "axios";

const API_URL = "http://localhost:5000/api/wifi/";

// Get wifi connections
const getNetworks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Connect to network with SSID and password
const connectToNetwork = async (info) => {
  const response = await axios.post(API_URL + "connect", info);
  return response.data;
};

// Disconnect from network
const disconnectFromNetwork = async () => {
  const response = await axios.get(API_URL + "disconnect");
  return response.data;
};

const wifiService = { getNetworks, connectToNetwork, disconnectFromNetwork };

export default wifiService;
