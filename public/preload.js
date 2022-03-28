const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  playerApi: {
    pickMusic(folder) {
      return ipcRenderer.sendSync("pickMusic", folder);
    },
  },
});
