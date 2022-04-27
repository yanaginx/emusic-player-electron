import fs from "fs";
import mm from "music-metadata";
import dataUrl from "dataurl";
import mimeTypes from "mime-types";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";

const IS_DEV = process.env.IS_IN_DEVELOPMENT || false;

function readSound(location) {
  const pm = new Promise((resolve, reject) => {
    fs.readFile(location, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(dataUrl.convert({ data, mimetype: mimeTypes.lookup(location) }));
    });
  });
}

ipcMain.on("readSound", (event, location) => {
  readSound(location).then((url) => {
    event.sender.send("soundLoaded", url);
  });
});

ipcMain.on("readFile", (event, name) => {
  const userData = app.getPath("userData");
  const pth = path.join(userData, name);

  if (fs.existsSync(pth)) {
    event.returnValue = fs.readFileSync(pth, "utf8");
  } else {
    event.returnValue = null;
  }
});

ipcMain.on("writeFile", (event, name, data) => {
  if (typeof data != "string") {
    event.returnValue = false;
    return;
  }

  const userData = app.getPath("userData");
  fs.writeFileSync(path.join(userData, name), data);

  event.returnValue = true;
});

async function parseFile(file, scanDir) {
  let stat = fs.lstatSync(file);

  if (stat.isDirectory()) {
    if (!scanDir) return;

    let files = fs.readdirSync(file);
    let output = [];

    for (let child of files) {
      let p = await parseFile(path.join(file, child));
      if (p) output.push(p[0]);
    }

    // for (let child of files) {
    //   let stat = fs.lstatSync(child);
    //   if (stat.isDirectory()) {
    //     let p = await parseFile(path.join(file, child), true);
    //     if (p) output.push(p[0]);
    //   } else {
    //     let p = await parseFile(path.join(file, child), false);
    //     if (p) output.push(p[0]);
    //   }
    // }

    return output;
  } else {
    let ext = path.extname(file);
    if (ext != ".mp3" && ext != ".ogg" && ext != ".wav" && ext != ".flac")
      return;

    let out = {
      date: stat.ctimeMs,
      extension: ext,
      location: file,
      name: path.basename(file).split(".").slice(0, -1).join("."),
    };

    if (ext == ".mp3" || ext == ".flac" || ext == ".ogg" || ext == ".wav") {
      out.tags = await mm.parseFile(file, { native: true });
    }

    return [out];
  }
}

ipcMain.on("pickMusic", async (event, folder) => {
  let files = dialog.showOpenDialogSync({
    title: "Add music",
    filters: [
      {
        name: "Sound (.mp3, .wav, .ogg)",
        extensions: ["mp3", "wav", "ogg", "flac"],
      },
    ],
    properties: ["multiSelections", folder ? "openDirectory" : "openFile"],
  });
  // console.log("🚀 ~ file: electron.js ~ line 96 ~ ipcMain.on ~ files", files);

  if (!files) {
    event.returnValue = [];
    return null;
  }

  let output = [];

  for (let file of files) {
    let arr = await parseFile(file, true);
    if (arr) output = output.concat(arr);
  }

  event.returnValue = output;
});

async function parseMusic(allFiles) {
  // get the contents of dir
  var result = [];
  for (var i = 0; i < allFiles.length; i++) {
    let ext = path.extname(allFiles[i]);
    let stat = fs.lstatSync(allFiles[i]);
    if (ext != ".mp3" && ext != ".ogg" && ext != ".wav" && ext != ".flac")
      continue;

    let out = {
      date: stat.ctimeMs,
      extension: ext,
      location: allFiles[i],
      name: path.basename(allFiles[i]).split(".").slice(0, -1).join("."),
    };

    if (ext == ".mp3" || ext == ".flac" || ext == ".ogg" || ext == ".wav") {
      out.tags = await mm.parseFile(allFiles[i], { native: true });
    }

    result.push(out);
  }
  return result;
}

function getFiles(dir) {
  return fs.readdirSync(dir).flatMap((item) => {
    const filePath = path.join(dir, item);
    if (fs.statSync(filePath).isDirectory()) {
      return getFiles(filePath);
    }

    return filePath;
  });
}

ipcMain.on("scanMusicDir", async (event, directoryPath) => {
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
  // Create the main Electron window
  let devtools = IS_DEV ? true : false;
  const win = new BrowserWindow({
    width: 1024,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
      devTools: devtools,
    },
  });

  if (IS_DEV) {
    // If we are in development mode we load content from localhost server - vite
    // and open the developer tools
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    // In all other cases, load the index.html file from the dist folder
    win.loadURL(`file://${path.join(__dirname, "..", "dist", "index.html")}`);
  }

  //This sender sends the devicelist from the main process to all renderer processes
  win.webContents.on(
    "select-bluetooth-device",
    (event, deviceList, callback) => {
      event.preventDefault(); //important, otherwise first available device will be selected
      // console.log(deviceList); //if you want to see the devices in the shell
      let bluetoothDeviceList = deviceList;
      callbackForBluetoothEvent = callback; //to make it accessible outside createWindow()

      win.webContents.send(
        "channelForBluetoothDeviceList",
        bluetoothDeviceList
      );
    }
  );

  // win.maximize();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  // On macOS, it's common for an app and its menu bar to remain
  // active until the user shuts down the application via the Cmd + Q shortcut
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS, if an application is in the dock, it is common for a window to be created after
  // clicking on the icon in the dock if there are no windows active
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
