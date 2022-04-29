import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import searchService from "./searchService";

const initialState = {
  searchResult: null,
  isErrorSearch: false,
  isLoadingSearch: false,
  isSuccessSearch: false,
  isErrorDownload: false,
  isLoadingDownload: false,
  isSuccessDownload: false,
  searchMessage: "",
  downloadMessage: "",
};

// Search for songs
export const searchSongs = createAsyncThunk(
  "search/searchSongs",
  async (query, thunkAPI) => {
    try {
      return await searchService.searchSongs(query);
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

// Download song
export const downloadSong = createAsyncThunk(
  "search/downloadSong",
  async (songId, thunkAPI) => {
    try {
      return await searchService.downloadSong(songId);
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

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearch: (state) => initialState,
    resetDownload: (state) => {
      state.isErrorDownload = false;
      state.isLoadingDownload = false;
      state.isSuccessDownload = false;
      state.downloadMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchSongs.pending, (state) => {
        state.isLoadingSearch = true;
      })
      .addCase(searchSongs.fulfilled, (state, action) => {
        state.isLoadingSearch = false;
        state.isSuccessSearch = true;
        state.searchResult = action.payload;
      })
      .addCase(searchSongs.rejected, (state, action) => {
        state.isLoadingSearch = false;
        state.isErrorSearch = true;
        state.searchResult = null;
        state.searchMessage = action.payload;
      })
      .addCase(downloadSong.pending, (state) => {
        state.isLoadingDownload = true;
      })
      .addCase(downloadSong.fulfilled, (state, action) => {
        state.isLoadingDownload = false;
        state.isSuccessDownload = true;
        state.downloadMessage = action.payload;
      })
      .addCase(downloadSong.rejected, (state, action) => {
        state.isLoadingDownload = false;
        state.isErrorDownload = true;
        state.downloadMessage = action.payload;
      });
  },
});

export const { resetSearch, resetDownload } = searchSlice.actions;
export default searchSlice.reducer;
