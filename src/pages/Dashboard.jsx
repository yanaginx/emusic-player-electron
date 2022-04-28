import {
  Typography,
  Button,
  Stack,
  Menu,
  MenuItem,
  Fade,
  Box,
} from "@mui/material";
import ColoredScrollbars from "../components/ColoredScrollbars";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdLibraryAdd,
  MdSaveAlt,
  MdArrowDropDown,
  MdOutlineEmojiEmotions,
  MdSettings,
} from "react-icons/md";
import { toast } from "react-toastify";

import { scanUsbAndCopy, reset } from "../features/scanDir/scanDirSlice";

function Dashboard({ player }) {
  const dispatch = useDispatch();
  const { isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.scanDir
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleAddSongClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAddSongClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  useEffect(() => {
    if (isSuccess) {
      toast.info("Scanning Music directory...");
      player.scanMusicDir();
      player.saveProfiles();
      toast.info("Finish scanning music directory");
    }
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, dispatch]);

  const navigate = useNavigate();
  return (
    <>
      <Box justifyContent="center" alignItems="center">
        <Typography variant="h2">Dashboard</Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
          my={6}
        >
          <Button
            onClick={handleAddSongClick}
            variant="outlined"
            startIcon={<MdLibraryAdd size={32} />}
            endIcon={<MdArrowDropDown size={32} />}
            fullWidth
          >
            <Typography variant="h3">Add Songs</Typography>
          </Button>
          {/* Add songs menu */}
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleAddSongClose}
            TransitionComponent={Fade}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => {
                player.pickMusic(false);
                handleAddSongClose();
              }}
            >
              Add by files...
            </MenuItem>
            <MenuItem
              onClick={() => {
                player.pickMusic(true);
                handleAddSongClose();
              }}
            >
              Add by folders...
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(scanUsbAndCopy());
                handleAddSongClose();
              }}
            >
              Scan music directory...
            </MenuItem>
          </Menu>
          <Button
            onClick={() => {
              player.saveProfiles();
            }}
            variant="outlined"
            startIcon={<MdSaveAlt size={32} />}
            fullWidth
          >
            <Typography variant="h3">Save profile</Typography>
          </Button>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
          my={6}
        >
          <Button
            onClick={() => {
              navigate("/fer");
            }}
            startIcon={<MdOutlineEmojiEmotions size={32} />}
            variant="outlined"
            fullWidth
          >
            <Typography variant="h3">Emotion Recognition</Typography>
          </Button>
          <Button
            onClick={() => {
              navigate("/settings");
            }}
            startIcon={<MdSettings size={32} />}
            variant="outlined"
            fullWidth
          >
            <Typography variant="h3">Settings</Typography>
          </Button>
        </Stack>
      </Box>
    </>
  );
}

export default Dashboard;
