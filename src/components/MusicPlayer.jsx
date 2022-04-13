import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import { setTrack, reset } from "../features/track/trackSlice";

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
import ReactAudioPlayer from "react-audio-player";

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
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(player.isShuffle);
  const [isRepeat, setIsRepeat] = useState(player.isRepeat);
  const [volume, setVolume] = useState(100);
  // const duration = 200;
  const [duration, setDuration] = useState(-1);
  const [position, setPosition] = useState(-1);
  const [name, setName] = useState(player.playing?.name);
  const [artist, setArtist] = useState(player.playing?.author);
  const { track } = useSelector((state) => state.trackRedux);
  const dispatch = useDispatch();

  // references
  const audioPlayer = useRef(); // references to the audio components

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
        setPosition(0);
        setIsPlaying(false);
        audioPlayer.current.pause();
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

  // const togglePlayPause = () => {
  //   return audioPlayer.current.paused
  //     ? audioPlayer.current.play()
  //     : audioPlayer.current.pause();
  // };

  // DEBUG
  // useEffect(() => {
  //   console.log(
  //     "🚀 ~ file: MusicPlayer.jsx ~ line 64 ~ useEffect ~ player",
  //     player
  //   );
  //   console.log(
  //     "🚀 ~ file: MusicPlayer.jsx ~ line 68 ~ useEffect ~ player.interface",
  //     player.interface.info.duration
  //   );
  //   console.log(
  //     "🚀 ~ file: MusicPlayer.jsx ~ line 7 ~ MusicPlayer ~ track",
  //     track
  //   );
  // }, [track]);
  // END : DEBUG

  // useEffect(() => {
  //   console.log(
  //     "🚀 ~ file: MusicPlayer.jsx ~ line 80 ~ useEffect ~ player.interface.audio?.info.duration",
  //     player.interface.audio?.duration
  //   );
  //   setDuration(player.interface.info.duration);

  //   console.log(
  //     "🚀 ~ file: MusicPlayer.jsx ~ line 81 ~ useEffect ~ player.interface.info.duration",
  //     player.interface.info.duration
  //   );
  //   setName(player.playing?.name);
  //   console.log(
  //     "🚀 ~ file: MusicPlayer.jsx ~ line 86 ~ useEffect ~ player.playing?.name",
  //     player.playing?.name
  //   );
  //   setArtist(player.playing?.author);
  //   console.log(
  //     "🚀 ~ file: MusicPlayer.jsx ~ line 91 ~ useEffect ~ player.playing?.author",
  //     player.playing?.author
  //   );
  // }, [track]);

  useEffect(() => {
    if (player.playing) {
      // setIsPlaying(player.interface.info.playing);
      // console.log(
      //   "🚀 ~ file: MusicPlayer.jsx ~ line 104 ~ useEffect ~ player.playing",
      //   player.playing
      // );
      setName(player.playing.name);
      setArtist(player.playing.author);
      setIsPlaying(true);
    }
  }, [player.playing]);

  const handleVolumeChange = (e, value) => {
    setVolume(value);
    audioPlayer.current.volume = value / 100;
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
          <Box sx={{ width: 300 }}>
            <Typography variant="h6" noWrap="true">
              {name}
            </Typography>
            <Typography variant="button">{artist}</Typography>
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
