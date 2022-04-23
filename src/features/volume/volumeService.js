import axios from "axios";

const API_URL = "http://localhost:5000/api/volume/";

// Get current system volume
const getVolume = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Set current system volume
const setVolume = async (info) => {
  const response = await axios.post(API_URL, info);
  return response.data;
};

const volumeService = { setVolume, getVolume };

export default volumeService;
