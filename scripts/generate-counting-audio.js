#!/usr/bin/env node
/**
 * Generate ElevenLabs counting sequences for breathing voice-over.
 * Each file is a smooth, single-take count: "one, two, three, four" etc.
 * Outputs count-seq-1.mp3 through count-seq-8.mp3 to public/audio/
 *
 * Sequences needed across all supported combos:
 *   Box 4×4: seq-4   Box 5×5: seq-5
 *   4-7-8: seq-4, seq-7, seq-8
 *   Coherent 5×5: seq-5   Coherent 6×6: seq-6
 *   Wim Hof 2×1: seq-2, seq-1   Wim Hof 3×2: seq-3, seq-2
 *   Belly 4×6: seq-4, seq-6
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
  stability:         0.90,
  similarity_boost:  0.72,
  speed:             0.75,   // slower for a calm, meditative count
  style:             0.0,
  use_speaker_boost: false,
};

const WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

// Build sequences: seq-1 = "one.", seq-2 = "one, two.", etc.
// Periods after each number create natural pauses in the TTS output.
const SEQUENCES = WORDS.map((_, i) => ({
  n:    i + 1,
  text: WORDS.slice(0, i + 1).join('. ') + '.',
}));

const apiKey = process.env.ELEVEN_LABS_API_KEY;
const force  = process.argv.includes('--force');

if (!apiKey) {
  console.error('Error: set ELEVEN_LABS_API_KEY environment variable.');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

async function generateSequence(n, text) {
  const filename = `count-seq-${n}.mp3`;
  const outPath  = join(OUT_DIR, filename);

  if (!force && existsSync(outPath)) {
    console.log(`  skip  ${filename}`);
    return;
  }

  console.log(`  generating ${filename}  "${text}"`);

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
  console.log(`  saved  ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  console.log('Generating counting sequence audio (count-seq-1.mp3 … count-seq-8.mp3)…\n');
  for (const { n, text } of SEQUENCES) {
    await generateSequence(n, text);
  }
  console.log('\nDone. Files are in public/audio/');
}

main().catch(err => { console.error(err.message); process.exit(1); });
