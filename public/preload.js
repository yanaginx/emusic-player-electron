const { ipcRenderer, contextBridge } = require("electron");
const os = require("os");
const path = require("path");

contextBridge.exposeInMainWorld("electron", {
  playerApi: {
    pickMusic(folder) {
      return ipcRenderer.sendSync("pickMusic", folder);
    },
    writeFile(name, data) {
      return ipcRenderer.sendSync("writeFile", name, data);
    },
    readFile(name) {
      return ipcRenderer.sendSync("readFile", name);
    },
    deleteFile(location) {
      return ipcRenderer.sendSync("deleteFile", location);
    },
    listenSoundLoaded(callback) {
      ipcRenderer.on("soundLoaded", callback);
    },
    removeSoundLoadedListener(callback) {
      ipcRenderer.removeListener("soundLoaded", callback);
    },
    scanMusicDir() {
      if (os.platform() == "win32") {
        return ipcRenderer.sendSync("scanMusicDir", "D:\\Music");
      } else if (os.platform() == "linux") {
        return ipcRenderer.sendSync("scanMusicDir", "/home/music");
      }
    },
  },

  bluetoothApi: {
    getDevices(resultList) {
      // console.log("Started the listener on chennelForBluetoothDeviceList");
      ipcRenderer.on("channelForBluetoothDeviceList", (event, list) => {
        console.log(
          "🚀 ~ file: preload.js ~ line 28 ~ ipcRenderer.on ~ list",
          list
        );
        resultList = list;
      });
    },
  },
});
