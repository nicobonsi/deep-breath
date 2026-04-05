#!/usr/bin/env node
/**
 * Generate ElevenLabs audio for all guided meditation phases.
 * Outputs MP3s to public/audio/{techniqueId}-{phaseIndex}.mp3
 *
 * Usage:
 *   ELEVEN_LABS_API_KEY=sk_... node scripts/generate-audio.js
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
  stability:         0.75,
  similarity_boost:  0.75,
  speed:             0.8,
  style:             0.15,
  use_speaker_boost: true,
};

// ── Inline technique data (mirrors src/data/techniques.js) ────
const techniques = [
  {
    id: 'loving-kindness',
    phases: [
      { label: 'Settle',            instruction: 'Sit comfortably with your spine gently upright. Allow your shoulders to soften away from your ears. Close your eyes and let each breath arrive without effort — simply feel yourself arriving here.' },
      { label: 'Hand on Heart',     instruction: 'Place one hand over your heart. Feel the gentle warmth of your own touch. This gesture signals to your nervous system that you are safe, cared for, and held.' },
      { label: 'Kindness to Self',  instruction: 'Silently repeat, feeling the meaning behind each word:\n"May I be safe.\nMay I be healthy.\nMay I be happy.\nMay I live with ease."\nLet these phrases settle like a warm light in your chest.' },
      { label: 'A Loved One',       instruction: 'Bring to mind someone you deeply love — their face, their presence. Direct the same phrases toward them:\n"May you be safe.\nMay you be healthy.\nMay you be happy.\nMay you live with ease."\nFeel the warmth naturally extending outward.' },
      { label: 'A Neutral Person',  instruction: 'Picture someone you feel neutral about — perhaps an acquaintance or a stranger you passed today. Without judgment, offer them the same loving-kindness:\n"May you be safe. May you be happy. May you be at ease."' },
      { label: 'A Difficult Person',instruction: 'Gently bring to mind someone who has challenged you — without needing to condone their actions. Offer the same phrases as best you can. Even a small flicker of goodwill is enough.' },
      { label: 'All Beings',        instruction: 'Expand your awareness outward — to your city, your country, the whole Earth. Silently radiate:\n"May all beings be safe.\nMay all beings be healthy.\nMay all beings be happy.\nMay all beings be at ease."\nLet kindness ripple outward without limit.' },
      { label: 'Return',            instruction: 'Gently bring awareness back to your breath and your body. Notice any warmth or openness in your chest. When you\'re ready, slowly open your eyes, carrying this kindness with you.' },
    ],
  },
  {
    id: 'rain',
    phases: [
      { label: 'Settle',        instruction: 'Find a comfortable seated position. Take three slow, deep breaths — allowing each exhale to be a little longer than the inhale. Feel your body settle with each breath. There is nowhere to be but here.' },
      { label: 'R — Recognize', instruction: 'Bring attention to what is arising right now — perhaps a feeling of stress, worry, sadness, or restlessness. Name it silently and simply: "There is anxiety." "There is grief." Creating space with this recognition is the first step.' },
      { label: 'A — Allow',     instruction: 'With each exhale, invite this feeling to be exactly as it is — without needing to fix or push it away. You might whisper inwardly: "It\'s okay. You\'re allowed to be here." Let the feeling exist without fighting it.' },
      { label: 'I — Investigate',instruction: 'With gentle curiosity, explore where this emotion lives in your body. Is there tightness in the chest? A heaviness in the throat? A knot in the stomach? Place a hand there if you like. Ask softly: "What does this part of me most need right now?"' },
      { label: 'N — Nurture',   instruction: 'Place both hands over your heart and offer yourself what you need most — perhaps: "I care about you." "You are not alone." "This too shall pass." Breathe slowly, letting this compassion soak into every part of you that is hurting.' },
      { label: 'Rest',          instruction: 'Let go of the technique entirely. Simply rest in open, gentle awareness. Notice what is here after RAIN — perhaps a subtle spaciousness, a softening, a quiet presence. Nothing needs to be different right now.' },
      { label: 'Return',        instruction: 'Gradually bring awareness back to the room around you. Feel your feet on the floor, your hands in your lap. Open your eyes slowly. You have just tended to yourself with great care.' },
    ],
  },
  {
    id: 'mountain',
    phases: [
      { label: 'Ground the Body',      instruction: 'Sit with your spine naturally tall, feeling the full weight of your body supported by what is beneath you. Press gently into this support. Let your arms rest heavy. Feel yourself arriving — solid, stable, present.' },
      { label: 'Breath Awareness',     instruction: 'Bring attention to your breathing — the cool air arriving, the warm air leaving. Ride each breath without controlling it. Let your attention settle here, like sediment slowly drifting to the floor of a still lake.' },
      { label: 'Visualise the Mountain',instruction: 'In your mind\'s eye, picture a mountain — one you know or one you imagine. See it standing majestically: its base rooted in the earth, its peak rising into open sky. Notice its sheer size, its stillness, its ancient presence.' },
      { label: 'Become the Mountain',  instruction: 'Feel yourself becoming the mountain. Your seat is the base — broad, solid, immovable. Your head is the summit — clear, high, open. You belong exactly where you are, rooted in this moment with the same timeless stability.' },
      { label: 'Seasons Pass',         instruction: 'Imagine seasons moving across the mountain. Spring blossoms, summer heat, autumn leaves drifting, winter snow covering the peak. The mountain simply is — unmoved by what passes over it. Feel this same unshakeable quality in yourself.' },
      { label: 'Weather Passes',       instruction: 'Now imagine storms — wind, lightning, driving rain. The weather arrives, rages, and moves on. Throughout it all, the mountain remains completely still in its essence. Whatever storms visit your life, this stillness is always here.' },
      { label: 'Your Nature',          instruction: 'Recognise that this mountain quality — steadiness, spaciousness, presence — is not something you create. It is your nature. It is always here, beneath the movement of thoughts and feelings, waiting to be remembered.' },
      { label: 'Return',               instruction: 'Gently sense back into your body, your breath, the room around you. Bring the mountain\'s stillness with you as you slowly open your eyes. You can return to this quality at any moment, anywhere.' },
    ],
  },
  {
    id: 'gratitude',
    phases: [
      { label: 'Settle & Arrive',     instruction: 'Sit comfortably and close your eyes. Take three deep, generous breaths — inhaling fully, exhaling completely. Set a quiet intention: to open your heart to everything that is good in your life, however small.' },
      { label: 'Gratitude for Life',  instruction: 'Begin with the most fundamental gifts: your breath moving on its own, your heart beating without your effort, the body carrying you through each day. Whisper inwardly: "I am grateful for this breath. I am grateful for this life."' },
      { label: 'People',              instruction: 'Bring to mind people who have touched your life with kindness — a parent, a friend, a teacher, even a kind stranger. Picture their faces one by one. For each, feel genuine thanks: "I am grateful for you. Thank you for being in my life."' },
      { label: 'Moments of Beauty',   instruction: 'Recall a moment of beauty or joy — a sunset, a burst of laughter, a piece of music that moved you, a walk in nature. Let the memory fill you completely. Notice how gratitude and beauty live in the same feeling.' },
      { label: 'Difficult Times',     instruction: 'With openness, bring to mind a challenge you have moved through. Notice what it taught you — perhaps strength, patience, perspective, or compassion. Whisper: "I am grateful for what I learned. I am grateful for the person that difficulty helped me become."' },
      { label: 'This Moment',         instruction: 'Rest in gratitude for right now — this breath, this moment of stillness, this time you have given yourself. Nothing needs to be added or changed. This moment, as it is, is enough.' },
      { label: 'Return',              instruction: 'Gently bring awareness back to the room. Let the warmth of gratitude stay with you like a hand on your heart. Open your eyes softly. Carry this appreciation into the rest of your day.' },
    ],
  },
  {
    id: 'pmr',
    phases: [
      { label: 'Settle',              instruction: 'Lie down or sit with your limbs uncrossed. Take three slow belly breaths. With each exhale, let your body become a little heavier, a little more supported. There is nothing to do right now except notice and release.' },
      { label: 'Feet & Calves',       instruction: 'Inhale and curl your toes downward — tense the soles of your feet and your calves firmly for 5 seconds. Feel the tightness fully. Now exhale and let go completely. Notice the warm rush of relaxation flooding in.' },
      { label: 'Thighs & Hips',       instruction: 'Inhale and squeeze your thighs and buttocks tightly — hold for 5 seconds, feeling the tension in these large, strong muscles. Now exhale and release everything. Feel the heaviness and ease spreading downward.' },
      { label: 'Belly & Lower Back',  instruction: 'Inhale and draw your abdomen in, tightening your core and gently arching your lower back — hold for 5 seconds. Exhale and let your belly soften completely, your back melting into support beneath you.' },
      { label: 'Chest & Shoulders',   instruction: 'Inhale deeply and draw your shoulders up toward your ears, squeezing your shoulder blades together and tensing your chest — hold for 5 seconds. Exhale and let everything drop. Feel tension dissolving from your upper body.' },
      { label: 'Arms & Hands',        instruction: 'Inhale and make tight fists, tensing your forearms and upper arms simultaneously — hold for 5 seconds, feeling the strength. Exhale and let your hands open softly, your arms becoming warm and heavy.' },
      { label: 'Face & Jaw',          instruction: 'Inhale and scrunch your whole face — clench your jaw, furrow your brow, squeeze your eyes shut — hold for 5 seconds. Exhale and let your face completely smooth out. Feel the skin of your forehead release, your jaw unclench, your eyes soften.' },
      { label: 'Whole Body Release',  instruction: 'Scan from your toes to the crown of your head. Your entire body is deeply relaxed — heavy, warm, and still. Breathe slowly and let each exhale deepen this release. You have released tension from every part of yourself.' },
      { label: 'Rest',                instruction: 'Simply rest here in this profound stillness. Your body knows how to relax deeply when given permission. There is nowhere to go and nothing to do. Just breathe and be completely at ease.' },
    ],
  },
  {
    id: 'safe-place',
    phases: [
      { label: 'Ground & Settle',   instruction: 'Find a comfortable position and close your eyes. Press your feet gently into the ground. Feel the full support beneath you holding you safely. Take three deep, slow breaths — each exhale a letting go, a deeper settling.' },
      { label: 'Deepen the Breath', instruction: 'Continue breathing so your exhale is noticeably longer than your inhale. This signals safety to your nervous system. With each exhale, feel your body growing heavier, softer, more at ease.' },
      { label: 'Find Your Place',   instruction: 'In your mind\'s eye, let a safe place appear — real or imagined, indoors or outdoors, familiar or fantastical. It might be a sun-warmed beach, a forest clearing, a cosy room, a mountain meadow. Let it come naturally without forcing it.' },
      { label: 'See It Clearly',    instruction: 'Look around your safe place using your inner vision. Notice the colours and the quality of light — is it golden, soft, bright? See the textures, the shapes, the horizon or the walls. Make it vivid, make it yours.' },
      { label: 'Hear It',           instruction: 'Now listen to the sounds of this place. Perhaps gentle water, wind through leaves, birdsong, the crackle of a fire, or perhaps a profound healing silence. Let these sounds deepen your sense of peace and belonging here.' },
      { label: 'Feel It',           instruction: 'Notice the temperature of the air on your skin — warm or cool, still or gently moving. Feel the ground or surface beneath you. Notice any scents — earth, salt air, flowers, fresh rain. Let your whole body settle into this place.' },
      { label: 'Feel Safe',         instruction: 'Rest in the feeling of this place — the complete safety, the ease, the acceptance. You belong here. Nothing here can harm you. Let this feeling of safety soak deeply into your body and your mind.' },
      { label: 'Anchor It',         instruction: 'Know that this place is always available to you — in an instant, with a few breaths and closed eyes, you can return here. It lives inside you. Press one hand to your heart as an anchor to remember the feeling.' },
      { label: 'Return',            instruction: 'Slowly begin to bring awareness back — feel your body in the room, your breath, the sounds around you. Open your eyes gently when you\'re ready. Carry the calm of your safe place with you into the rest of your day.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────

const apiKey = process.env.ELEVEN_LABS_API_KEY;
const force  = process.argv.includes('--force');

if (!apiKey) {
  console.error('Error: set ELEVEN_LABS_API_KEY environment variable.');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

async function generateOne(techniqueId, phaseIndex, text) {
  const filename = `${techniqueId}-${phaseIndex}.mp3`;
  const outPath  = join(OUT_DIR, filename);

  if (!force && existsSync(outPath)) {
    console.log(`  skip  ${filename} (already exists)`);
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
  let total = 0;
  for (const t of techniques) total += t.phases.length;
  console.log(`Generating audio for ${techniques.length} techniques, ${total} phases…\n`);

  for (const technique of techniques) {
    console.log(`▸ ${technique.id}`);
    for (let i = 0; i < technique.phases.length; i++) {
      await generateOne(technique.id, i, technique.phases[i].instruction);
    }
  }

  console.log('\nDone. Files are in public/audio/');
}

main().catch(err => { console.error(err.message); process.exit(1); });
