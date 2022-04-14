import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardActions,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
} from "@mui/material";
import { useState } from "react";
import { setTrack, reset } from "../features/track/trackSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdRemove, MdMenu } from "react-icons/md";
import React from "react";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";

function PlaylistSongItem({ player, data, deleteTrack, playlist }) {
  const dispatch = useDispatch();
  const popupState = usePopupState({ variant: "popover", popupId: "songMenu" });
  const playlistPopupState = usePopupState({
    variant: "popover",
    popupId: "playlistMenu",
  });

  const [playlistId, setPlaylistId] = useState(null);

  const setCurrentTrack = () => {
    // console.log("[DEBUG] current playlist", playlist, data);
    dispatch(setTrack(data));
    player.togglePlayingChange();
    player.playFromList(playlist, data);
  };

  const removeTrack = () => {
    popupState.close;
    deleteTrack(data);
  };

  const addTrackToPlaylist = () => {
    playlistPopupState.close;
    // console.log(
    //   "🚀 ~ file: SongItem.jsx ~ line 43 ~ addTrackToPlaylist ~ playlistId",
    //   playlistId
    // );
    addToPlaylist(playlistId, data);
  };

  return (
    <>
      {/* <Card sx={{ m: 2 }}> */}
      {/* <Box */}
      <ListItem
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CardActionArea onClick={setCurrentTrack}>
          <CardContent>
            <Typography variant="h5">{data.name}</Typography>
            <Typography variant="h6" color="text.secondary">
              {data.author}
            </Typography>
          </CardContent>
        </CardActionArea>
        <IconButton onClick={removeTrack}>
          <MdRemove size={32} />
        </IconButton>
        <IconButton {...bindTrigger(popupState)}>
          <MdMenu size={32} />
        </IconButton>
        {/* Menu of the popupstate */}
        <Menu {...bindMenu(popupState)}>
          <MenuItem onClick={removeTrack}>Remove from songs list</MenuItem>
        </Menu>
      </ListItem>
      {/* </Box> */}
      {/* </Card> */}
    </>
  );
}

export default PlaylistSongItem;
