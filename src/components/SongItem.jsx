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
  Modal,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setTrack, reset } from "../features/track/trackSlice";
import { MdRemove, MdMenu, MdPlaylistAdd } from "react-icons/md";
import React from "react";

function SongItem({ player, data, deleteTrack, addToPlaylist }) {
  const [playlists, setPlaylists] = useState(player.playlists);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // PA modal is for playlist addition
  // playlist name for playlist creation
  const [playlistId, setPlaylistId] = useState(null);

  const dispatch = useDispatch();
  const { track } = useSelector((state) => state.trackRedux);
  // console.log("🚀 ~ file: SongItem.jsx ~ line 8 ~ SongItem ~ track", track);
  // console.log("🚀 ~ file: SongItem.jsx ~ line 4 ~ SongItem ~ data", data);

  const setCurrentTrack = () => {
    dispatch(setTrack(data));
    player.togglePlayingChange();
    player.play(data);
  };

  const removeTrack = () => {
    // popupState.close;
    deleteTrack(data);
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
        <IconButton onClick={handleClick}>
          <MdPlaylistAdd size={32} />
        </IconButton>
        {/* Menu of the popupstate */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {player.playlists.map((playlist) => (
            <MenuItem
              onClick={() => {
                addToPlaylist(playlist.id, data);
                handleClose();
              }}
            >
              {playlist.name}
            </MenuItem>
          ))}
        </Menu>
      </ListItem>
      {/* </Box> */}
      {/* </Card> */}
    </>
  );
}

export default SongItem;
