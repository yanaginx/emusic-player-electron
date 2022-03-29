const { ipcRenderer, contextBridge } = require("electron");

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
    listenSoundLoaded(callback) {
      ipcRenderer.on("soundLoaded", callback);
    },
    removeSoundLoadedListener(callback) {
      ipcRenderer.removeListener("soundLoaded", callback);
    },
  },
});
