import { Button, Toolbar, IconButton, Box } from "@mui/material";
import { MdHome } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import SongItem from "../components/SongItem";

function Songs({ player }) {
  const [allSongs, setAllSongs] = useState(player.songs);
  const [playlists, setPlaylists] = useState(player.playlists);

  console.log(
    "🚀 ~ file: Songs.jsx ~ line 10 ~ Songs ~ player.songs",
    player.songs
  );

  const deleteTrack = (data) => {
    player.deleteItem(data);
    setAllSongs(allSongs.filter((item) => item.id !== data.id));
  };

  const addToPlaylist = (playlistId, data) => {
    player.addToPlaylist(playlistId, data);
  };

  return (
    <>
      <Box sx={{ height: "100%", overflowY: "auto" }}>
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
        </Toolbar>
        <Box>
          {allSongs.map((songData) => (
            <SongItem
              key={songData.id.toString()}
              data={songData}
              player={player}
              deleteTrack={deleteTrack}
              addToPlaylist={addToPlaylist}
              playlists={playlists}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Songs;
