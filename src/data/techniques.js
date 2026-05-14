// ============================================================
// Deep Breath – Techniques & Session Data
// Add new techniques here — they automatically appear in the selector.
//
// guideType options:
//   'box'     → animated ball travelling around a square
//   'circle'  → expanding / contracting orb
//   'guided'  → full-screen text instructions (meditation)
// ============================================================

export const techniques = [

  // ── Breathing ────────────────────────────────────────────
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal counts of inhale, hold, exhale, hold. Reduces stress and sharpens focus. Used by Navy SEALs and first responders.',
    category: 'breathing',
    color: '#6366f1',
    guideType: 'box',
    linkedDurations: true,   // all sides must be equal — changing one changes all
    phases: [
      { label: 'Inhale',  duration: 4, direction: 'up'    },
      { label: 'Hold',    duration: 4, direction: 'right'  },
      { label: 'Exhale',  duration: 4, direction: 'down'   },
      { label: 'Hold',    duration: 4, direction: 'left'   },
    ],
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Inhale 4s, hold 7s, exhale 8s. Dr Andrew Weil\'s method. Promotes sleep and calms the nervous system quickly.',
    category: 'breathing',
    color: '#10b981',
    guideType: 'circle',
    phases: [
      { label: 'Inhale',  duration: 4, direction: 'expand'   },
      { label: 'Hold',    duration: 7, direction: 'hold'     },
      { label: 'Exhale',  duration: 8, direction: 'contract' },
    ],
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: '5 breaths per minute. Synchronises heart rate variability and balances the nervous system.',
    category: 'breathing',
    color: '#f59e0b',
    guideType: 'circle',
    phases: [
      { label: 'Inhale',  duration: 6, direction: 'expand'   },
      { label: 'Exhale',  duration: 6, direction: 'contract' },
    ],
  },
  {
    id: 'wim-hof',
    name: 'Wim Hof Method',
    description: '30 deep power breaths, then a breath retention. Energises the body and builds mental resilience.',
    category: 'breathing',
    color: '#3b82f6',
    guideType: 'circle',
    cycles: 30,
    note: 'After 30 cycles: exhale fully and hold as long as comfortable, then take a recovery breath.',
    phases: [
      { label: 'Deep Inhale', duration: 2, direction: 'expand'   },
      { label: 'Release',     duration: 1, direction: 'contract' },
    ],
  },
  {
    id: 'belly',
    name: 'Belly Breathing',
    description: 'Diaphragmatic breathing — the foundation of all relaxation. Engages the full lung capacity.',
    category: 'breathing',
    color: '#8b5cf6',
    guideType: 'circle',
    phases: [
      { label: 'Inhale (belly out)', duration: 4, direction: 'expand'   },
      { label: 'Exhale (belly in)',  duration: 6, direction: 'contract' },
    ],
  },

  // ── Meditation – basic ────────────────────────────────────
  {
    id: 'mindfulness',
    name: 'Mindfulness of Breath',
    description: 'Simply observe each breath without controlling it. Anchor attention to the present moment.',
    category: 'meditation',
    color: '#14b8a6',
    guideType: 'circle',
    note: 'Watch each breath like clouds passing. When the mind wanders, gently return.',
    phases: [
      { label: 'Observe', duration: 5, direction: 'expand'   },
      { label: 'Release', duration: 5, direction: 'contract' },
    ],
  },

  // ── Meditation – guided ───────────────────────────────────

  {
    id: 'loving-kindness',
    name: 'Loving-Kindness',
    description: 'Metta — radiate warmth first to yourself, then to loved ones, and finally to all beings. Increases joy and compassion.',
    category: 'meditation',
    color: '#f43f5e',
    guideType: 'guided',
    duration: '10 min',
    phases: [
      {
        label: 'Settle',
        duration: 60,
        instruction: 'Sit comfortably with your spine gently upright. Allow your shoulders to soften away from your ears. Close your eyes and let each breath arrive without effort — simply feel yourself arriving here.',
      },
      {
        label: 'Hand on Heart',
        duration: 30,
        instruction: 'Place one hand over your heart. Feel the gentle warmth of your own touch. This gesture signals to your nervous system that you are safe, cared for, and held.',
      },
      {
        label: 'Kindness to Self',
        duration: 90,
        instruction: 'Silently repeat, feeling the meaning behind each word:\n"May I be safe.\nMay I be healthy.\nMay I be happy.\nMay I live with ease."\nLet these phrases settle like a warm light in your chest.',
      },
      {
        label: 'A Loved One',
        duration: 90,
        instruction: 'Bring to mind someone you deeply love — their face, their presence. Direct the same phrases toward them:\n"May you be safe.\nMay you be healthy.\nMay you be happy.\nMay you live with ease."\nFeel the warmth naturally extending outward.',
      },
      {
        label: 'A Neutral Person',
        duration: 60,
        instruction: 'Picture someone you feel neutral about — perhaps an acquaintance or a stranger you passed today. Without judgment, offer them the same loving-kindness:\n"May you be safe. May you be happy. May you be at ease."',
      },
      {
        label: 'A Difficult Person',
        duration: 60,
        instruction: 'Gently bring to mind someone who has challenged you — without needing to condone their actions. Offer the same phrases as best you can. Even a small flicker of goodwill is enough.',
      },
      {
        label: 'All Beings',
        duration: 90,
        instruction: 'Expand your awareness outward — to your city, your country, the whole Earth. Silently radiate:\n"May all beings be safe.\nMay all beings be healthy.\nMay all beings be happy.\nMay all beings be at ease."\nLet kindness ripple outward without limit.',
      },
      {
        label: 'Return',
        duration: 40,
        instruction: 'Gently bring awareness back to your breath and your body. Notice any warmth or openness in your chest. When you\'re ready, slowly open your eyes, carrying this kindness with you.',
      },
    ],
  },

  {
    id: 'rain',
    name: 'RAIN Meditation',
    description: 'Recognize · Allow · Investigate · Nurture. Tara Brach\'s practice for meeting difficult emotions with compassion.',
    category: 'meditation',
    color: '#818cf8',
    guideType: 'guided',
    duration: '10 min',
    phases: [
      {
        label: 'Settle',
        duration: 60,
        instruction: 'Find a comfortable seated position. Take three slow, deep breaths — allowing each exhale to be a little longer than the inhale. Feel your body settle with each breath. There is nowhere to be but here.',
      },
      {
        label: 'R — Recognize',
        duration: 90,
        instruction: 'Bring attention to what is arising right now — perhaps a feeling of stress, worry, sadness, or restlessness. Name it silently and simply: "There is anxiety." "There is grief." Creating space with this recognition is the first step.',
      },
      {
        label: 'A — Allow',
        duration: 90,
        instruction: 'With each exhale, invite this feeling to be exactly as it is — without needing to fix or push it away. You might whisper inwardly: "It\'s okay. You\'re allowed to be here." Let the feeling exist without fighting it.',
      },
      {
        label: 'I — Investigate',
        duration: 120,
        instruction: 'With gentle curiosity, explore where this emotion lives in your body. Is there tightness in the chest? A heaviness in the throat? A knot in the stomach? Place a hand there if you like. Ask softly: "What does this part of me most need right now?"',
      },
      {
        label: 'N — Nurture',
        duration: 120,
        instruction: 'Place both hands over your heart and offer yourself what you need most — perhaps: "I care about you." "You are not alone." "This too shall pass." Breathe slowly, letting this compassion soak into every part of you that is hurting.',
      },
      {
        label: 'Rest',
        duration: 60,
        instruction: 'Let go of the technique entirely. Simply rest in open, gentle awareness. Notice what is here after RAIN — perhaps a subtle spaciousness, a softening, a quiet presence. Nothing needs to be different right now.',
      },
      {
        label: 'Return',
        duration: 40,
        instruction: 'Gradually bring awareness back to the room around you. Feel your feet on the floor, your hands in your lap. Open your eyes slowly. You have just tended to yourself with great care.',
      },
    ],
  },

  {
    id: 'mountain',
    name: 'Mountain Meditation',
    description: 'Jon Kabat-Zinn\'s MBSR classic. Embody the mountain\'s unshakeable stillness and find equanimity through all of life\'s seasons.',
    category: 'meditation',
    color: '#a78bfa',
    guideType: 'guided',
    duration: '12 min',
    phases: [
      {
        label: 'Ground the Body',
        duration: 60,
        instruction: 'Sit with your spine naturally tall, feeling the full weight of your body supported by what is beneath you. Press gently into this support. Let your arms rest heavy. Feel yourself arriving — solid, stable, present.',
      },
      {
        label: 'Breath Awareness',
        duration: 60,
        instruction: 'Bring attention to your breathing — the cool air arriving, the warm air leaving. Ride each breath without controlling it. Let your attention settle here, like sediment slowly drifting to the floor of a still lake.',
      },
      {
        label: 'Visualise the Mountain',
        duration: 90,
        instruction: 'In your mind\'s eye, picture a mountain — one you know or one you imagine. See it standing majestically: its base rooted in the earth, its peak rising into open sky. Notice its sheer size, its stillness, its ancient presence.',
      },
      {
        label: 'Become the Mountain',
        duration: 90,
        instruction: 'Feel yourself becoming the mountain. Your seat is the base — broad, solid, immovable. Your head is the summit — clear, high, open. You belong exactly where you are, rooted in this moment with the same timeless stability.',
      },
      {
        label: 'Seasons Pass',
        duration: 90,
        instruction: 'Imagine seasons moving across the mountain. Spring blossoms, summer heat, autumn leaves drifting, winter snow covering the peak. The mountain simply is — unmoved by what passes over it. Feel this same unshakeable quality in yourself.',
      },
      {
        label: 'Weather Passes',
        duration: 90,
        instruction: 'Now imagine storms — wind, lightning, driving rain. The weather arrives, rages, and moves on. Throughout it all, the mountain remains completely still in its essence. Whatever storms visit your life, this stillness is always here.',
      },
      {
        label: 'Your Nature',
        duration: 90,
        instruction: 'Recognise that this mountain quality — steadiness, spaciousness, presence — is not something you create. It is your nature. It is always here, beneath the movement of thoughts and feelings, waiting to be remembered.',
      },
      {
        label: 'Return',
        duration: 50,
        instruction: 'Gently sense back into your body, your breath, the room around you. Bring the mountain\'s stillness with you as you slowly open your eyes. You can return to this quality at any moment, anywhere.',
      },
    ],
  },

  {
    id: 'gratitude',
    name: 'Gratitude Meditation',
    description: 'Open the heart to appreciation — for life\'s simple gifts, the people who matter, and even the hard lessons. Lifts mood and rewires the brain toward the positive.',
    category: 'meditation',
    color: '#fb923c',
    guideType: 'guided',
    duration: '8 min',
    phases: [
      {
        label: 'Settle & Arrive',
        duration: 45,
        instruction: 'Sit comfortably and close your eyes. Take three deep, generous breaths — inhaling fully, exhaling completely. Set a quiet intention: to open your heart to everything that is good in your life, however small.',
      },
      {
        label: 'Gratitude for Life',
        duration: 75,
        instruction: 'Begin with the most fundamental gifts: your breath moving on its own, your heart beating without your effort, the body carrying you through each day. Whisper inwardly: "I am grateful for this breath. I am grateful for this life."',
      },
      {
        label: 'People',
        duration: 90,
        instruction: 'Bring to mind people who have touched your life with kindness — a parent, a friend, a teacher, even a kind stranger. Picture their faces one by one. For each, feel genuine thanks: "I am grateful for you. Thank you for being in my life."',
      },
      {
        label: 'Moments of Beauty',
        duration: 75,
        instruction: 'Recall a moment of beauty or joy — a sunset, a burst of laughter, a piece of music that moved you, a walk in nature. Let the memory fill you completely. Notice how gratitude and beauty live in the same feeling.',
      },
      {
        label: 'Difficult Times',
        duration: 75,
        instruction: 'With openness, bring to mind a challenge you have moved through. Notice what it taught you — perhaps strength, patience, perspective, or compassion. Whisper: "I am grateful for what I learned. I am grateful for the person that difficulty helped me become."',
      },
      {
        label: 'This Moment',
        duration: 60,
        instruction: 'Rest in gratitude for right now — this breath, this moment of stillness, this time you have given yourself. Nothing needs to be added or changed. This moment, as it is, is enough.',
      },
      {
        label: 'Return',
        duration: 40,
        instruction: 'Gently bring awareness back to the room. Let the warmth of gratitude stay with you like a hand on your heart. Open your eyes softly. Carry this appreciation into the rest of your day.',
      },
    ],
  },

  {
    id: 'pmr',
    name: 'Progressive Muscle Relaxation',
    description: 'Tense and release each muscle group in sequence. Dr Jacobson\'s method systematically dissolves physical tension and activates deep calm.',
    category: 'meditation',
    color: '#2dd4bf',
    guideType: 'guided',
    duration: '12 min',
    phases: [
      {
        label: 'Settle',
        duration: 60,
        instruction: 'Lie down or sit with your limbs uncrossed. Take three slow belly breaths. With each exhale, let your body become a little heavier, a little more supported. There is nothing to do right now except notice and release.',
      },
      {
        label: 'Feet & Calves',
        duration: 45,
        instruction: 'Inhale and curl your toes downward — tense the soles of your feet and your calves firmly for 5 seconds. Feel the tightness fully. Now exhale and let go completely. Notice the warm rush of relaxation flooding in.',
      },
      {
        label: 'Thighs & Hips',
        duration: 45,
        instruction: 'Inhale and squeeze your thighs and buttocks tightly — hold for 5 seconds, feeling the tension in these large, strong muscles. Now exhale and release everything. Feel the heaviness and ease spreading downward.',
      },
      {
        label: 'Belly & Lower Back',
        duration: 45,
        instruction: 'Inhale and draw your abdomen in, tightening your core and gently arching your lower back — hold for 5 seconds. Exhale and let your belly soften completely, your back melting into support beneath you.',
      },
      {
        label: 'Chest & Shoulders',
        duration: 45,
        instruction: 'Inhale deeply and draw your shoulders up toward your ears, squeezing your shoulder blades together and tensing your chest — hold for 5 seconds. Exhale and let everything drop. Feel tension dissolving from your upper body.',
      },
      {
        label: 'Arms & Hands',
        duration: 45,
        instruction: 'Inhale and make tight fists, tensing your forearms and upper arms simultaneously — hold for 5 seconds, feeling the strength. Exhale and let your hands open softly, your arms becoming warm and heavy.',
      },
      {
        label: 'Face & Jaw',
        duration: 45,
        instruction: 'Inhale and scrunch your whole face — clench your jaw, furrow your brow, squeeze your eyes shut — hold for 5 seconds. Exhale and let your face completely smooth out. Feel the skin of your forehead release, your jaw unclench, your eyes soften.',
      },
      {
        label: 'Whole Body Release',
        duration: 90,
        instruction: 'Scan from your toes to the crown of your head. Your entire body is deeply relaxed — heavy, warm, and still. Breathe slowly and let each exhale deepen this release. You have released tension from every part of yourself.',
      },
      {
        label: 'Rest',
        duration: 50,
        instruction: 'Simply rest here in this profound stillness. Your body knows how to relax deeply when given permission. There is nowhere to go and nothing to do. Just breathe and be completely at ease.',
      },
    ],
  },

  {
    id: 'safe-place',
    name: 'Safe Place Visualisation',
    description: 'Build a vivid inner sanctuary you can return to anytime. Reduces anxiety, activates deep calm, and provides a reliable refuge during stress.',
    category: 'meditation',
    color: '#34d399',
    guideType: 'guided',
    duration: '10 min',
    phases: [
      {
        label: 'Ground & Settle',
        duration: 60,
        instruction: 'Find a comfortable position and close your eyes. Press your feet gently into the ground. Feel the full support beneath you holding you safely. Take three deep, slow breaths — each exhale a letting go, a deeper settling.',
      },
      {
        label: 'Deepen the Breath',
        duration: 60,
        instruction: 'Continue breathing so your exhale is noticeably longer than your inhale. This signals safety to your nervous system. With each exhale, feel your body growing heavier, softer, more at ease.',
      },
      {
        label: 'Find Your Place',
        duration: 90,
        instruction: 'In your mind\'s eye, let a safe place appear — real or imagined, indoors or outdoors, familiar or fantastical. It might be a sun-warmed beach, a forest clearing, a cosy room, a mountain meadow. Let it come naturally without forcing it.',
      },
      {
        label: 'See It Clearly',
        duration: 75,
        instruction: 'Look around your safe place using your inner vision. Notice the colours and the quality of light — is it golden, soft, bright? See the textures, the shapes, the horizon or the walls. Make it vivid, make it yours.',
      },
      {
        label: 'Hear It',
        duration: 75,
        instruction: 'Now listen to the sounds of this place. Perhaps gentle water, wind through leaves, birdsong, the crackle of a fire, or perhaps a profound healing silence. Let these sounds deepen your sense of peace and belonging here.',
      },
      {
        label: 'Feel It',
        duration: 75,
        instruction: 'Notice the temperature of the air on your skin — warm or cool, still or gently moving. Feel the ground or surface beneath you. Notice any scents — earth, salt air, flowers, fresh rain. Let your whole body settle into this place.',
      },
      {
        label: 'Feel Safe',
        duration: 90,
        instruction: 'Rest in the feeling of this place — the complete safety, the ease, the acceptance. You belong here. Nothing here can harm you. Let this feeling of safety soak deeply into your body and your mind.',
      },
      {
        label: 'Anchor It',
        duration: 60,
        instruction: 'Know that this place is always available to you — in an instant, with a few breaths and closed eyes, you can return here. It lives inside you. Press one hand to your heart as an anchor to remember the feeling.',
      },
      {
        label: 'Return',
        duration: 45,
        instruction: 'Slowly begin to bring awareness back — feel your body in the room, your breath, the sounds around you. Open your eyes gently when you\'re ready. Carry the calm of your safe place with you into the rest of your day.',
      },
    ],
  },

];

