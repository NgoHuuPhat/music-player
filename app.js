/*      1. Render song
        2. Scroll top
        3. Play / pause/ seek
        4. CD rotate
        5. Next / Prev
        6. Random
        7. Next / Repeat when ended
        8. Active song
        9. Scroll active song into view
        10. Play song when click 
        Bonus. Save options when F5*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'HUUPHAT_PLAYER';

const playlist = $('.playlist');
const player = $('.player');
const cd = $('.cd');
const heading = $('h2');
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const audio = $('#audio');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
  currentIndex: 0,
  isPlaying: false,
  playedSongs: [], //Mảng lưu các Song đã phát
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY) || '{}'),
  songs: [
    {
      name: 'Tràn bộ nhớ',
      singer: 'Dương Domic',
      path: './assets/music/song1.mp3',
      image: './assets/img/song1.jpg',
    },
    {
      name: 'Đi giữa trời rực rỡ',
      singer: 'Ngô Lan Hương',
      path: './assets/music/song2.mp3',
      image: './assets/img/song2.jpg',
    },
    {
      name: 'Ta đã vất vả rồi mà',
      singer: '14 Casper, Bon Nghiêm',
      path: './assets/music/song3.mp3',
      image: './assets/img/song3.jpg',
    },
    {
      name: 'Sau lời từ khước',
      singer: 'Phan Mạnh Quỳnh',
      path: './assets/music/song4.mp3',
      image: './assets/img/song4.jpg',
    },
    {
      name: 'Chịu cách mình nói thua',
      singer: 'DG House',
      path: './assets/music/song5.mp3',
      image: './assets/img/song5.jpg',
    },
    {
      name: 'Thủy triều',
      singer: 'Quang Hùng MasterD',
      path: './assets/music/song6.mp3',
      image: './assets/img/song6.jpg',
    },
    {
      name: 'Không thể say',
      singer: 'HIEUTHUHAI',
      path: './assets/music/song7.mp3',
      image: './assets/img/song7.jpg',
    },
    {
      name: 'Nơi này có anh',
      singer: 'Sơn Tùng M-TP',
      path: './assets/music/song8.mp3',
      image: './assets/img/song8.jpg',
    },
    {
      name: 'Yours',
      singer: 'Raiden X Chanyeol',
      path: './assets/music/song9.mp3',
      image: './assets/img/song9.jpg',
    },
    {
      name: 'Ngày đẹp trời để nói chia tay',
      singer: 'Lou Hoàng',
      path: './assets/music/song10.mp3',
      image: './assets/img/song10.jpg',
    },
  ],
  render() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song" data-index = ${index}>
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
      `;
    });

    playlist.innerHTML = htmls.join('');
  },

  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  //Tạo một Property GET Song
  defineProperties() {
    Object.defineProperty(this, 'currentSong', {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //Xử lí CD quay / dừng (Sử dụng API Animation)
    const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000, // Thời gian hoạt ảnh là 10 giây
      iterations: Infinity, // Lặp lại vô hạn
    });
    cdThumbAnimate.pause();

    //Xử lí phóng to / thu nhỏ
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scrollTop;

      cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
      cd.style.opacity = newcdWidth / cdWidth;
    };

    //Sự kiện khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
        _this.updateActive();
      }
    };

    //Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
      _this.scrollToActiveSong();
    };

    //Sự kiện khi Song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };

    //Thanh tiến độ bài hát thay đổi theo tiến độ của bài hát
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //Xử lí khi tua Song 
    progress.oninput = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    };

    //Khi next Song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.scrollToActiveSong();
      _this.updateActive();
      audio.play();
    };

    //Khi prev Song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      _this.updateActive();
      _this.scrollToActiveSong();
      audio.play();
    };

    //Khi xử lí bật / tắt random Song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle('active', _this.isRandom);
    };

    //Xử lí phát lại một Song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    //Xử lí khi Song đó kết thúc
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play(); //Khi dùng audio.play() sẽ auto currentTime = 0
      } else {
        nextBtn.click();
      }
    };
    //Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      if (songNode || e.target.closest('.option')) {
        if (songNode) {
          _this.currentIndex = Number(songNode.getAttribute('data-index')); //hoặc là songNode.dataset.index
          _this.loadCurrentSong();
          _this.updateActive();
          audio.play();
        }
        if (e.target.closest('.option')) {
          // alert('Bạn muốn tùy chọn gì')
        }
      }
    };
  },

  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex || this.playedSongs.includes(newIndex));

    this.playedSongs.push(newIndex) //Thêm Song mới vào mảng đã phát

    if(this.playedSongs.length === this.songs.length){
      this.playedSongs = [] //Nếu mảng đã phát = Mảng Song ban đầu thì reset mảng
    }

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({ //cuộn một thành phần vào vùng hiển thị
        behavior: 'smooth',
        block: 'end',
      });
    }, 100);
  },
  updateActive() { 
    const songs = $$('.song');
    songs.forEach((song) => {
      song.classList.remove('active');
    });
    songs[this.currentIndex].classList.add('active');
  },
  loadConfig() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    
    // Hiển thị trạng thái ban đầu của button Repeat và Random
    randomBtn.classList.toggle('active', this.isRandom); // True add - False remove
    repeatBtn.classList.toggle('active', this.isRepeat);
  
  },
  start() {
    //Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    //Render Playlist lên màn hình
    this.render();

    //Định nghĩa thuộc tính cho Object
    this.defineProperties();

    //Lắng nghe xử lí các sự kiện (DOM events)
    this.handleEvents();

    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

  },
};
app.start();
