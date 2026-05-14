# Deep Breath — Claude context

## What this project is
A breathing and meditation web app. React + Vite, deployed to GitHub Pages (gh-pages). No backend.

## Key conventions

### Techniques
All techniques are defined in `src/data/techniques.js`. Adding a technique there automatically makes it appear in the selector. `guideType` controls which visual component renders: `'box'`, `'circle'`, or `'guided'`.

### Audio files
- Pre-generated and committed to `public/audio/` — do **not** generate at runtime for breathing techniques.
- Meditation narration: `{techniqueId}-{phaseIndex}.mp3` — regenerate with `npm run generate-audio`.
- Breathing count numbers: `count-1.mp3` through `count-8.mp3` — regenerate with `npm run generate-counting-audio`.
- Both scripts use ElevenLabs (Daniel voice, ID `onwK4e9ZLuTAKqWW03F9`, model `eleven_turbo_v2`).
- API key is **not** stored in the repo — user provides it at run time: `ELEVEN_LABS_API_KEY=... npm run generate-audio`.

### Countdown vs displayCount
`useBreathing` exports two countdown values:
- `countdown` — original descending value (used only by `GuidedMeditation` for time-remaining display)
- `displayCount` — ascending 1→N (used by `BoxGuide` and `CircleGuide` for the visible count number and by `useBreathingCount` for audio sync)

### Voice counting
`useBreathingCount` hook manages the Count toggle for breathing guides. It only enables the toggle when the current technique + durations exactly match a supported combo (defined in `VOICE_COMBOS` inside the hook). If the user edits durations to an unsupported value, the toggle auto-disables.

Supported combos:
- Box: [4,4,4,4] and [5,5,5,5]
- 4-7-8: [4,7,8]
- Coherent: [5,5] and [6,6]
- Wim Hof: [2,1] and [3,2]
- Belly: [4,6]

## Deployment
```bash
npm run deploy   # builds + pushes to gh-pages branch → GitHub Pages
git push         # if Vercel is connected, also triggers Vercel auto-deploy
```

## Common tasks

**Add a new breathing technique:** edit `src/data/techniques.js` only.

**Add a new guided meditation:** add to `src/data/techniques.js` (with `guideType: 'guided'` and `instruction` on each phase), then add to `scripts/generate-audio.js` and run it.

**Add a new supported voice-count combo:** update `VOICE_COMBOS` in `src/hooks/useBreathingCount.js`. The count files 1–8 are already generated; no new audio needed unless the max count exceeds 8.

**Change the ElevenLabs voice:** update `VOICE_ID` in both generation scripts and re-run them with `--force`.
