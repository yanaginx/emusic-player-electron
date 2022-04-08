import { Button, Toolbar, IconButton, Box, List } from "@mui/material";
import { MdHome } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTrack, reset } from "../features/track/trackSlice";
import { MdPlayCircle } from "react-icons/md";

import PlaylistSongItem from "../components/PlaylistSongItem";

const playerHeight = 200;

function PlaylistSongs({ player }) {
  const dispatch = useDispatch();
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  // console.log(
  //   "🚀 ~ file: PlaylistSongs.jsx ~ line 14 ~ PlaylistSongs ~ allSongs",
  //   allSongs
  // );

  useEffect(() => {
    setPlaylist(player.playlists.find((playlist) => playlist.id == playlistId));
    console.log(
      "🚀 ~ file: PlaylistSongs.jsx ~ line 19 ~ useEffect ~ playlistId",
      playlistId
    );
  }, [playlistId]);

  useEffect(() => {
    if (!playlist) return;
    setAllSongs(playlist.content);
    console.log(
      "🚀 ~ file: PlaylistSongs.jsx ~ line 14 ~ PlaylistSongs ~ playlist.content",
      playlist.content
    );
  }, [playlist]);

  const deleteTrack = (data) => {
    player.removeFromPlaylist(playlistId, data);
    // setPlaylist(player.playlists.find((playlist) => playlist.id == playlistId));
    setAllSongs(allSongs.filter((item) => item.id !== data.id));
  };

  const playPlaylist = () => {
    player.loadList(playlist);
    dispatch(setTrack(player.playing));
  };

  return (
    <>
      <Box>
        <Toolbar>
          <Link to="/">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MdHome />
            </IconButton>
          </Link>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={playPlaylist}
          >
            <MdPlayCircle size="50" />
          </IconButton>
        </Toolbar>
        {/* <Box sx={{ height: `600px`, overflowY: "auto" }}> */}
        <Box sx={{ height: `600px`, overflowY: "auto" }}>
          {playlist?.content.map((songData) => (
            <PlaylistSongItem
              key={songData.id}
              data={songData}
              player={player}
              deleteTrack={deleteTrack}
            />
          ))}
        </Box>
        {/* </Box> */}
      </Box>
    </>
  );
}

export default PlaylistSongs;
