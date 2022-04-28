## Emusic Audio player prototype (for offline version)

---

A simple audio player prototype built using Electron and React.

Installation:

- Clone this repo and `yarn` to install the dependencies.
- For development run:
  - Simply run the `yarn electron:serve`, or you can just run `yarn dev` then `yarn electron:dev`.
- For building the app:
  - Run `yarn build` first. In the `dist` directory, change the `src` and `href`'s path of the assets from root to current directory to prevent loading error:
    Ex: from this
  ```
      ...
      <script type="module" crossorigin src="/assets/index.10c5898c.js"></script>
      <link rel="modulepreload" href="/assets/vendor.1e93bdd1.js" />
      <link rel="stylesheet" href="/assets/index.424f2e79.css" />
      ...
  ```
  Change to this:
  ```
      ...
      <script type="module" crossorigin src="./assets/index.10c5898c.js"></script>
      <link rel="modulepreload" href="./assets/vendor.1e93bdd1.js" />
      <link rel="stylesheet" href="./assets/index.424f2e79.css" />
      ...
  ```
  - Then run `electron:build` to build app for current platform, or you can just specify the platform and architecture in the `package.json` scripts command. Refers to [electron-packager](https://github.com/electron/electron-packager) for more information

Functionality implemented:

- Add song to all songs list by folder or by file (support .flac, .mp3, .wav and .ogg)
- Playlist creation
- Play single song or whole playlist (the playback is still simple - with no repeat/shuffle mode implemented)
- Save current profile (for saving the added songs and created playlists).
- Choose playlist for specific emotion recognized (the specified playlist is chosen by user's preference, by using setting screen).
- Shuffle/Repeat mode for player.
- Choose playlist's track start playing the playlist with the chosen track's position.
- Partially fix issue when starting same song from different playlist not making the track reload.
- The server - [emusic-player-electron-server](https://github.com/yanaginx/emusic-player-electron-server) must be started before the app for these functions below to work:
  - Wifi scanning.
  - FER and playlist picking.
  - Scan removable devices for music and copying them to "/home/music" (linux) and "D:/Music" (windows) (only window version tested).
  - Using hand gesture to control. This mode can be enabled manually on the settings menu. The app is able to script switching if user want to FER when hand gesture mode enable.
    - Play/pause and next/previous only works properly when the app is fully open, with resolution of 1600x900
    - Add script supports linux also, with the resolution of 1024x600 (haven't tested yet)
    - ~~Volume might not work on Linux (since the library use for controlling volume is specifically for windows).~~ Only `pyautogui` is required so it should works on both OSs
  - Bluetooth scanning and connecting (Haven't test yet, will deploy on board where `bluetoothctl` is available).
  - ~~System volume control (No smoothness since api calls must be made).~~ Changed the implementation.
  - Simple online songs search and download using zing mp3 API.

TODO:

- Implement: Proper UI.
<!-- - Implement: Currently playing queue fullscreen -->

Current issue:

- TBD
