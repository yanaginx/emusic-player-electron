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
import { useDispatch, useSelector } from "react-redux";
import { EPlayerContext } from "../contexts/EPlayerContext";
import React from "react";
import {
  MdPlaylistAdd,
  MdOutlineRemove,
  MdQueueMusic,
  MdOutlineSettings,
  MdDashboard,
  MdOutlineSearch,
} from "react-icons/md";

import { setPlaylistChange } from "../features/playlistChange/playlistChangeSlice";

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
const drawerWidth = 210;

function Sidebar() {
  const dispatch = useDispatch();
  const { isPlaylistChange } = useSelector((state) => state.playlistChange);
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
    dispatch(setPlaylistChange(!isPlaylistChange));
    setPlaylistName("");
  };

  const removePlaylist = (playlist) => {
    setPlaylists(playlists.filter((item) => item.id !== playlist.id));
    player.deleteItem(playlist);
    dispatch(setPlaylistChange(!isPlaylistChange));
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
        PaperProps={{ elevation: 20 }}
      >
        <div>
          <Toolbar />
          <Divider />
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 1,
              my: 1,
            }}
          >
            
          </Box> */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <MenuItem sx={{ width: "100%", paddingX: 2, paddingY: 1 }}>
                <MdDashboard size={34} />
                <Typography sx={{ mx: 1, fontSize: 19, fontWeight: 450 }}>
                  Dashboard
                </Typography>
              </MenuItem>
            </Box>
          </Link>
          <Link to="/search" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <MenuItem sx={{ width: "100%", paddingX: 2, paddingY: 1 }}>
                <MdOutlineSearch size={34} />
                <Typography sx={{ mx: 1, fontSize: 19, fontWeight: 450 }}>
                  Search
                </Typography>
              </MenuItem>
            </Box>
          </Link>
          <Link to="/all-songs" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <MenuItem sx={{ width: "100%", paddingX: 2, paddingY: 1 }}>
                <MdQueueMusic size={34} />
                <Typography sx={{ mx: 1, fontSize: 19, fontWeight: 450 }}>
                  Library
                </Typography>
              </MenuItem>
            </Box>
          </Link>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <MenuItem
              onClick={handlePCModalOpen}
              sx={{ width: "100%", paddingX: 2, paddingY: 1 }}
            >
              <MdPlaylistAdd size={34} />
              <Typography sx={{ mx: 1, fontSize: 19, fontWeight: 450 }}>
                Add playlist
              </Typography>
            </MenuItem>
          </Box>
          <Divider />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Modal
              open={openPCModal}
              onClose={handlePCModalClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={{ ...modalStyle }}>
                <Typography sx={{ my: 1 }} variant="h6">
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
          <Box sx={{ height: `300px`, overflowY: "auto" }}>
            {playlists.map((playlist) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                key={playlist.id}
              >
                <Link
                  to={`/playlist/${playlist.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <MenuItem>
                    <Typography
                      sx={{ overflowY: "auto", width: 100 }}
                      noWrap="true"
                      color="text.secondary"
                    >
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
          </Box>

          {/* Settings */}
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              textAlign: "center",
              paddingBottom: "90px",
              width: drawerWidth,
            }}
          >
            <Link to={`/settings`} style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <MenuItem sx={{ width: "100%", paddingX: 2, paddingY: 1 }}>
                  <MdOutlineSettings size={32} />
                  <Typography sx={{ mx: 1 }} variant="h6">
                    Settings
                  </Typography>
                </MenuItem>
              </Box>
            </Link>
          </Box>
        </div>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
