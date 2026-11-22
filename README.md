# Toolijooga — chair yoga for pensioners (Estonian)

A simple, offline-capable web app of 13 gentle chair-based yoga exercises, written entirely in Estonian.

- **Harjutuste raamat** (exercise book): each exercise with an animated illustration, numbered steps, repetitions and safety notes.
- **Alusta harjutamist** (guided session): short (~7 min) or full (~15 min) plan. Shows each exercise, animates it with spoken-style cues ("Hinga sisse…"), counts down, chimes between exercises and keeps the screen awake.
- Large buttons, adjustable text size, no login, no adverts, no data leaves the device.
- **Narrated in Estonian**: a calm voice ("Liivika", University of Tartu neural TTS, slightly slowed) speaks the cues during sessions,
  and every book page and the safety page has a **🔊 Kuula juhendit** (listen) button. Clips are stored in `audio/` and work offline.

## Voice clips
`node tools/make-voice.js` creates any missing clips (needs Node, ffmpeg, Playwright and access to api.tartunlp.ai);
add `--force` to regenerate all. Change `VOICE`/`SPEED` at the top of that script to try another voice.
To use a family member's recording instead, record the same phrase and save it over the matching file in `audio/`
(the browser console command `allPhrases()` lists every phrase and its file name).

## Hosting
It is a static site (`index.html`, `manifest.webmanifest`, `sw.js`, `icons/`). Enable GitHub Pages
(Settings → Pages → Deploy from branch) and open the URL on the tablet/phone, then "Add to Home Screen".

## Before giving it to anyone
- Have a native Estonian speaker proof-read the text.
- The exercises are general gentle movements, not medical advice.
