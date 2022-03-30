// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { Container, Box, Typography, Paper } from "@mui/material";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { Player } from "./models/player.js";
import { FileSystemInterface } from "./models/fsInterface.js";
import { Profile } from "./models/profile.js";

// Import components
import MusicPlayer from "./components/MusicPlayer";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Import pages
import Dashboard from "./pages/Dashboard";
import Fer from "./pages/Fer";
import Songs from "./pages/Songs";

const drawerWidth = 240;

function App() {
  console.log(
    "\r\n    __________  __    _____  ____________ \r\n   / ____/ __ \\/ /   /   \\ \\/ / ____/ __ \\\r\n  / __/ / /_/ / /   / /| |\\  / __/ / /_/ /\r\n / /___/ ____/ /___/ ___ |/ / /___/ _, _/ \r\n/_____/_/   /_____/_/  |_/_/_____/_/ |_|  \r\n                                          \r\n"
  );
  // const profile = useRef(new Profile());
  // const fsInterface = useRef(new FileSystemInterface());
  // const player = useRef(new Player(fsInterface.current, profile.current));
  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   console.log(
  //     "🚀 ~ file: App.jsx ~ line 25 ~ useEffect ~ player.current",
  //     player.current
  //   );
  //   player.current.loadProfiles();
  //   player.current.initialize();
  // }, []);
  const profile = new Profile();
  const fsInterface = new FileSystemInterface();
  const newPlayer = new Player(fsInterface, profile);
  const [player, setPlayer] = useState(newPlayer);

  useEffect(() => {
    newPlayer.loadProfiles();
    newPlayer.initialize();
    setPlayer(newPlayer);
  }, []);

  return (
    <>
      <Router>
        <Container>
          <Box sx={{ display: "flex" }}>
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
              <Sidebar />
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
              }}
            >
              <Routes>
                <Route
                  path="/"
                  // element={<Dashboard player={player.current} />}
                  element={<Dashboard player={player} />}
                />
                <Route path="/fer" element={<Fer />} />
                <Route
                  path="/all-songs"
                  // element={<Songs player={player.current} />}
                  element={<Songs player={player} />}
                />
              </Routes>
            </Box>
            <Box>
              <Paper
                sx={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1400,
                }}
                elevation={3}
              >
                {/* <MusicPlayer player={player.current} /> */}
                <MusicPlayer player={player} />
              </Paper>
              {/* <Navbar player={player.current} /> */}
              <Navbar player={player} />
            </Box>
          </Box>
        </Container>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
