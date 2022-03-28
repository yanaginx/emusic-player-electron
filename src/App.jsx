import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Box, Typography, Paper } from "@mui/material";
import "./App.css";

// Import components
import Player from "./components/Player";

function App() {
  console.log(
    "\r\n    __________  __    _____  ____________ \r\n   / ____/ __ \\/ /   /   \\ \\/ / ____/ __ \\\r\n  / __/ / /_/ / /   / /| |\\  / __/ / /_/ /\r\n / /___/ ____/ /___/ ___ |/ / /___/ _, _/ \r\n/_____/_/   /_____/_/  |_/_/_____/_/ |_|  \r\n                                          \r\n"
  );
  const [count, setCount] = useState(0);

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
              <Player />
            </Paper>
          </Box>
        </Container>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
