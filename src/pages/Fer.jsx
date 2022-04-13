import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//import components
import {
  CircularProgress,
  Typography,
  Box,
  Card,
  Button,
  CardContent,
  CardActions,
} from "@mui/material";

import { getEmotions, reset } from "../features/fer/ferSlice";
import { setTrack } from "../features/track/trackSlice";

function Fer({ player }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emotions, isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.fer
  );

  const [isExisted, setIsExisted] = useState(false);
  const [moodPlaylist, setMoodPlaylist] = useState(null);
  const [primaryEmo, setPrimaryEmo] = useState(null);

  // function for finding playlist
  const findMoodPlaylist = (emotion) => {
    const playlistId = player.playlistMap[emotion];
    if (playlistId) {
      const playlist = player.playlists.find(
        (playlist) => playlist.id == playlistId
      );
      setMoodPlaylist(playlist);
      setIsExisted(true);
    }
  };

  // function for loading playlist and play it
  const playMoodPlaylist = () => {
    player.loadList(moodPlaylist);
    dispatch(setTrack(player.playing));
  };

  const onMood = (emotion) => {
    navigate(`/create-playlist/${emotion}`);
  };

  const reloadPage = () => {
    dispatch(reset());
    dispatch(getEmotions());
    navigate("/fer");
  };

  const onNoPlaylist = () => {
    navigate("/settings");
  };

  useEffect(() => {
    dispatch(getEmotions());
    return () => dispatch(reset());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      let primaryEmotion = emotions.find((o) => {
        return (
          o.counts ===
          Math.max.apply(
            Math,
            emotions.map(function (o) {
              return o.counts;
            })
          )
        );
      });
      // console.log(
      //   "[DEBUG] The primary emotion: ",
      //   primaryEmotion?.id.toLowerCase()
      // );
      setPrimaryEmo(primaryEmotion?.id.toLowerCase());
      findMoodPlaylist(primaryEmotion?.id.toLowerCase());
    }
  }, [emotions, dispatch]);

  // playing the playlist if loaded
  useEffect(() => {
    if (!moodPlaylist) return;
    playMoodPlaylist();
  }, [moodPlaylist]);

  if (isError) {
    toast.error(message);
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          minHeight="100vh - 200px"
        >
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Something went wrong. Please try again.
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={reloadPage} size="small">
                Try again
              </Button>
            </CardActions>
          </Card>
        </Box>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Box
          sx={{
            zIndex: 5000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <CircularProgress />
          <Typography variant="h4">
            Getting your current emotion, please wait...
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        // minHeight="100vh"
        my={4}
      >
        <Typography variant="h4">Emotion recognition result:</Typography>
      </Box>
      <Box marginBottom={6} marginTop={3}>
        <Typography variant="h5">
          We detected your current emotion is {primaryEmo}
        </Typography>
      </Box>
      <Box></Box> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        height="600px"
      >
        <Card>
          <CardContent>
            <Typography variant="h3">Emotion recognition result:</Typography>
            <Typography variant="h5">
              We detected your current emotion is {primaryEmo}
            </Typography>
            {isExisted ? (
              <></>
            ) : (
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Currently there is no playlist chosen this current emotion. You
                can choose one by setting up your preferences.
              </Typography>
            )}
          </CardContent>
          {isExisted ? (
            <CardContent>
              <Typography variant="h5">
                Playling the {moodPlaylist.name} playlist for this emotion
              </Typography>
            </CardContent>
          ) : (
            <CardActions>
              <Button onClick={onNoPlaylist} variant="contained">
                Go to settings
              </Button>
            </CardActions>
          )}
        </Card>
      </Box>
    </>
  );
}

export default Fer;
