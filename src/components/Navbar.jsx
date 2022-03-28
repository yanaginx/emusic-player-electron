import { Button } from "@mui/material";

function Navbar() {
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
          pickMusic(true);
        }}
      >
        Click for choosing folder
      </Button>
      <Button
        onClick={() => {
          pickMusic(false);
        }}
      >
        Click for choosing file
      </Button>
    </>
  );
}

export default Navbar;
