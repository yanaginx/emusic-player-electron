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

function PlaylistSongItem({ player, data, deleteTrack, playlist }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [playlistId, setPlaylistId] = useState(null);

  const setCurrentTrack = () => {
    // console.log("[DEBUG] current playlist", playlist, data);
    dispatch(setTrack(data));
    player.togglePlayingChange();
    player.playFromList(playlist, data);
  };

  const removeTrack = () => {
    deleteTrack(data);
    handleClose();
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
        key={data.id}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CardActionArea onClick={setCurrentTrack}>
          <CardContent>
            <Typography variant="h6">{data.name}</Typography>
            <Typography color="text.secondary">{data.author}</Typography>
          </CardContent>
        </CardActionArea>
        {/* <IconButton onClick={removeTrack}>
          <MdRemove size={32} />
        </IconButton> */}
        <IconButton onClick={handleClick}>
          <MdMenu size={32} />
        </IconButton>
        {/* Menu of the popupstate */}
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={removeTrack}>Remove from this playlist</MenuItem>
        </Menu>
      </ListItem>
      {/* </Box> */}
      {/* </Card> */}
    </>
  );
}

export default PlaylistSongItem;
