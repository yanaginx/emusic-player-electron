import {
  Box,
  Divider,
  Drawer,
  Toolbar,
  MenuItem,
  Typography,
  Stack,
  IconButton,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useDeepCompareEffect } from "react-use";
import { EPlayerContext } from "../contexts/EPlayerContext";
import React from "react";
import {
  MdPlaylistAdd,
  MdOutlineRemove,
  MdQueueMusic,
  MdOutlineSettings,
} from "react-icons/md";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const drawerWidth = 240;

function Sidebar() {
  const player = useContext(EPlayerContext);
  // PC modal is for playlist creation
  const [openPCModal, setOpenPCModal] = useState(false);
  const handlePCModalOpen = () => {
    setOpenPCModal(true);
  };
  const handlePCModalClose = () => {
    setOpenPCModal(false);
  };
  // playlist name for playlist creation
  const [playlistName, setPlaylistName] = useState("");

  // playlist display
  const [playlists, setPlaylists] = useState(player.playlists);

  const addNewPlaylist = (name) => {
    player.createPlaylist(name);
    setOpenPCModal(false);
    setPlaylists(player.playlists);
  };

  const removePlaylist = (playlist) => {
    setPlaylists(playlists.filter((item) => item.id !== playlist.id));
    player.deleteItem(playlist);
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        <div>
          <Toolbar />
          <Divider />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 1,
              my: 1,
            }}
          >
            <MdQueueMusic size={24} />
            <Typography sx={{ mx: 1 }} variant="h5">
              My Music
            </Typography>
          </Box>
          <Link to="/all-songs" style={{ textDecoration: "none" }}>
            <MenuItem>
              <Typography variant="h6" color="text.secondary">
                All songs
              </Typography>
            </MenuItem>
          </Link>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ ml: 1, my: 1 }} variant="h5">
              All Playlists
            </Typography>
            <IconButton sx={{ mx: 2 }} size="small" onClick={handlePCModalOpen}>
              <MdPlaylistAdd size={24} />
            </IconButton>
            <Modal
              open={openPCModal}
              onClose={handlePCModalClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={{ ...modalStyle }}>
                <Typography sx={{ my: 1 }} variant="h5">
                  Create new playlist
                </Typography>
                <TextField
                  fullWidth
                  label="Name"
                  variant="standard"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                />
                <Button
                  onClick={() => {
                    addNewPlaylist(playlistName);
                  }}
                >
                  Create
                </Button>
              </Box>
            </Modal>
          </Box>
          {/* Playlist listing */}
          {playlists.map((playlist) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Link
                to={`/playlist/${playlist.id}`}
                style={{ textDecoration: "none" }}
              >
                <MenuItem>
                  <Typography variant="h6" color="text.secondary">
                    {playlist.name}
                  </Typography>
                </MenuItem>
              </Link>
              <IconButton
                sx={{ mx: 2 }}
                onClick={() => removePlaylist(playlist)}
              >
                <MdOutlineRemove size={24} />
              </IconButton>
            </Box>
          ))}
          {/* Settings */}
          <Link to={`/settings`} style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <MenuItem sx={{ width: "100%" }}>
                <MdOutlineSettings size={24} />
                <Typography sx={{ mx: 1 }} variant="h5">
                  Settings
                </Typography>
              </MenuItem>
            </Box>
          </Link>
        </div>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
