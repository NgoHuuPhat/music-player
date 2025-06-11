# MusicLayer

MusicLayer is a simple web music player built with pure HTML, CSS, and JavaScript.

## Features

- Display song playlist
- Play, pause, seek, next/previous song
- Random and repeat playback
- Show album art (CD) and current song info
- Save Random/Repeat state on page reload (using LocalStorage)
- Seek song with progress bar
- Auto-scroll to the currently playing song in the playlist

## Usage

1. Clone or download the `MusicLayer` folder.
2. Make sure your music and image files are in `assets/music` and `assets/img`.
3. Open `index.html` in your browser to use the app.

## Folder Structure

```
MusicLayer/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── img/
│   │   └── song*.jpg
│   └── music/
│       └── song*.mp3
├── app.js
├── index.html
└── README.md
```

## Notes

- The app uses LocalStorage to save Random/Repeat state.
- You can add new songs by editing the `songs` array in `app.js`.

---
