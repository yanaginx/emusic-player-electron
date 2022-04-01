import { Button, Toolbar, IconButton, Box } from "@mui/material";
import { MdHome } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

function Playlists({ player }) {
  console.log(
    "🚀 ~ file: Playlists.jsx ~ line 9 ~ Playlists ~ player.playlists",
    player.playlists
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
      <Box></Box>
    </>
  );
}

export default Playlists;
