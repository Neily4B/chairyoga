// Generates the Estonian narration clips in audio/ using the University of Tartu
// neural text-to-speech service (https://neurokone.ee). Needs Node, ffmpeg and
// Playwright (to read the phrase list straight out of index.html).
//   node tools/make-voice.js            -> creates any missing clips
//   node tools/make-voice.js --force    -> regenerates everything
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');

const VOICE = 'kylli';     // female voice (Külli)
const SPEED = 0.85;        // a little slower than normal, for a lulling pace
const root = path.join(__dirname, '..');
const force = process.argv.includes('--force');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.join(root, 'index.html'));
  const phrases = await p.evaluate(() => allPhrases());
  await b.close();

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'voice-'));
  let made = 0;
  for (const { text, file } of phrases) {
    const out = path.join(root, file);
    if (!force && fs.existsSync(out)) continue;
    const wav = path.join(tmp, 'clip.wav');
    // curl (rather than fetch) so HTTPS proxies are respected.
    execFileSync('curl', ['-sS', '--fail', '--retry', '4', '--retry-all-errors', '--retry-delay', '2', '-m', '120',
      '-X', 'POST', 'https://api.tartunlp.ai/text-to-speech/v2', '-H', 'Content-Type: application/json',
      '--data-binary', JSON.stringify({ text, speaker: VOICE, speed: SPEED }), '-o', wav]);
    // Trim silence at both ends (keeps cues in step with the figure), even out volume, mono MP3, small file.
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-af', 'silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.1,areverse,silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.1,areverse,loudnorm=I=-18:TP=-2', '-ac', '1', '-ar', '24000', '-b:a', '48k', out]);
    made++;
    console.log(`${file}  ${text.slice(0, 60)}`);
  }
  // Remove clips for phrases that no longer exist.
  const keep = new Set(phrases.map(x => path.basename(x.file)));
  for (const f of fs.readdirSync(path.join(root, 'audio'))) {
    if (f.endsWith('.mp3') && !keep.has(f)) { fs.unlinkSync(path.join(root, 'audio', f)); console.log('removed old clip', f); }
  }
  // List used by the service worker to make every clip available offline.
  fs.writeFileSync(path.join(root, 'audio', 'list.json'), JSON.stringify(phrases.map(x => x.file).sort(), null, 1));
  console.log(`Done: ${made} new clip(s), ${phrases.length} total.`);
})().catch(e => { console.error(e.message); process.exit(1); });
