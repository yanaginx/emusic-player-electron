import {
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
  CardMedia,
  CardActionArea,
  CircularProgress,
} from "@mui/material";
import { MdDownload, MdDownloadDone } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { resetSearch, downloadSong } from "../features/search/searchSlice";
import { setTrack, reset } from "../features/track/trackSlice";

function SearchResult({ player, data }) {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetSearch());
    };
  }, []);

  const handleDownload = () => {
    dispatch(downloadSong(data.id));
  };

  const setCurrentTrack = () => {
    const newData = {
      name: data.title,
      author: data.artists,
      location: data.url,
    };
    dispatch(setTrack(newData));
    player.togglePlayingChange();
    player.play(newData);
  };

  return (
    <ListItem
      key={data.id}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // width: 600,
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 86 }}
        image={data.image}
        alt="songs cover"
      />
      <CardActionArea onClick={setCurrentTrack}>
        <CardContent sx={{ width: 500 }}>
          <Typography noWrap variant="h6">
            {data.title}
          </Typography>
          <Typography noWrap color="text.secondary">
            {data.artists}
          </Typography>
        </CardContent>
      </CardActionArea>

      <IconButton>
        <MdDownload onClick={handleDownload} size={32} />
      </IconButton>
    </ListItem>
  );
}

export default SearchResult;
