import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Box, Typography, Paper } from "@mui/material";
import "./App.css";

import { Player } from "./models/player.js";
import { FileSystemInterface } from "./models/fsInterface.js";
import { Profile } from "./models/profile.js";

// Import components
import MusicPlayer from "./components/MusicPlayer";
import Navbar from "./components/Navbar";

function App() {
  console.log(
    "\r\n    __________  __    _____  ____________ \r\n   / ____/ __ \\/ /   /   \\ \\/ / ____/ __ \\\r\n  / __/ / /_/ / /   / /| |\\  / __/ / /_/ /\r\n / /___/ ____/ /___/ ___ |/ / /___/ _, _/ \r\n/_____/_/   /_____/_/  |_/_/_____/_/ |_|  \r\n                                          \r\n"
  );
  const profile = useRef(new Profile());
  const fsInterface = useRef(new FileSystemInterface());
  const player = useRef(new Player(fsInterface.current, profile.current));
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(
      "🚀 ~ file: App.jsx ~ line 25 ~ useEffect ~ player.current",
      player.current
    );
    player.current.loadProfiles();
    player.current.initialize();
  }, []);

  return (
    <>
      <Router>
        <Container>
          <Box>
            <Typography variant="h1">Hello from Eplayer!</Typography>
            <Paper
              sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <MusicPlayer player={player.current} />
            </Paper>
            <Navbar player={player.current} />
          </Box>
        </Container>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
