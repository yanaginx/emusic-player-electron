import { Button, Toolbar, IconButton, Box } from "@mui/material";
import { MdHome } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { List } from "@mui/material";
import ColoredScrollbars from "../components/ColoredScrollbars";

import SongItem from "../components/SongItem";

const playerHeight = 200;

function Songs({ player }) {
  const [allSongs, setAllSongs] = useState(player.songs);
  const [playlists, setPlaylists] = useState(player.playlists);

  // console.log(
  //   "🚀 ~ file: Songs.jsx ~ line 10 ~ Songs ~ player.songs",
  //   player.songs
  // );

  const deleteTrack = (data) => {
    const deleteStatus = player.deleteFile(data.location);
    console.log(
      "🚀 ~ file: Songs.jsx ~ line 16 ~ Songs ~ deleteStatus",
      deleteStatus
    );
    if (deleteStatus) {
      player.deleteItem(data);
      setAllSongs(allSongs.filter((item) => item.id !== data.id));
    }
    player.saveProfiles();
    player.scanMusicDir();
  };

  const addToPlaylist = (playlistId, data) => {
    player.addToPlaylist(playlistId, data);
    player.saveProfiles();
  };

  return (
    <>
      <Box>
        {/* <Toolbar> */}
        {/* <Link to="/">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MdHome />
            </IconButton>
          </Link> */}
        {/* </Toolbar> */}
        {/* <Box sx={{ height: `100%`, overflowY: "auto" }}> */}
        {/* <List sx={{ height: `460px`, overflowY: "auto" }}> */}
        <ColoredScrollbars style={{ height: 460 }}>
          {allSongs.map((songData) => (
            <SongItem
              key={songData.id}
              data={songData}
              player={player}
              deleteTrack={deleteTrack}
              addToPlaylist={addToPlaylist}
              playlists={playlists}
            />
          ))}
        </ColoredScrollbars>
        {/* </List> */}
        {/* </Box> */}
      </Box>
    </>
  );
}

export default Songs;
