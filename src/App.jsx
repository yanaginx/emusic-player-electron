// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { Container, Box, Typography, Paper } from "@mui/material";
import "./App.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { Player } from "./models/player.js";
import { FileSystemInterface } from "./models/fsInterface.js";
import { Profile } from "./models/profile.js";
import { ePlayer } from "./models/ePlayer.js";

import { EPlayerContext } from "./contexts/EPlayerContext";

import useConstructor from "./use.constructor";

// Import components
import MusicPlayer from "./components/MusicPlayer";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Import pages
import Dashboard from "./pages/Dashboard";
import Fer from "./pages/Fer";
import Songs from "./pages/Songs";
import PlaylistSongs from "./pages/PlaylistSongs";
import Settings from "./pages/Settings";
import Search from "./pages/Search";

// Theme setup
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f06292",
      // main: "#000000",
    },
    secondary: {
      main: "#3e6990",
    },
    success: {
      main: "#40f99b",
    },
  },
  typography: {
    fontFamily: "Inter",
  },
  spacing: 8,
  shape: {
    borderRadius: 10,
  },
  props: {
    MuiAppBar: {
      color: "default",
    },
  },
});

theme = responsiveFontSizes(theme);

const drawerWidth = 210;

let player = null;

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
  //     "???? ~ file: App.jsx ~ line 25 ~ useEffect ~ player.current",
  //     player.current
  //   );
  //   player.current.loadProfiles();
  //   player.current.initialize();
  // }, []);

  // const [player, setPlayer] = useState(newPlayer);

  // useConstructor(() => {
  //   player = new ePlayer();
  //   // player.initialize();
  //   console.log(
  //     "This only happens ONCE and it happens BEFORE the initial render."
  //   );
  // });

  useConstructor(() => {
    player = useContext(EPlayerContext);
    // player = new ePlayer();

    console.log(
      "This only happens ONCE and it happens BEFORE the initial render."
    );
  });

  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container sx={{ height: "100%" }}>
            <Box sx={{ display: "flex" }}>
              <Box
                component="nav"
                // sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                sx={{ width: drawerWidth }}
                aria-label="mailbox folders"
              >
                <Sidebar player={player} />
              </Box>
              <Box
                component="main"
                sx={{
                  p: 2,
                  width: "100%",
                }}
              >
                <Routes>
                  <Route
                    path="/"
                    // element={<Dashboard player={player.current} />}
                    element={<Dashboard player={player} />}
                  />
                  <Route path="/fer" element={<Fer player={player} />} />
                  <Route
                    path="/all-songs"
                    // element={<Songs player={player.current} />}
                    element={<Songs player={player} />}
                  />
                  <Route
                    path="/playlist/:playlistId"
                    element={<PlaylistSongs player={player} />}
                  />
                  <Route
                    path="/settings"
                    element={<Settings player={player} />}
                  />
                  <Route path="/search" element={<Search player={player} />} />
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
        </ThemeProvider>
      </Router>
      <ToastContainer theme="dark" />
    </>
  );
}

export default App;
