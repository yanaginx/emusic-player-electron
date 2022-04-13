import {
  Box,
  Typography,
  Divider,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { useState } from "react";

function Settings({ player }) {
  // playlist value for 5 types of emotion
  const [happy, setHappy] = useState(player.playlistMap.happy);
  const [sad, setSad] = useState(player.playlistMap.sad);
  const [angry, setAngry] = useState(player.playlistMap.angry);
  const [neutral, setNeutral] = useState(player.playlistMap.neutral);
  const [surprise, setSurprise] = useState(player.playlistMap.surprise);

  const handleHappyPlaylist = (event) => {
    setHappy(event.target.value);
    // console.log(
    //   "🚀 ~ file: Settings.jsx ~ line 22 ~ handleHappyPlaylist ~ event.target.value",
    //   event.target.value
    // );
    player.mapMood("happy", event.target.value);
  };
  const handleSadPlaylist = (event) => {
    setSad(event.target.value);
    // console.log(
    //   "🚀 ~ file: Settings.jsx ~ line 30 ~ handleSadPlaylist ~ event.target.value",
    //   event.target.value
    // );
    player.mapMood("sad", event.target.value);
  };
  const handleAngryPlaylist = (event) => {
    setAngry(event.target.value);
    // console.log(
    //   "🚀 ~ file: Settings.jsx ~ line 37 ~ handleAngryPlaylist ~ event.target.value",
    //   event.target.value
    // );
    player.mapMood("angry", event.target.value);
  };
  const handleSurprisePlaylist = (event) => {
    setSurprise(event.target.value);
    // console.log(
    //   "🚀 ~ file: Settings.jsx ~ line 44 ~ handleSurprisePlaylist ~ event.target.value",
    //   event.target.value
    // );
    player.mapMood("surprise", event.target.value);
  };
  const handleNeutralPlaylist = (event) => {
    setNeutral(event.target.value);
    // console.log(
    //   "🚀 ~ file: Settings.jsx ~ line 51 ~ handleNeutralPlaylist ~ event.target.value",
    //   event.target.value
    // );
    player.mapMood("neutral", event.target.value);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        // minHeight="100vh"
        my={4}
      >
        <Typography variant="h3">Settings</Typography>
      </Box>
      <Divider />
      <Box marginBottom={6} marginTop={3}>
        <Typography marginBottom={2} variant="h5">
          Emotion-based playlist option
        </Typography>
        {/* Happy mood playlist select */}
        <Box my={2}>
          <FormControl sx={{ width: "50%" }}>
            <InputLabel id="happy-mood-playlist-selector">
              Happy mood
            </InputLabel>
            <Select
              labelId="happy-mood-playlist-selector"
              id="happy-mood-selector"
              value={happy}
              label="Happy mood"
              onChange={handleHappyPlaylist}
            >
              {player.playlists.map((playlist) => (
                <MenuItem value={playlist.id}>{playlist.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Sad mood playlist select */}
        <Box my={2}>
          <FormControl sx={{ width: "50%" }}>
            <InputLabel id="sad-mood-playlist-selector">Sad mood</InputLabel>
            <Select
              labelId="sad-mood-playlist-selector"
              id="sad-mood-selector"
              value={sad}
              label="Sad mood"
              onChange={handleSadPlaylist}
            >
              {player.playlists.map((playlist) => (
                <MenuItem value={playlist.id}>{playlist.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Surprise mood playlist select */}
        <Box my={2}>
          <FormControl sx={{ width: "50%" }}>
            <InputLabel id="surprise-mood-playlist-selector">
              Surprise mood
            </InputLabel>
            <Select
              labelId="surprise-mood-playlist-selector"
              id="surprise-mood-selector"
              value={surprise}
              label="Surprise mood"
              onChange={handleSurprisePlaylist}
            >
              {player.playlists.map((playlist) => (
                <MenuItem value={playlist.id}>{playlist.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Angry mood playlist select */}
        <Box my={2}>
          <FormControl sx={{ width: "50%" }}>
            <InputLabel id="angry-mood-playlist-selector">
              Angry mood
            </InputLabel>
            <Select
              labelId="angry-mood-playlist-selector"
              id="angry-mood-selector"
              value={angry}
              label="Angry mood"
              onChange={handleAngryPlaylist}
            >
              {player.playlists.map((playlist) => (
                <MenuItem value={playlist.id}>{playlist.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Neutral mood playlist select */}
        <Box my={2}>
          <FormControl sx={{ width: "50%" }}>
            <InputLabel id="neutral-mood-playlist-selector">
              Neutral mood
            </InputLabel>
            <Select
              labelId="neutral-mood-playlist-selector"
              id="neutral-mood-selector"
              value={neutral}
              label="Neutral mood"
              onChange={handleNeutralPlaylist}
            >
              {player.playlists.map((playlist) => (
                <MenuItem value={playlist.id}>{playlist.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}

export default Settings;
