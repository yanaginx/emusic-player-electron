import { Button } from "@mui/material";

function Navbar({ player }) {
  const pickMusic = (folder) => {
    let data = electron.playerApi.pickMusic(folder);

    for (let file of data) {
      console.log("🚀 ~ file: Navbar.jsx ~ line 8 ~ pickMusic ~ file", file);
    }
  };
  return (
    <>
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
    </>
  );
}

export default Navbar;
