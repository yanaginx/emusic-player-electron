import {
  Box,
  Typography,
  Divider,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  FormControl,
  Select,
  Button,
  CircularProgress,
  CardActionArea,
  CardContent,
  Modal,
  TextField,
  Switch,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getNetworks,
  connectToNetwork,
  disconnectFromNetwork,
  reset,
} from "../features/wifi/wifiSlice";
import {
  enable,
  disable,
  resetHand,
} from "../features/handGesture/handGestureSlice";
import useConstructor from "../use.constructor";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function Settings({ player }) {
  const [devices, setDevices] = useState([]);

  useConstructor(() => {
    let list = [];
    electron.bluetoothApi.getDevices(list);
    setDevices(list);

    console.log(
      "This only happens ONCE and it happens BEFORE the initial render."
    );
  });

  useEffect(() => {
    console.log(
      "🚀 ~ file: Settings.jsx ~ line 45 ~ useEffect ~ devices",
      devices
    );
  }, [devices]);

  const dispatch = useDispatch();
  // Initial state for the wifi related
  const {
    connection,
    allConnections,
    isLoading,
    isSuccess,
    isError,
    isLoadingConnect,
    isSuccessConnect,
    isErrorConnect,
    message,
  } = useSelector((state) => state.wifi);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Initial state for the hand gesture related
  const { isOn, isHandLoading, isHandError, handMessage, isHandSuccess } =
    useSelector((state) => state.handGesture);

  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [currSsid, setCurrSsid] = useState("");
  const [currPassword, setCurrPassword] = useState("");
  const handleConnectModalOpen = (ssid) => {
    setOpenConnectModal(true);
    setCurrSsid(ssid);
  };
  const handleConnectModalClose = () => {
    setOpenConnectModal(false);
  };

  // For scrolling into view after get all the wifi connections
  const wifiSetupRef = useRef(null);
  // const executeScroll = () =>
  //   wifiSetupRef.current.scrollIntoView({ behavior: "smooth" });

  // method for setting the wifi connection
  const onGetNetworks = () => {
    dispatch(getNetworks());
  };
  const onConnectNetwork = (info) => {
    dispatch(reset());
    console.log("[DEBUG] info: ", info);
    setCurrSsid("");
    setCurrPassword("");
    dispatch(connectToNetwork(info));
    handleConnectModalClose();
  };
  const onDisconnect = () => {
    dispatch(reset());
    dispatch(disconnectFromNetwork());
  };

  // method for setting the bluetooth
  const onRequestBluetooth = () => {
    navigator.bluetooth.requestDevice({ acceptAllDevices: true });
  };

  useEffect(() => {
    console.log("[DEBUG] current ssid: ", currSsid);
  }, [currSsid]);

  // BLOCK: Bluetooth test
  useEffect(() => {}, []);

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
    <Box sx={{ height: `80vh`, overflowY: "auto" }}>
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
      {/* Enable and disable hand gesture */}
      <Box marginBottom={6} marginTop={3}>
        <Typography variant="h5">Hand Gesture</Typography>
        <Box>{isOn ? <Typography> Opened</Typography> : <></>}</Box>
        {!isOn ? (
          <Button
            onClick={() => {
              dispatch(enable());
            }}
          >
            Enable
          </Button>
        ) : (
          <Button
            onClick={() => {
              dispatch(disable());
            }}
          >
            Disable
          </Button>
        )}
      </Box>
      {/* Options for mood - playlist mapping  */}
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

      {/* Options for wifi setup  */}
      <Box marginBottom={6} marginTop={3}>
        <Typography marginBottom={2} variant="h5">
          Wifi setup
        </Typography>
        <Button onClick={onGetNetworks}>Get all connections</Button>
        {isLoadingConnect ? (
          <CircularProgress />
        ) : (
          <>
            {connection ? (
              <>
                <Typography color="primary">{connection[0].ssid}</Typography>
                <Button onClick={onDisconnect}>Disconnect</Button>
              </>
            ) : (
              <></>
            )}
          </>
        )}
        {isLoading ? (
          <>
            <CircularProgress />
          </>
        ) : (
          <List>
            {allConnections.map((connection) => (
              <ListItem>
                <CardActionArea
                  onClick={() => {
                    handleConnectModalOpen(connection.ssid);
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom>
                      {connection.ssid} + {connection.quality}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Modal
        open={openConnectModal}
        onClose={handleConnectModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography sx={{ my: 1 }} variant="h4">
            Connect to wifi network
          </Typography>
          <Typography sx={{ my: 1 }} variant="body1">
            {currSsid}
          </Typography>
          <TextField
            fullWidth
            label="password"
            variant="standard"
            type="password"
            value={currPassword}
            onChange={(e) => setCurrPassword(e.target.value)}
          />
          <Button
            onClick={() => {
              const info = {
                ssid: currSsid,
                password: currPassword,
              };
              onConnectNetwork(info);
            }}
          >
            Connect
          </Button>
        </Box>
      </Modal>

      {/* Option for bluetooth setup */}
      <Box marginBottom={6} marginTop={3}>
        <Typography marginBottom={2} variant="h5">
          Bluetooth setup
        </Typography>
        <Button onClick={onRequestBluetooth}>Get all connections</Button>
      </Box>
    </Box>
  );
}

export default Settings;
