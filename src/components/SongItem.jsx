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
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setTrack, reset } from "../features/track/trackSlice";
import { MdRemove, MdMenu, MdPlaylistAdd } from "react-icons/md";
import ColoredScrollbars from "./ColoredScrollbars";
import React from "react";

function SongItem({ player, data, deleteTrack, addToPlaylist }) {
  const [playlists, setPlaylists] = useState(player.playlists);
  const { isPlaylistChange } = useSelector((state) => state.playlistChange);

  const [anchorEl, setAnchorEl] = useState(null);
  const [bigAnchorEl, setBigAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const bigOpen = Boolean(bigAnchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const bigHandleClick = (event) => {
    setAnchorEl(null);
    setBigAnchorEl(event.currentTarget);
  };
  const bigHandleClose = () => {
    console.log("went HERE");
    setAnchorEl(null);
    setBigAnchorEl(null);
  };

  // PA modal is for playlist addition
  // playlist name for playlist creation
  const [playlistId, setPlaylistId] = useState(null);

  const dispatch = useDispatch();
  const { track } = useSelector((state) => state.trackRedux);
  // console.log("🚀 ~ file: SongItem.jsx ~ line 8 ~ SongItem ~ track", track);
  // console.log("🚀 ~ file: SongItem.jsx ~ line 4 ~ SongItem ~ data", data);

  useEffect(() => {
    console.log(
      "🚀 ~ file: SongItem.jsx ~ line 8 ~ useEffect ~ player.playlists.length",
      player.playlists.length
    );
  }, [isPlaylistChange]);

  useEffect(() => {
    console.log(anchorEl, " : ", bigAnchorEl);
  }, [anchorEl, bigAnchorEl]);

  const setCurrentTrack = () => {
    dispatch(setTrack(data));
    player.togglePlayingChange();
    player.play(data);
  };

  const removeTrack = () => {
    // popupState.close;
    deleteTrack(data);
    bigHandleClose();
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
        <IconButton onClick={bigHandleClick}>
          <MdMenu size={32} />
        </IconButton>
        {/* Menu of the popupstate */}
        <Menu
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorEl={bigAnchorEl}
          open={bigOpen}
          onClose={bigHandleClose}
        >
          <MenuItem onClick={removeTrack}>
            Remove this song from library
          </MenuItem>
          {player.playlists.length > 0 && (
            <MenuItem onClick={handleClick}>
              Add to Playlist
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
                onClose={bigHandleClose}
              >
                <ColoredScrollbars
                  style={{
                    width: `150px`,
                  }}
                  autoHeight
                  autoHeightMax={150}
                >
                  {player.playlists.map((playlist) => (
                    <MenuItem
                      onClick={() => {
                        addToPlaylist(playlist.id, data);
                        bigHandleClose();
                      }}
                    >
                      <Typography
                        sx={{ overflowY: "auto", width: 100 }}
                        noWrap
                        color="text.secondary"
                      >
                        {playlist.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </ColoredScrollbars>
              </Menu>
            </MenuItem>
          )}
        </Menu>
      </ListItem>
      {/* </Box> */}
      {/* </Card> */}
    </>
  );
}

export default SongItem;
