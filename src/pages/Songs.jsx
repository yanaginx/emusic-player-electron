import { Button, Toolbar, IconButton, Box } from "@mui/material";
import { MdHome } from "react-icons/md";
import { Link } from "react-router-dom";

import SongItem from "../components/SongItem";

function Songs({ player }) {
  console.log(
    "🚀 ~ file: Songs.jsx ~ line 8 ~ Songs ~ player.profile.data.songs",
    player.profile.data.songs
  );
  return (
    <>
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
        {player.profile.data.songs.map((songData) => (
          <SongItem key={songData.id} data={songData} player={player} />
        ))}
      </Box>
    </>
  );
}

export default Songs;
