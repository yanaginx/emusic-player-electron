import { useState, useEffect, useRef } from "react";

import { styled, useTheme } from "@mui/material/styles";
import { FaFastBackward, FaFastForward, FaPlay, FaPause } from "react-icons/fa";
import {
  MdVolumeUp,
  MdVolumeDown,
  MdVolumeMute,
  MdVolumeOff,
} from "react-icons/md";
import {
  Stack,
  Slider,
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: "90%",
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  alignItems: "center",
  zIndex: 1,
  backgroundColor: "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
}));

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
  duration_ms: 0,
};

function MusicPlayer(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  // const duration = 200;
  const [duration, setDuration] = useState(-2);
  const [position, setPosition] = useState(-1);

  const handleVolumeChange = (e, value) => {
    setVolume(value);
  };

  const handlePositionChange = (e, value) => {
    setPosition(value);
  };

  const formatDuration = (value) => {
    if (value < 0) return null;
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft <= 9 ? `0${secondLeft}` : secondLeft}`;
  };

  return (
    <>
      <Widget>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          {/* Track and artist name */}
          <Box sx={{ width: 300, overflow: "auto" }}>
            <Typography variant="h6">Name</Typography>
            <Typography variant="button">Artist</Typography>
          </Box>
          {/* controllers */}
          <Stack direction="row" alignItems="center">
            <IconButton size="large" onClick={() => {}}>
              <FaFastBackward size={24} />
            </IconButton>
            <IconButton size="large" onClick={() => {}}>
              {!isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}
            </IconButton>
            <IconButton size="large" onClick={() => {}}>
              <FaFastForward size={24} />
            </IconButton>
          </Stack>
          {/* progress bar */}
          <Box sx={{ width: 600 }}>
            <Slider
              aria-label="time-indicator"
              size="small"
              value={position}
              min={0}
              step={1}
              max={duration}
              onChange={handlePositionChange}
              sx={{
                height: 4,
                "& .MuiSlider-thumb": {
                  width: 8,
                  height: 8,
                  transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                  "&:before": {
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  },
                  "&.Mui-active": {
                    width: 20,
                    height: 20,
                  },
                },
                "& .MuiSlider-rail": {
                  opacity: 0.28,
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: -2,
              }}
            >
              <TinyText>{formatDuration(position)}</TinyText>
              <TinyText>-{formatDuration(duration - position)}</TinyText>
            </Box>
          </Box>
          {/* volume slider */}
          <Stack
            spacing={2}
            direction="row"
            sx={{ width: 150, mb: 1 }}
            alignItems="center"
          >
            {(() => {
              if (volume === 0) {
                return <MdVolumeOff size={24} />;
              } else if (volume > 0 && volume <= 25) {
                return <MdVolumeMute size={24} />;
              } else if (volume > 25 && volume <= 75) {
                return <MdVolumeDown size={24} />;
              } else {
                return <MdVolumeUp size={24} />;
              }
            })()}
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={handleVolumeChange}
            />
          </Stack>
        </Stack>
      </Widget>
    </>
  );
}

export default MusicPlayer;
