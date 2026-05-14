#!/usr/bin/env node
/**
 * Generate ElevenLabs counting audio for breathing voice-over.
 * Outputs count-1.mp3 through count-8.mp3 to public/audio/
 *
 * Supported combos use counts up to:
 *   Box 4×4: 4   Box 5×5: 5   4-7-8: 8   Coherent 6×6: 6
 *   Wim Hof 3×2: 3   Belly 4×6: 6
 *
 * Usage:
 *   ELEVEN_LABS_API_KEY=sk_... node scripts/generate-counting-audio.js
 *
 * Re-running is safe — existing files are skipped unless you pass --force.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = join(__dirname, '../public/audio');

const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'; // Daniel – deep, calm British male
const MODEL_ID = 'eleven_turbo_v2';
const VOICE_SETTINGS = {
  stability:         0.88,
  similarity_boost:  0.70,
  speed:             0.82,
  style:             0.0,
  use_speaker_boost: false,
};

const COUNTS = [
  { n: 1, text: 'one'   },
  { n: 2, text: 'two'   },
  { n: 3, text: 'three' },
  { n: 4, text: 'four'  },
  { n: 5, text: 'five'  },
  { n: 6, text: 'six'   },
  { n: 7, text: 'seven' },
  { n: 8, text: 'eight' },
];

const apiKey = process.env.ELEVEN_LABS_API_KEY;
const force  = process.argv.includes('--force');

if (!apiKey) {
  console.error('Error: set ELEVEN_LABS_API_KEY environment variable.');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

async function generateCount(n, text) {
  const filename = `count-${n}.mp3`;
  const outPath  = join(OUT_DIR, filename);

  if (!force && existsSync(outPath)) {
    console.log(`  skip  ${filename}`);
    return;
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key':   apiKey,
      'Content-Type': 'application/json',
      'Accept':       'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: VOICE_SETTINGS,
    }),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); msg = j?.detail?.message ?? msg; } catch {}
    throw new Error(`ElevenLabs error for ${filename}: ${msg}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buffer);
  console.log(`  saved ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  console.log('Generating counting audio (count-1.mp3 … count-8.mp3)…\n');
  for (const { n, text } of COUNTS) {
    await generateCount(n, text);
  }
  console.log('\nDone. Files are in public/audio/');
}

main().catch(err => { console.error(err.message); process.exit(1); });
