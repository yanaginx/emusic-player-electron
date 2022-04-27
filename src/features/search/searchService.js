import axios from "axios";

const API_URL = "http://localhost:5000/api/online/";

// search for songs
const searchSongs = async (query) => {
  const response = await axios.get(API_URL + "search", { params: query });

  return response.data;
};

// download songs with given id
const downloadSong = async (songId) => {
  const response = await axios.get(API_URL + "download/" + songId);

  return response.data;
};

const searchService = { searchSongs, downloadSong };

export default searchService;
