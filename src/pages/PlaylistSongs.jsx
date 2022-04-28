import {
  Button,
  Toolbar,
  IconButton,
  Box,
  List,
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTrack, reset } from "../features/track/trackSlice";
import { MdPlayCircle, MdHome } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import ColoredScrollbars from "../components/ColoredScrollbars";

import PlaylistSongItem from "../components/PlaylistSongItem";

import { setPlaylistChange } from "../features/playlistChange/playlistChangeSlice";

const playerHeight = 200;

function PlaylistSongs({ player }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isPlaylistChange } = useSelector((state) => state.playlistChange);
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(
    player.playlists.find((playlist) => playlist.id == playlistId)
  );
  const [allSongs, setAllSongs] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handlePMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePMenuClose = () => {
    setAnchorEl(null);
  };

  // console.log(
  //   "🚀 ~ file: PlaylistSongs.jsx ~ line 14 ~ PlaylistSongs ~ allSongs",
  //   allSongs
  // );

  const goToLibrary = () => {
    navigate("/all-songs");
  };

  const goToDashboard = () => {
    navigate("/");
  };

  const removePlaylist = () => {
    handlePMenuClose();
    player.deleteItem(playlist);
    player.saveProfiles();
    dispatch(setPlaylistChange(!isPlaylistChange));
    goToDashboard();
  };

  useEffect(() => {
    setPlaylist(player.playlists.find((playlist) => playlist.id == playlistId));
    // console.log(
    //   "🚀 ~ file: PlaylistSongs.jsx ~ line 19 ~ useEffect ~ playlistId",
    //   playlistId
    // );
  }, [playlistId]);

  useEffect(() => {
    if (!playlist) return;
    setAllSongs(playlist.content);
    // console.log(
    //   "🚀 ~ file: PlaylistSongs.jsx ~ line 14 ~ PlaylistSongs ~ playlist.content",
    //   playlist.content
    // );
  }, [playlist]);

  const deleteTrack = (data) => {
    player.removeFromPlaylist(playlistId, data);
    // setPlaylist(player.playlists.find((playlist) => playlist.id == playlistId));
    setAllSongs(allSongs.filter((item) => item.id !== data.id));
  };

  const playPlaylist = () => {
    player.loadList(playlist);
    player.setPlaying(player.queue[player.currentIndex]);
    player.togglePlayingChange();
    // console.log(
    //   "🚀 ~ file: PlaylistSongs.jsx ~ line 49 ~ playPlaylist ~ player.queue[player.currentIndex]",
    //   player.queue[player.currentIndex]
    // );
    dispatch(setTrack(player.playing));
    // console.log(
    //   "🚀 ~ file: PlaylistSongs.jsx ~ line 54 ~ playPlaylist ~ player.playing",
    //   player.playing
    // );
  };

  return (
    <>
      <Box>
        <Toolbar>
          <Box sx={{ width: "50%" }}>
            {allSongs.length > 0 ? (
              <IconButton
                size="large"
                edge="end"
                aria-label="menu"
                onClick={playPlaylist}
              >
                <MdPlayCircle size="50" />
              </IconButton>
            ) : (
              <></>
            )}
            <IconButton onClick={handlePMenuOpen} edge="end" aria-label="menu">
              <BsThreeDots size="30" />
            </IconButton>
          </Box>

          <Stack>
            <Typography variant="h6">{playlist.name}</Typography>
          </Stack>
        </Toolbar>
        <Menu anchorEl={anchorEl} open={open} onClose={handlePMenuClose}>
          <MenuItem onClick={removePlaylist}>Delete</MenuItem>
          <MenuItem>Emotion map</MenuItem>
        </Menu>
        {/* <Box sx={{ height: `600px`, overflowY: "auto" }}> */}
        {allSongs.length === 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              minHeight="100vh - 90rem"
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h6">
                    This playlist have no songs. Adding one by going to the
                    library and select your preferences
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" onClick={goToLibrary}>
                    Go to library
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </>
        ) : (
          // <Box sx={{ height: `470px`, overflowY: "auto" }}>
          <ColoredScrollbars style={{ height: 400 }}>
            {playlist?.content.map((songData) => (
              <PlaylistSongItem
                key={songData.id}
                data={songData}
                player={player}
                playlist={playlist}
                deleteTrack={deleteTrack}
              />
            ))}
          </ColoredScrollbars>
        )}
        {/* </Box> */}
      </Box>
    </>
  );
}

export default PlaylistSongs;
