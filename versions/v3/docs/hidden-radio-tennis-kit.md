# Hidden radio and tennis kit

Supersedes inline-radio.md and player-screen-radio.md. No YouTube, video player, song list, file picker, portrait screen or visible music icon is mounted.

Click the physical radio to start BGM; every subsequent click randomly chooses a different track. Ended tracks advance randomly. Audio is fetched only after interaction, at volume 0.22. Global mute and hidden tabs pause playback; returning/unmuting resumes a previously selected song. A transparent keyboard target is outlined only on keyboard focus. A small physical indicator lights during actual playback.

Music: Kevin MacLeod, Bossa Antigua (USUAN1700069), Life of Riley (USUAN1400054), Wallpaper (USUAN1100843), CC BY 4.0. Official catalog https://incompetech.com/music/royalty-free/pieces.json and license https://incompetech.com/music/royalty-free/licenses/. Downloaded from official mp3-royaltyfree directory, normalized to -19 LUFS and compressed at 96 kbps. Full-length files, approximately 8.4 MB total; only the selected file loads. Source details in public/audio/credits.json and credits.html. These are instrumental alternatives, not recordings of the user's earlier commercial song list.

About now uses a small original tennis kit bag with a racket, tucked notebook and ball. No portrait or literal biography text. Existing navigation is preserved.

Browser validation: initial audio has no source and is paused; physical radio hit target starts local MP3 at readyState 4 with progressing currentTime; next click switched from Bossa to Riley; global mute paused playback. No external embed required. Build and shuffle checks pass. No deployment.
