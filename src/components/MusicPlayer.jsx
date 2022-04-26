import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import { setTrack, reset } from "../features/track/trackSlice";
import {
  getVolume,
  setVolume,
  resetVolume,
} from "../features/volume/volumeSlice";

import { FaFastBackward, FaFastForward, FaPlay, FaPause } from "react-icons/fa";
import {
  MdVolumeUp,
  MdVolumeDown,
  MdVolumeMute,
  MdVolumeOff,
  MdShuffle,
  MdReplay,
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

function MusicPlayer({ player }) {
  // Initial state for the volume related
  const {
    systemVolume,
    isLoadingGet,
    isSuccessGet,
    isErrorGet,
    isLoadingSet,
    isSuccessSet,
    isErrorSet,
  } = useSelector((state) => state.volume);

  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(player.isShuffle);
  const [isRepeat, setIsRepeat] = useState(player.isRepeat);
  // const [volume, setVolume] = useState(100);
  const [currVolume, setCurrVolume] = useState(100);
  // const duration = 200;
  const [duration, setDuration] = useState(-1);
  const [position, setPosition] = useState(-1);
  const [name, setName] = useState(player.playing?.name);
  const [artist, setArtist] = useState(player.playing?.author);
  const { track } = useSelector((state) => state.trackRedux);
  const dispatch = useDispatch();

  // references
  const audioPlayer = useRef(); // references to the audio components

  // fetching the audio volume from the system by 0.5 second interval
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO
      // requesting server for volume info
      dispatch(getVolume());
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // callback for metadata
  const onLoadedMetadata = (e) => {
    if (audioPlayer.current) {
      setDuration(audioPlayer.current.duration);
      setPosition(0);
    }
  };

  const onEnded = (e) => {
    if (audioPlayer.current) {
      if (
        player.queue.length > 0 &&
        player.currentIndex < player.queue.length
      ) {
        player.next();
        dispatch(setTrack(player.playing));
      } else {
        if (isRepeat) {
          setPosition(0);
          audioPlayer.current.play();
        } else {
          setPosition(0);
          setIsPlaying(false);
          audioPlayer.current.pause();
        }
      }
    }
  };

  const onTimeUpdate = (e) => {
    if (audioPlayer.current) {
      setPosition(Math.floor(audioPlayer.current.currentTime));
    }
  };

  const togglePlayPause = () => {
    const prevState = isPlaying;
    setIsPlaying(!prevState);
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
    }
  };

  const toggleShuffle = () => {
    const prevState = isShuffle;
    setIsShuffle(!prevState);
    player.toggleShuffle();
  };

  const toggleRepeat = () => {
    const prevState = isRepeat;
    setIsRepeat(!prevState);
    player.toggleRepeat();
  };

  useEffect(() => {
    if (player.playing) {
      // console.log(
      //   "🚀 ~ file: MusicPlayer.jsx ~ line 104 ~ useEffect ~ player.playing",
      //   player.playing
      // );
      setName(player.playing.name);
      setArtist(player.playing.author);
      setIsPlaying(true);
      audioPlayer.current.load();
      console.log(
        "🚀 ~ file: MusicPlayer.jsx ~ line 183 ~ MusicPlayer ~ player.playingChange",
        player.playingChange
      );
    }
  }, [player.playing, player.playingChange]);

  const handleVolumeChange = (e, value) => {
    setCurrVolume(value);
    // audioPlayer.current.volume = value / 100;
    dispatch(
      setVolume({
        volume: value,
      })
    );
  };

  const handlePositionChange = (e, value) => {
    setPosition(value);
    audioPlayer.current.currentTime = value;
  };

  const onNext = () => {
    player.next();
    dispatch(setTrack(player.playing));
  };

  const onPrevious = () => {
    player.previous();
    dispatch(setTrack(player.playing));
  };

  const formatDuration = (value) => {
    if (value < 0) return null;
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft <= 9 ? `0${secondLeft}` : secondLeft}`;
  };

  return (
    <>
      {/* <ReactAudioPlayer
        src={player.playing?.location}
        autoPlay
        controls
      ></ReactAudioPlayer> */}
      <div>
        <audio
          ref={audioPlayer}
          src={player.playing?.location}
          autoPlay
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate}
        ></audio>
      </div>
      <Widget>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          {/* Track and artist name */}
          <Box sx={{ maxWidth: 200 }}>
            <Typography sx={{ width: 200 }} variant="h6" noWrap="true">
              {name}
            </Typography>
            <Typography variant="button" noWrap="true">
              {artist}
            </Typography>
          </Box>
          {/* controllers */}
          <Stack direction="row" alignItems="center">
            {isShuffle ? (
              <IconButton size="small" color="primary" onClick={toggleShuffle}>
                <MdShuffle />
              </IconButton>
            ) : (
              <IconButton size="small" onClick={toggleShuffle}>
                <MdShuffle />
              </IconButton>
            )}
            <IconButton size="large" onClick={onPrevious}>
              <FaFastBackward size={24} />
            </IconButton>
            <IconButton size="large" onClick={togglePlayPause}>
              {isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}
            </IconButton>
            <IconButton size="large" onClick={onNext}>
              <FaFastForward size={24} />
            </IconButton>
            {isRepeat ? (
              <IconButton size="small" color="primary" onClick={toggleRepeat}>
                <MdReplay />
              </IconButton>
            ) : (
              <IconButton size="small" onClick={toggleRepeat}>
                <MdReplay />
              </IconButton>
            )}
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
              <TinyText>
                -{formatDuration(Math.floor(duration) - position)}
              </TinyText>
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
              if (systemVolume?.volume === 0) {
                return <MdVolumeOff size={24} />;
              } else if (
                systemVolume?.volume > 0 &&
                systemVolume?.volume <= 25
              ) {
                return <MdVolumeMute size={24} />;
              } else if (
                systemVolume?.volume > 25 &&
                systemVolume?.volume <= 75
              ) {
                return <MdVolumeDown size={24} />;
              } else {
                return <MdVolumeUp size={24} />;
              }
            })()}
            <Slider
              aria-label="Volume"
              value={systemVolume ? systemVolume.volume : 0}
              onChange={handleVolumeChange}
            />
          </Stack>
        </Stack>
      </Widget>
    </>
  );
}

export default MusicPlayer;
