var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_fs = __toESM(require("fs"));
var import_music_metadata = __toESM(require("music-metadata"));
var import_dataurl = __toESM(require("dataurl"));
var import_mime_types = __toESM(require("mime-types"));
var import_electron = require("electron");
var import_path = __toESM(require("path"));
const IS_DEV = process.env.IS_IN_DEVELOPMENT || false;
function readSound(location) {
  const pm = new Promise((resolve, reject) => {
    import_fs.default.readFile(location, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(import_dataurl.default.convert({ data, mimetype: import_mime_types.default.lookup(location) }));
    });
  });
}
import_electron.ipcMain.on("readSound", (event, location) => {
  readSound(location).then((url) => {
    event.sender.send("soundLoaded", url);
  });
});
import_electron.ipcMain.on("readFile", (event, name) => {
  const userData = import_electron.app.getPath("userData");
  const pth = import_path.default.join(userData, name);
  if (import_fs.default.existsSync(pth)) {
    event.returnValue = import_fs.default.readFileSync(pth, "utf8");
  } else {
    event.returnValue = null;
  }
});
import_electron.ipcMain.on("deleteFile", (event, location) => {
  try {
    import_fs.default.unlinkSync(location);
    event.returnValue = true;
  } catch (err) {
    console.log("\u{1F680} ~ file: electron.js ~ line 43 ~ ipcMain.on ~ err", err);
    event.returnValue = false;
  }
});
import_electron.ipcMain.on("writeFile", (event, name, data) => {
  if (typeof data != "string") {
    event.returnValue = false;
    return;
  }
  const userData = import_electron.app.getPath("userData");
  import_fs.default.writeFileSync(import_path.default.join(userData, name), data);
  import_fs.default.writeFileSync(name, data);
  event.returnValue = true;
});
async function parseFile(file, scanDir) {
  let stat = import_fs.default.lstatSync(file);
  if (stat.isDirectory()) {
    if (!scanDir)
      return;
    let files = import_fs.default.readdirSync(file);
    let output = [];
    for (let child of files) {
      let p = await parseFile(import_path.default.join(file, child));
      if (p)
        output.push(p[0]);
    }
    return output;
  } else {
    let ext = import_path.default.extname(file);
    if (ext != ".mp3" && ext != ".ogg" && ext != ".wav" && ext != ".flac")
      return;
    let out = {
      date: stat.ctimeMs,
      extension: ext,
      location: "file://" + file,
      name: import_path.default.basename(file).split(".").slice(0, -1).join(".")
    };
    if (ext == ".mp3" || ext == ".flac" || ext == ".ogg" || ext == ".wav") {
      out.tags = await import_music_metadata.default.parseFile(file, { native: true });
    }
    return [out];
  }
}
import_electron.ipcMain.on("pickMusic", async (event, folder) => {
  let files = import_electron.dialog.showOpenDialogSync({
    title: "Add music",
    filters: [
      {
        name: "Sound (.mp3, .wav, .ogg)",
        extensions: ["mp3", "wav", "ogg", "flac"]
      }
    ],
    properties: ["multiSelections", folder ? "openDirectory" : "openFile"]
  });
  if (!files) {
    event.returnValue = [];
    return null;
  }
  let output = [];
  for (let file of files) {
    let arr = await parseFile(file, true);
    if (arr)
      output = output.concat(arr);
  }
  event.returnValue = output;
});
async function parseMusic(allFiles) {
  var result = [];
  for (var i = 0; i < allFiles.length; i++) {
    let ext = import_path.default.extname(allFiles[i]);
    let stat = import_fs.default.lstatSync(allFiles[i]);
    if (ext != ".mp3" && ext != ".ogg" && ext != ".wav" && ext != ".flac")
      continue;
    let out = {
      date: stat.ctimeMs,
      extension: ext,
      location: "file://" + allFiles[i],
      name: import_path.default.basename(allFiles[i]).split(".").slice(0, -1).join(".")
    };
    if (ext == ".mp3" || ext == ".flac" || ext == ".ogg" || ext == ".wav") {
      out.tags = await import_music_metadata.default.parseFile(allFiles[i], { native: true });
    }
    result.push(out);
  }
  return result;
}
function getFiles(dir) {
  return import_fs.default.readdirSync(dir).flatMap((item) => {
    const filePath = import_path.default.join(dir, item);
    if (import_fs.default.statSync(filePath).isDirectory()) {
      return getFiles(filePath);
    }
    return filePath;
  });
}
import_electron.ipcMain.on("scanMusicDir", async (event, directoryPath) => {
  let files = directoryPath;
  if (!files) {
    event.returnValue = [];
    return null;
  }
  let allFiles = [];
  allFiles = getFiles(directoryPath);
  let output = await parseMusic(allFiles);
  event.returnValue = output;
});
function createWindow() {
  let devtools = IS_DEV ? true : false;
  const win = new import_electron.BrowserWindow({
    width: 1024,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      webSecurity: false,
      preload: import_path.default.join(__dirname, "preload.js"),
      devTools: devtools
    }
  });
  if (IS_DEV) {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    win.loadURL(`file://${import_path.default.join(__dirname, "..", "dist", "index.html")}`);
  }
  win.webContents.on("select-bluetooth-device", (event, deviceList, callback) => {
    event.preventDefault();
    let bluetoothDeviceList = deviceList;
    callbackForBluetoothEvent = callback;
    win.webContents.send("channelForBluetoothDeviceList", bluetoothDeviceList);
  });
}
import_electron.app.whenReady().then(createWindow);
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron.app.quit();
  }
});
import_electron.app.on("activate", () => {
  if (import_electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
