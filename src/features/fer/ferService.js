import axios from "axios";

const API_URL = "http://localhost:5000/api/fer/";

// Get emotions
const getEmotions = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

const ferService = { getEmotions };

export default ferService;
