import axios from "axios";

const API_URL = "http://localhost:5000/api/hand_gesture/";

// enable hand gesture
const enableHandGesture = async () => {
  const response = await axios.get(API_URL + "enable");

  return response.data;
};

// disable hand gesture
const disableHandGesture = async () => {
  const response = await axios.get(API_URL + "disable");

  return response.data;
};

const handGestureService = { enableHandGesture, disableHandGesture };

export default handGestureService;
