// Builds family recordings (the file downloaded from the app's "Pere hääl" page)
// into the app, so they play on every device instead of the generated voice.
//   node tools/import-family.js toolijooga-pere-haal.json
// Needs Node and ffmpeg. Imported clips are listed in audio/family.json, and
// tools/make-voice.js leaves them alone (even with --force).
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const src = process.argv[2];
if (!src) { console.error('Usage: node tools/import-family.js <exported-file.json>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(src, 'utf8'));
if (data.app !== 'toolijooga' || !Array.isArray(data.items)) throw new Error('Not a Toolijooga recordings file');

const famFile = path.join(root, 'audio', 'family.json');
const family = fs.existsSync(famFile) ? JSON.parse(fs.readFileSync(famFile, 'utf8')) : {};
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'family-'));
for (const it of data.items) {
  if (!/^[0-9a-z]+$/.test(it.key)) { console.warn('skipping odd key', it.key); continue; }
  const inFile = path.join(tmp, it.key + '.rec');
  fs.writeFileSync(inFile, Buffer.from(it.data, 'base64'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', inFile, '-af',
    'highpass=f=80,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1,areverse,loudnorm=I=-18:TP=-2',
    '-ac', '1', '-ar', '24000', '-b:a', '64k', path.join(root, 'audio', it.key + '.mp3')]);
  family[it.key] = it.text;
  console.log(`audio/${it.key}.mp3  ${String(it.text).slice(0, 60)}`);
}
fs.writeFileSync(famFile, JSON.stringify(family, null, 1));
console.log(`Imported ${data.items.length} recording(s).`);
