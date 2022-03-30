import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard({ player }) {
  const navigate = useNavigate();
  return (
    <>
      <Typography variant="h1">Hello from Eplayer!</Typography>;
      <Button
        onClick={() => {
          player.pickMusic(true);
        }}
      >
        Click for choosing folder
      </Button>
      <Button
        onClick={() => {
          player.pickMusic(false);
        }}
      >
        Click for choosing file
      </Button>
      <Button
        onClick={() => {
          player.saveProfiles();
        }}
      >
        Save profiles
      </Button>
      <Button
        onClick={() => {
          navigate("/fer");
        }}
      >
        Emotion recognition
      </Button>
    </>
  );
}

export default Dashboard;
