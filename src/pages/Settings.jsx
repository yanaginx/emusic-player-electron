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
  Tab,
  Tabs,
  Stack,
  LinearProgress,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MdSignalWifiStatusbar1Bar,
  MdSignalWifiStatusbar2Bar,
  MdSignalWifiStatusbar3Bar,
  MdSignalWifi4Bar,
} from "react-icons/md";
import {
  getNetworks,
  connectToNetwork,
  disconnectFromNetwork,
  reset,
} from "../features/wifi/wifiSlice";
import {
  getDevices,
  getPairedDevice,
  connectToDevice,
  disconnectFromDevice,
  resetBluetooth,
} from "../features/bluetooth/bluetoothSlice";
import {
  enable,
  disable,
  resetHand,
} from "../features/handGesture/handGestureSlice";
import { toast } from "react-toastify";
import ColoredScrollbars from "../components/ColoredScrollbars";
import PropTypes from "prop-types";

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

// For tabbing
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <ColoredScrollbars style={{ height: "330px" }}>
          {children}
        </ColoredScrollbars>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Settings({ player }) {
  const [devices, setDevices] = useState([]);
  const [playlist, setPlaylists] = useState(player.playlists);

  const { isPlaylistChange } = useSelector((state) => state.playlistChange);

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

  // Initial state for the bluetooth related
  const {
    device,
    allDevices,
    isErrorDevices,
    isLoadingDevices,
    isSuccessDevices,
    isLoadingGetPaired,
    isSuccessGetPaired,
    isErrorGetPaired,
    isSuccessConnectDevice,
    isLoadingConnectDevice,
    isErrorConnectDevice,
    isSuccessDisconnectDevice,
    isLoadingDisconnectDevice,
    isErrorDisconnectDevice,
    bluetoothMessage,
  } = useSelector((state) => state.bluetooth);

  useEffect(() => {
    return () => {
      dispatch(reset());
      dispatch(resetBluetooth());
    };
  }, [dispatch]);

  // Initial state for the hand gesture related
  const { isOn, isHandLoading, isHandError, handMessage, isHandSuccess } =
    useSelector((state) => state.handGesture);

  // Modal for connect to wifi
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

  // Modal for connect to bluetooth
  const [macAddr, setMacAddr] = useState("");

  // method for setting the wifi connection
  const onGetNetworks = () => {
    dispatch(getNetworks());
  };
  const onConnectNetwork = (info) => {
    dispatch(reset());
    console.log("[DEBUG] info: ", info);
    setCurrSsid("");
    setCurrPassword("");
    if (connection) {
      dispatch(disconnectFromNetwork());
    }
    dispatch(connectToNetwork(info));
    handleConnectModalClose();
  };
  const onDisconnect = () => {
    dispatch(reset());
    dispatch(disconnectFromNetwork());
  };

  // method for setting the bluetooth connection
  const onGetDevices = () => {
    dispatch(getDevices());
  };
  const onConnectDevice = (mac) => {
    dispatch(resetBluetooth());
    dispatch(connectToDevice(mac));
    setMacAddr("");
  };
  const onDisconnectDevice = (mac) => {
    dispatch(resetBluetooth());
    dispatch(disconnectFromDevice(mac));
  };

  // For wifi error logging
  useEffect(() => {
    if (isError || isErrorConnect) {
      toast.error(message);
    }
  }, [isError, isErrorConnect]);

  // For bluetooth error logging
  useEffect(() => {
    if (
      isErrorDevices ||
      isErrorConnectDevice ||
      isErrorDisconnectDevice ||
      isErrorGetPaired
    ) {
      toast.error(bluetoothMessage);
    }
  }, [
    isErrorDevices,
    isErrorConnectDevice,
    isErrorDisconnectDevice,
    isErrorGetPaired,
  ]);

  // For bluetooth success connection
  useEffect(() => {
    if (isSuccessConnectDevice) {
      dispatch(getPairedDevice());
    }
  }, [isSuccessConnectDevice, dispatch]);

  useEffect(() => {
    console.log("[DEBUG] current ssid: ", currSsid);
  }, [currSsid]);

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

  // For tab switching
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ height: `80vh`, overflowY: "auto" }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        // minHeight="100vh"
        my={2}
      >
        <Typography variant="h4">Settings</Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            aria-label="basic tabs example"
          >
            <Tab label="Hand gesture" {...a11yProps(0)} />
            <Tab label="Emotion playlist mapping" {...a11yProps(1)} />
            <Tab label="Wifi" {...a11yProps(2)} />
            <Tab label="Bluetooth" {...a11yProps(2)} />
          </Tabs>
        </Box>
        {/* Hand gesture */}
        <TabPanel value={value} index={0}>
          <>
            {/* <Typography variant="h5">Hand Gesture</Typography> */}
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
          </>
        </TabPanel>
        {/* Emotion playlist mapping */}
        <TabPanel value={value} index={1}>
          <>
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
                    <MenuItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Sad mood playlist select */}
            <Box my={2}>
              <FormControl sx={{ width: "50%" }}>
                <InputLabel id="sad-mood-playlist-selector">
                  Sad mood
                </InputLabel>
                <Select
                  labelId="sad-mood-playlist-selector"
                  id="sad-mood-selector"
                  value={sad}
                  label="Sad mood"
                  onChange={handleSadPlaylist}
                >
                  {player.playlists.map((playlist) => (
                    <MenuItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </MenuItem>
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
                    <MenuItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </MenuItem>
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
                    <MenuItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </MenuItem>
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
                    <MenuItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        </TabPanel>
        {/* Wifi */}
        <TabPanel value={value} index={2}>
          {/* Options for wifi setup  */}
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ my: 2, mx: 2 }}
            >
              <Typography marginBottom={2} variant="h5">
                Wifi setup
              </Typography>

              <Button marginRight={2} onClick={onGetNetworks}>
                Get all connections
              </Button>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              spacing={2}
            >
              {isLoadingConnect ? (
                <CircularProgress />
              ) : (
                <>
                  {connection ? (
                    <>
                      <Typography color="primary">
                        {connection[0].ssid}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={onDisconnect}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </Stack>
            {isLoading ? (
              <>
                <LinearProgress />
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
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography gutterBottom>{connection.ssid}</Typography>
                        {(() => {
                          if (connection.quality <= 25) {
                            return <MdSignalWifiStatusbar1Bar />;
                          } else if (connection.quality <= 50) {
                            return <MdSignalWifiStatusbar2Bar />;
                          } else if (connection.quality <= 75) {
                            return <MdSignalWifiStatusbar3Bar />;
                          } else {
                            return <MdSignalWifi4Bar />;
                          }
                        })()}
                      </CardContent>
                    </CardActionArea>
                  </ListItem>
                ))}
              </List>
            )}
          </>
          <Modal
            open={openConnectModal}
            onClose={handleConnectModalClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...modalStyle }}>
              <Typography sx={{ my: 1 }} variant="h6">
                Connect to wifi network
              </Typography>
              <Typography sx={{ my: 1 }} variant="body1">
                SSID: {currSsid}
              </Typography>
              <TextField
                fullWidth
                label="password"
                variant="standard"
                type="password"
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                sx={{ marginBottom: 2 }}
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
        </TabPanel>
        {/* Bluetooth */}
        <TabPanel value={value} index={3}>
          <>
            <Typography marginBottom={2} variant="h5">
              Bluetooth setup
            </Typography>
            <Button onClick={onGetDevices}>Get all bluetooth devices</Button>
            {isLoadingConnectDevice ? (
              <>
                <CircularProgress />
                <Typography>Connecting...</Typography>
              </>
            ) : (
              <></>
            )}
            {isLoadingGetPaired ? (
              <CircularProgress />
            ) : (
              <>
                {device ? (
                  <>
                    <Typography color="primary">
                      {device.device_name + ":" + device.mac}
                    </Typography>
                    <Button
                      onClick={() => {
                        const info = {
                          mac: device.mac,
                        };
                        onDisconnectDevice(info);
                      }}
                    >
                      Disconnect
                    </Button>
                    {isLoadingDisconnectDevice ? <CircularProgress /> : <></>}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            {isLoadingDevices ? (
              <>
                <CircularProgress />
              </>
            ) : (
              <List>
                {allDevices.map((device) => (
                  <ListItem>
                    <CardActionArea
                      onClick={() => {
                        setMacAddr(device.mac);
                        const info = {
                          mac: device.mac,
                        };
                        onConnectDevice(info);
                      }}
                    >
                      <CardContent>
                        <Typography gutterBottom>
                          {device.mac} + {device.device_name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        </TabPanel>
      </Box>

      <Divider />
      {/* <ColoredScrollbars style={{ height: "320px" }}>
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
        <Box marginBottom={6} marginTop={3}>
          <Typography marginBottom={2} variant="h5">
            Emotion-based playlist option
          </Typography>

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
                  <MenuItem key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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
                  <MenuItem key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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
                  <MenuItem key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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
                  <MenuItem key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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
                  <MenuItem key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

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

        <Box marginBottom={6} marginTop={3}>
          <Typography marginBottom={2} variant="h5">
            Bluetooth setup
          </Typography>
          <Button onClick={onGetDevices}>Get all bluetooth devices</Button>
          {isLoadingConnectDevice ? (
            <>
              <CircularProgress />
              <Typography>Connecting...</Typography>
            </>
          ) : (
            <></>
          )}
          {isLoadingGetPaired ? (
            <CircularProgress />
          ) : (
            <>
              {device ? (
                <>
                  <Typography color="primary">
                    {device.device_name + ":" + device.mac}
                  </Typography>
                  <Button
                    onClick={() => {
                      const info = {
                        mac: device.mac,
                      };
                      onDisconnectDevice(info);
                    }}
                  >
                    Disconnect
                  </Button>
                  {isLoadingDisconnectDevice ? <CircularProgress /> : <></>}
                </>
              ) : (
                <></>
              )}
            </>
          )}
          {isLoadingDevices ? (
            <>
              <CircularProgress />
            </>
          ) : (
            <List>
              {allDevices.map((device) => (
                <ListItem>
                  <CardActionArea
                    onClick={() => {
                      setMacAddr(device.mac);
                      const info = {
                        mac: device.mac,
                      };
                      onConnectDevice(info);
                    }}
                  >
                    <CardContent>
                      <Typography gutterBottom>
                        {device.mac} + {device.device_name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </ColoredScrollbars> */}
    </Box>
  );
}

export default Settings;
