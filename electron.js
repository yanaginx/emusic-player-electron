import fs from "fs";
import mm from "music-metadata";
import dataUrl from "dataurl";
import mimeTypes from "mime-types";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
// const fs = require("fs");
// const path = require("path");
// const mm = require("music-metadata");
// const dataUrl = require("dataurl");
// const mimeTypes = require("mime-types");
// const { app, BrowserWindow, dialog, ipcMain } = require("electron");

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

function createWindow() {
  // Create the main Electron window
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
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
