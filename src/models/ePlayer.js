export class ePlayer {
  constructor() {
    this.playing = null;
    this.currentList = null;
    this.selected = null;
    this.dataInitialized = null;
    this.songs = [];
    this.playlists = [];
    this.queue = [];
    this.currentIndex = 0;
    this.lastId = 9;
    this.itemMap = {};

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
    if (!(this.currentList && this.currentList.id == list.id)) {
      this.currentList = list;
      this.profile.loadList(list); // Loads the list into our queue
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
    if (this.queue.length > this.currentIndex + 1) {
      // this.player.interface.play(
      //   this.data.queue[++this.data.currentIndex].location
      // );
      this.setPlaying(this.queue[++this.currentIndex]);
    }
  }

  /**
   * Called when a user clicks previous
   */
  previous() {
    if (this.currentIndex - 1 >= 0) {
      // this.player.interface.play(
      //   this.data.queue[--this.data.currentIndex].location
      // );
      this.setPlaying(this.queue[--this.currentIndex]);
    }
  }

  /**
   * Clear the current queue and fill it with list
   */
  loadList(list) {
    this.setCurrentList(list);

    this.queue.splice(0, this.queue.length);

    for (let item of list.content) {
      this.queue.push(item);
    }

    this.currentIndex = 0;
    this.setPlaying(this.queue[this.currentIndex]);
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

    this.songs.push(song);
  }

  /**
   * Deletes a playlist or song
   */
  // Fix this
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
  // Fix this
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

  pickMusic(folder) {
    let data = electron.playerApi.pickMusic(folder);

    for (let file of data) {
      this.addFile(file);
    }

    // this.profile.refresh();
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
    }
  }
}
