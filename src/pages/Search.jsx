import {
  Paper,
  InputBase,
  Divider,
  IconButton,
  List,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { MdSearch } from "react-icons/md";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { resetSearch, searchSongs } from "../features/search/searchSlice";

import SearchResult from "../components/SearchResult";
import { toast } from "react-toastify";
import { Scrollbars } from "react-custom-scrollbars-2";
import ColoredScrollbars from "../components/ColoredScrollbars";

function Search({ player }) {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const {
    isLoadingSearch,
    isErrorSearch,
    isSuccessSearch,
    isLoadingDownload,
    isErrorDownload,
    isSuccessDownload,
    searchResult,
    searchMessage,
    downloadMessage,
  } = useSelector((state) => state.search);

  useEffect(() => {
    if (isErrorSearch) {
      toast.error(searchMessage);
    }
  }, [isErrorSearch]);

  useEffect(() => {
    if (isSuccessDownload) {
      player.scanMusicDir();
      player.saveProfiles();
      toast.dismiss();
      toast.success(downloadMessage.message);
    }
  }, [isSuccessDownload]);

  useEffect(() => {
    if (isLoadingDownload) {
      toast.info("Downloading...", { autoClose: false });
    }
  }, [isLoadingDownload]);

  useEffect(() => {
    console.log(
      "🚀 ~ file: Search.jsx ~ line 16 ~ useEffect ~ searchResult",
      searchResult
    );
  }, [dispatch, searchResult]);

  useEffect(() => {
    return () => {
      dispatch(resetSearch());
    };
  }, []);

  // Method for buttons
  const handleSearch = () => {
    const query = {
      q: searchQuery,
    };
    console.log(
      "🚀 ~ file: Search.jsx ~ line 34 ~ handleSearch ~ query",
      query
    );
    dispatch(resetSearch());
    dispatch(searchSongs(query));
    setSearchQuery("");
  };

  return (
    <>
      <Paper
        component="form"
        sx={{
          p: "2px 10px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for songs online"
          inputProps={{ "aria-label": "search songs" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton
          onClick={handleSearch}
          sx={{ p: "10px" }}
          aria-label="search"
        >
          <MdSearch />
        </IconButton>
      </Paper>
      {isLoadingSearch ? (
        <LinearProgress />
      ) : (
        // <List sx={{ paddingTop: `10px`, height: `420px`, overflowY: "auto" }}>
        <ColoredScrollbars style={{ height: "420px" }}>
          {searchResult?.map((song) => (
            <SearchResult data={song} player={player} />
          ))}
        </ColoredScrollbars>
      )}
    </>
  );
}

export default Search;
