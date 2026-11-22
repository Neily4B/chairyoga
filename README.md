# Toolijooga — chair yoga for pensioners (Estonian)

A simple, offline-capable web app of gentle chair yoga for Ingrid, written entirely in Estonian:
13 seated exercises plus 6 standing balance moves done beside the chair, holding its back.
The name used on the start and finish screens is set by `NAME` near the top of `index.html`.

- **Harjutuste raamat** (exercise book): each exercise with an animated illustration, numbered steps, repetitions and safety notes.
- **Alusta harjutamist** (guided session): short seated (~7 min), full seated (~15 min) or standing balance (~10 min) plan;
  the app tells her when to stand up and sit back down, with extra time for each. Shows each exercise, animates it with spoken-style cues ("Hinga sisse…"), counts down, chimes between exercises and keeps the screen awake.
- Large buttons, adjustable text size, no login, no adverts, no data leaves the device.
- **Narrated in Estonian**: a calm voice ("Külli", University of Tartu neural TTS, slightly slowed) speaks the cues during sessions,
  and every book page and the safety page has a **🔊 Kuula juhendit** (listen) button. Clips are stored in `audio/` and work offline.

## Voice clips
`node tools/make-voice.js` creates any missing clips (needs Node, ffmpeg, Playwright and access to api.tartunlp.ai);
add `--force` to regenerate all. Change `VOICE`/`SPEED` at the top of that script to try another voice.
To use a family member's recording instead, record the same phrase and save it over the matching file in `audio/`
(the browser console command `allPhrases()` lists every phrase and its file name).

## Family voice (Pere hääl)
The 🎙 **Pere hääl** page (link at the bottom of the start page) lets a family member record any prompt in their own
voice. Recordings are kept on that device and played instead of the generated voice; anything not recorded falls back
to Külli. To make recordings play on *every* device, tap **⬇ Laadi salvestused alla** to download a file, then run
`node tools/import-family.js <file>.json` and commit `audio/`. Imported clips are listed in `audio/family.json` and
`tools/make-voice.js` never overwrites them.

## Hosting
It is a static site (`index.html`, `manifest.webmanifest`, `sw.js`, `icons/`). Enable GitHub Pages
(Settings → Pages → Deploy from branch) and open the URL on the tablet/phone, then "Add to Home Screen".

## Before giving it to anyone
- Have a native Estonian speaker proof-read the text.
- The exercises are general gentle movements, not medical advice.