// ── Backgrounds ───────────────────────────────────────────────
export const backgrounds = [
  { id: 'sunset',    label: 'Sunset',     url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80' },
  { id: 'waterfall', label: 'Waterfall',  url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80' },
  { id: 'sunrise',   label: 'Sunrise',    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
  { id: 'mountain',  label: 'Mountain',   url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80' },
  { id: 'ocean',     label: 'Ocean',      url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80' },
  { id: 'waves',     label: 'Waves',      url: 'https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=1920&q=80' },
  { id: 'ripples',   label: 'Ripples',    url: 'https://images.unsplash.com/photo-1468476396571-4d6f2a427ee7?w=1920&q=80' },
  { id: 'stones',    label: 'Stones',     url: 'https://images.unsplash.com/photo-1763426294947-9ff31811820a?w=1920&q=80' },
  { id: 'forest',    label: 'Forest',     url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80' },
  { id: 'stars',     label: 'Stars',      url: 'https://images.unsplash.com/photo-1742626157111-59f3f1019a8a?w=1920&q=80' },
  { id: 'none',      label: 'Dark',       url: null },
];

// ── Sounds ────────────────────────────────────────────────────
export const sounds = [
  { id: 'none',   label: 'Silence',      icon: '🔇', type: 'none' },
  { id: 'rain',   label: 'Rain',         icon: '🌧️', type: 'noise', params: { color: 'brown', freq: 400,  q: 0.5,  lfoRate: 0.05, lfoDepth: 0.3 } },
  { id: 'ocean',  label: 'Ocean',        icon: '🌊', type: 'noise', params: { color: 'brown', freq: 200,  q: 1.2,  lfoRate: 0.08, lfoDepth: 0.6 } },
  { id: 'wind',   label: 'Wind',         icon: '💨', type: 'noise', params: { color: 'white', freq: 800,  q: 0.3,  lfoRate: 0.03, lfoDepth: 0.5 } },
  { id: 'fire',   label: 'Fire',         icon: '🔥', type: 'noise', params: { color: 'brown', freq: 600,  q: 0.8,  lfoRate: 0.15, lfoDepth: 0.4 } },
  { id: 'stream', label: 'Stream',       icon: '🏞️', type: 'noise', params: { color: 'white', freq: 1200, q: 0.4,  lfoRate: 0.2,  lfoDepth: 0.3 } },
  { id: 'bells',  label: 'Singing Bowl', icon: '🔔', type: 'tone',  params: { freq: 432, harmonics: [1, 2.756, 5.404], decay: 4 } },
];
