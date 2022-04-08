import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//import components
import { CircularProgress, Typography, Box } from "@mui/material";

import { getEmotions, reset } from "../features/fer/ferSlice";

function Fer({ auth }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emotions, isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.fer
  );

  const [isCreated, setIsCreated] = useState(false);
  const [moodPlaylist, setMoodPlaylist] = useState(null);
  const [primaryEmo, setPrimaryEmo] = useState(null);

  const onMood = (emotion) => {
    navigate(`/create-playlist/${emotion}`);
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    } else {
      dispatch(getEmotions());
    }

    return () => dispatch(reset());
  }, [message, isError, dispatch]);

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
      console.log(
        "[DEBUG] The primary emotion: ",
        primaryEmotion?.id.toLowerCase()
      );
      setPrimaryEmo(primaryEmotion?.id.toLowerCase());
    }
  }, [emotions, dispatch]);

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
      <section className="heading">
        <h1>Emotions</h1>
        <p>Your detected emotions info:</p>
      </section>
      <section className="content">
        <ul>
          {emotions.map((emotion) => (
            <li key={emotion.id}>
              {emotion.id} : {emotion.counts}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Fer;
