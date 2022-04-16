export class ePlayer {
  constructor() {
    this.playing = null;
    this.currentList = null;
    this.selected = null;
    this.dataInitialized = null;

    this.songs = [];
    this.playlists = [];

    this.queue = [];
    this.originalQueue = [];
    this.currentIndex = 0;
    this.isShuffle = false;
    this.isRepeat = false;

    this.lastId = 9;

    // indicator for playing track changed
    this.playingChange = 0;

    this.playlistMap = {
      happy: "",
      sad: "",
      angry: "",
      surprise: "",
      neutral: "",
    };

    this.initialize();
  }

  initialize() {
    this.loadProfiles();
    console.log("👌 Profile loaded. Player initialized!");
  }

  setCurrentList(cList) {
    this.currentList = cList;
  }

  setPlaying(item) {
    if (!item) return;
    this.playing = item;
  }

  isPlaying(item) {
    return (
      (this.playing ? this.playing.id == item.id : false) ||
      (this.currentList ? this.currentList.id == item.id : false)
    );
  }

  isSelected(item) {
    return this.selected ? this.selected.id == item.id : false;
  }

  select(item) {
    if (this.selected && this.selected == item.id) {
      this.selected = null;
      return;
    }

    this.selected = item.id;
  }

  createPlaylist(name) {
    this.playlists.push({
      id: ++this.lastId,
      type: "playlist",
      name: name,
      content: [],
    });
    // console.log(
    //   "🚀 ~ file: ePlayer.js ~ line 58 ~ ePlayer ~ createPlaylist ~ this.playlists",
    //   this.playlists
    // );
  }

  formatDate(date) {
    date = date || new Date();
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  }

  playFromList(list, item) {
    if (
      !(
        this.currentList &&
        this.currentList.id == list.id &&
        this.currentList.length > 0
      )
    ) {
      this.currentList = list;
      this.loadList(list); // Loads the list into our queue
    }

    this.playFromQueue(item); // Moves to this item
  }

  /**
   * Plays a single item (and may clear the queue)
   */
  play(item) {
    this.queue.splice(0, this.queue.length);
    this.currentIndex = 0;
    this.setPlaying(item);
    this.setCurrentList(null);
  }

  /**
   * Called by MaterialPlayer.Interface the current item has finished playing
   */
  ended() {
    this.next();
  }

  /**
   * Called by MaterialPlayer.Interface after a track is complete or the user skips
   */
  next() {
    if (!this.isRepeat) {
      if (this.queue.length > this.currentIndex + 1) {
        // this.player.interface.play(
        //   this.data.queue[++this.data.currentIndex].location
        // );
        this.setPlaying(this.queue[++this.currentIndex]);
      }
    } else {
      if (this.isShuffle) {
        this.shuffle();
      }
      this.currentIndex = ++this.currentIndex % this.queue.length;
      this.setPlaying(this.queue[this.currentIndex]);
    }
  }

  /**
   * Called when a user clicks previous
   */
  previous() {
    if (!this.isRepeat) {
      if (this.currentIndex - 1 >= 0) {
        this.setPlaying(this.queue[--this.currentIndex]);
      }
    } else {
      if (this.isShuffle) {
        this.shuffle();
      }
      if (--this.currentIndex === -1) this.currentIndex = this.queue.length - 1;

      this.setPlaying(this.queue[this.currentIndex]);
    }
  }

  /**
   * Clear the current queue and fill it with list
   */
  loadList(list) {
    // Won't load playlist if playlist is empty
    if (list.length === 0) return;
    this.setCurrentList(list);

    this.queue.splice(0, this.queue.length);

    for (let item of list.content) {
      this.queue.push(item);
    }
    if (this.isShuffle) {
      this.shuffle(true);
    }

    this.currentIndex = 0;
    // this.setPlaying(this.queue[this.currentIndex]);
  }

  /**
   * If this song is in the queue move to it.
   */
  playFromQueue(item) {
    for (let [i, check] of this.queue.entries()) {
      if (check.id == item.id) {
        this.currentIndex = i;
        this.setPlaying(check);
        // this.player.interface.play(check.location);

        return;
      }
    }
  }

  /**
   * Shuffles queue and sets currentIndex to 0
   */
  shuffle(isNewList) {
    if (this.queue.length >= 1) {
      if (this.originalQueue.length === 0 || isNewList) {
        this.originalQueue = [...this.queue];
      }
      for (let i = this.queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
      }
      // set current playing track and move it to the front (if exists)
      if (this.currentList && this.playing) {
        for (let i = 0; i < this.queue.length; i++) {
          if (this.queue[i].id == this.playing.id) {
            this.queue.splice(i, 1);
            this.queue.unshift(this.playing);
            this.currentIndex = 0;
            break;
          }
        }
      }
    }
  }

  /**
   * Unshuffle and reset queue
   */
  unshuffle() {
    // get current song index from the original queue
    let currIndex = 0;
    for (let i = 0; i < this.originalQueue.length; i++) {
      if (this.originalQueue[i].id == this.playing.id) {
        currIndex = i;
        break;
      }
    }
    if (this.originalQueue.length > 0) {
      this.queue = this.originalQueue;
      this.originalQueue = [];
      this.currentIndex = currIndex;
    }
  }

  /**
   * Toggle shuffling
   */
  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    if (this.currentList) {
      if (this.isShuffle) {
        this.shuffle();
      } else {
        console.log(
          "🚀 ~ file: ePlayer.js ~ line 228 ~ ePlayer ~ toggleShuffle ~ went to unshuffle here"
        );
        this.unshuffle();
      }
    }
  }

  /**
   * Toggle repeat
   */
  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
  }

  /**
   * Toggle playing track change
   */
  togglePlayingChange() {
    this.playingChange = !this.playingChange;
  }

  addFile(file) {
    let song = {
      id: ++this.lastId,
      type: "song",
      location: file.location,
      name: file.name,
      extension: file.extension,
      year: "Unknown",
      album: "Unknown",
      author: "Unknown",
    };

    if (file.tags) {
      if (file.tags.common) {
        let meta = file.tags.common;
        song.year = meta.year || "Unknown";
        song.name = meta.title || file.name;
        song.album = meta.album || "Unknown";
        song.author = meta.artist || "Unknown";
        song.date = meta.date
          ? this.formatDate(new Date(meta.date))
          : this.formatDate();
        song.duration = meta.duration || "Unknown";
      }
    }

    for (let i = 0; i < this.songs.length; i++) {
      if (this.songs[i].location === song.location) {
        return;
      }
    }
    this.songs.push(song);
  }

  /**
   * Deletes a playlist or song
   */
  deleteItem(item) {
    if (item.type == "playlist") {
      for (let [i, list] of this.playlists.entries())
        if (list.id == item.id) this.playlists.splice(i, 1);
    } else {
      for (let [i, list] of this.songs.entries())
        if (list.id == item.id) this.songs.splice(i, 1);

      for (let [i, list] of this.playlists.entries())
        if (list.content.includes(item.id))
          list.content.splice(list.content.indexOf(item.id), 1);
    }
  }

  /**
   * Add track to a playlist
   */
  // This is okay but find ways to make the pages find another playlist's content
  addToPlaylist(playlistId, trackData) {
    let flag = false;
    let playlist = null;
    for (let list of this.playlists)
      if (list.id == playlistId) {
        playlist = list;
        for (let [i, item] of playlist.content.entries())
          if (item.id === trackData.id) flag = true;
      }
    flag
      ? console.log(
          "🚀 ~ file: ePlayer.js ~ line 208 ~ ePlayer ~ addToPlaylist ~ track already in playlist"
        )
      : playlist.content.push(trackData);
  }

  /**
   * Remove track from a playlist
   */
  removeFromPlaylist(playlistId, trackData) {
    let playlist = null;
    for (let list of this.playlists)
      if (list.id == playlistId) {
        playlist = list;
        console.log(
          "🚀 ~ file: ePlayer.js ~ line 212 ~ ePlayer ~ removeFromPlaylist ~ list",
          list
        );
        for (let [i, item] of playlist.content.entries())
          if (item.id == trackData.id) playlist.content.splice(i, 1);
      }
  }

  /**
   * Mapping mood to playlist
   */
  mapMood(mood, playlistId) {
    this.playlistMap[mood] = playlistId;
  }

  pickMusic(folder) {
    let data = electron.playerApi.pickMusic(folder);

    for (let file of data) {
      this.addFile(file);
    }

    // this.profile.refresh();
  }

  scanMusicDir() {
    let data = electron.playerApi.scanMusicDir();
    for (let file of data) {
      this.addFile(file);
    }
  }

  writeFile(name, data) {
    return electron.playerApi.writeFile(name, data);
  }

  readFile(name) {
    return electron.playerApi.readFile(name);
  }

  saveProfiles() {
    // this.writeFile("profiles.json", JSON.stringify(Object.keys(this.profiles)));
    const data = {
      songs: this.songs,
      playlists: this.playlists,
      queue: this.queue,
      currentIndex: this.currentIndex,
      lastId: this.lastId,
      playlistMap: this.playlistMap,
    };
    this.writeFile("profile.json", JSON.stringify(data, null, "	"));
  }

  // initializeData() {
  //   if (this.dataInitialized) return;
  //   this.profile.initialize(this);
  //   this.interface.initialize(this);
  //   this.dataInitialized = true;
  // }

  loadProfiles() {
    // this.initializeData();

    // let profiles = this.readFile("profiles.json");
    let loadProfile = this.readFile("profile.json");
    if (loadProfile) {
      const profile = JSON.parse(loadProfile);
      this.songs = profile.songs;
      this.playlists = profile.playlists;
      this.queue = profile.queue;
      this.currentIndex = profile.currentIndex;
      this.lastId = profile.lastId;
      this.playlistMap = profile.playlistMap;
    }
  }
}
