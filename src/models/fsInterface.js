export class FileSystemInterface {
  constructor() {
    this.info = {
      duration: 0,
      currentTime: 0,
      playing: false,
    };
  }

  initialize(player) {
    this.player = player;

    this.audio = document.createElement("audio");
    document.body.appendChild(this.audio);

    this.loaded = (event, data) => {
      this.audio.src = data;
    };

    this.audio.ontimeupdate = () => {
      this.info.currentTime = this.audio.currentTime;
    };

    this.audio.ondurationchange = () => {
      this.info.duration = this.audio.duration;
    };

    this.audio.onpause = () => {
      this.info.playing = false;
    };

    this.audio.onplay = () => {
      this.info.playing = true;
    };

    this.audio.onended = () => {
      this.player.profile.ended();
    };

    // Make sure to cleanup our listener in destroy
    electron.playerApi.listenSoundLoaded(this.loaded);
  }

  destroy() {
    electron.playerApi.removeSoundLoadedListener(this.loaded);
  }

  play(location) {
    this.audio.src = location;
    this.audio.pause();
    this.audio.load();
    this.audio.play();
  }

  unpause() {
    this.setState(true);
  }

  pause() {
    this.setState(false);
  }

  setState(playing) {
    if (playing) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  seek(time) {
    this.audio.currentTime = time;
  }

  duration() {
    return this.info.duration;
  }

  currentTime() {
    return this.info.currentTime;
  }

  playing() {
    return this.info.playing;
  }

  next() {}

  previous() {}
}
