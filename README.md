# Deep Breath

A minimal, beautiful breathing and meditation app built with React + Vite. Designed for eyes-closed use — audio voice-over counts along with each breathing phase.

**Live:** https://nicobonsi.github.io/deep-breath/

---

## Features

### Breathing Techniques
| Technique | Default timing | Voice counting |
|---|---|---|
| Box Breathing | 4×4×4×4 | ✓ (4×4 and 5×5) |
| 4-7-8 Breathing | 4-7-8 | ✓ |
| Coherent Breathing | 6×6 | ✓ (5×5 and 6×6) |
| Wim Hof Method | 2×1 (30 cycles) | ✓ (2×1 and 3×2) |
| Belly Breathing | 4×6 | ✓ |
| Mindfulness of Breath | 5×5 | — |

### Guided Meditations (with voice narration)
- Loving-Kindness (Metta) — 10 min
- RAIN Meditation — 10 min
- Mountain Meditation — 12 min
- Gratitude Meditation — 8 min
- Progressive Muscle Relaxation — 12 min
- Safe Place Visualisation — 10 min

### Other
- Editable phase durations (tap any chip when idle)
- Ambient sound backgrounds (rain, ocean, wind, fire, stream, singing bowl)
- Background photo picker
- Count-up display (1→N, not N→1)
- Voice toggle for breathing count (disabled when timing has no audio)
- Swipe to advance phase in guided meditations

---

## Audio

Pre-generated MP3s live in `public/audio/`:
- `{techniqueId}-{phaseIndex}.mp3` — guided meditation narration (ElevenLabs, Daniel voice)
- `count-{1-8}.mp3` — breathing count numbers 1–8 (ElevenLabs, Daniel voice)

### Regenerating audio

```bash
# Meditation narration
ELEVEN_LABS_API_KEY=sk_... npm run generate-audio

# Breathing count numbers
ELEVEN_LABS_API_KEY=sk_... npm run generate-counting-audio
```

Pass `--force` to overwrite existing files.

---

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run deploy     # build + push to gh-pages
```

---

## Project structure

```
src/
  data/techniques.js          # All technique definitions
  hooks/
    useBreathing.js           # Core timing engine (countdown / displayCount / progress)
    useBreathingCount.js      # Voice counting toggle + audio playback
    useGuidedAudio.js         # Preloaded MP3 pool for guided meditations
    useAmbientSound.js        # Web Audio procedural ambient sounds
    useTechniqueSettings.js   # localStorage persistence of custom durations
  components/
    BreathingGuide/
      index.jsx               # Routes to Box/Circle/Guided + voice toggle
      BoxGuide.jsx            # Animated ball on square path
      CircleGuide.jsx         # Expanding/contracting orb
      GuidedMeditation.jsx    # Full-screen text + voice narration
    PhaseStrip/               # Editable duration chips
    TechniqueSelector/        # Technique picker modal
    SoundControl/             # Ambient sound + volume
    BackgroundPicker/         # Background photo selector
scripts/
  generate-audio.js           # ElevenLabs: guided meditation MP3s
  generate-counting-audio.js  # ElevenLabs: count-1 through count-8 MP3s
public/audio/                 # Pre-generated MP3s (committed to repo)
```
