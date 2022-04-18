import axios from "axios";

const API_URL = "http://localhost:5000/api/scan/";

// Get emotions
const scanUsbAndCopy = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

const scanDirService = { scanUsbAndCopy };

export default scanDirService;
