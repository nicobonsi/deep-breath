// Breathing and meditation techniques
// Add new techniques here - they'll automatically appear in the selector

export const techniques = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal counts of inhale, hold, exhale, hold. Reduces stress and improves focus.',
    category: 'breathing',
    color: '#6366f1', // indigo
    phases: [
      { label: 'Inhale',  duration: 4, direction: 'up'    },
      { label: 'Hold',    duration: 4, direction: 'right'  },
      { label: 'Exhale',  duration: 4, direction: 'down'   },
      { label: 'Hold',    duration: 4, direction: 'left'   },
    ],
    guideType: 'box',
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Inhale 4s, hold 7s, exhale 8s. Promotes sleep and calms the nervous system.',
    category: 'breathing',
    color: '#10b981', // emerald
    phases: [
      { label: 'Inhale',  duration: 4, direction: 'expand' },
      { label: 'Hold',    duration: 7, direction: 'hold'   },
      { label: 'Exhale',  duration: 8, direction: 'contract' },
    ],
    guideType: 'circle',
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: '5 breaths per minute. Synchronises heart rate and improves HRV.',
    category: 'breathing',
    color: '#f59e0b', // amber
    phases: [
      { label: 'Inhale',  duration: 6, direction: 'expand' },
      { label: 'Exhale',  duration: 6, direction: 'contract' },
    ],
    guideType: 'circle',
  },
  {
    id: 'wim-hof',
    name: 'Wim Hof Method',
    description: '30 deep breaths, retain, recovery breath. Energises and builds resilience.',
    category: 'breathing',
    color: '#3b82f6', // blue
    phases: [
      { label: 'Deep Inhale', duration: 2, direction: 'expand' },
      { label: 'Release',     duration: 1, direction: 'contract' },
    ],
    cycles: 30,
    guideType: 'circle',
    note: 'After 30 cycles: exhale fully and hold as long as comfortable.',
  },
  {
    id: 'belly',
    name: 'Belly Breathing',
    description: 'Diaphragmatic breathing. The foundation of all relaxation techniques.',
    category: 'breathing',
    color: '#8b5cf6', // violet
    phases: [
      { label: 'Inhale (belly out)', duration: 4, direction: 'expand' },
      { label: 'Exhale (belly in)',  duration: 6, direction: 'contract' },
    ],
    guideType: 'circle',
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    description: 'Mindfully move attention through each body part. Releases tension.',
    category: 'meditation',
    color: '#ec4899', // pink
    phases: [
      { label: 'Breathe & scan', duration: 6, direction: 'expand' },
      { label: 'Release',        duration: 6, direction: 'contract' },
    ],
    guideType: 'circle',
    note: 'Slowly scan from toes to crown, releasing tension as you exhale.',
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness Meditation',
    description: 'Observe breath without control. Anchor attention to the present.',
    category: 'meditation',
    color: '#14b8a6', // teal
    phases: [
      { label: 'Observe', duration: 5, direction: 'expand' },
      { label: 'Release', duration: 5, direction: 'contract' },
    ],
    guideType: 'circle',
    note: 'Simply watch each breath. When the mind wanders, gently return.',
  },
];

export const backgrounds = [
  { id: 'waterfall', label: 'Waterfall',  url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80' },
  { id: 'sunset',    label: 'Sunset',     url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80' },
  { id: 'sunrise',   label: 'Sunrise',    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
  { id: 'mountain',  label: 'Mountain',   url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80' },
  { id: 'ocean',     label: 'Ocean',      url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80' },
  { id: 'waves',     label: 'Waves',      url: 'https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=1920&q=80' },
  { id: 'ripples',   label: 'Ripples',    url: 'https://images.unsplash.com/photo-1468476396571-4d6f2a427ee7?w=1920&q=80' },
  { id: 'stones',    label: 'Stones',     url: 'https://images.unsplash.com/photo-1543779064-5f4cc1b4df2f?w=1920&q=80' },
  { id: 'forest',    label: 'Forest',     url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80' },
  { id: 'stars',     label: 'Stars',      url: 'https://images.unsplash.com/photo-1475274047050-1d0c0975864c?w=1920&q=80' },
  { id: 'none',      label: 'Dark',       url: null },
];

export const sounds = [
  { id: 'none',   label: 'Silence',    icon: '🔇', type: 'none' },
  { id: 'rain',   label: 'Rain',       icon: '🌧️', type: 'noise', params: { color: 'brown', freq: 400,  q: 0.5,  lfoRate: 0.05, lfoDepth: 0.3 } },
  { id: 'ocean',  label: 'Ocean',      icon: '🌊', type: 'noise', params: { color: 'brown', freq: 200,  q: 1.2,  lfoRate: 0.08, lfoDepth: 0.6 } },
  { id: 'wind',   label: 'Wind',       icon: '💨', type: 'noise', params: { color: 'white', freq: 800,  q: 0.3,  lfoRate: 0.03, lfoDepth: 0.5 } },
  { id: 'fire',   label: 'Fire',       icon: '🔥', type: 'noise', params: { color: 'brown', freq: 600,  q: 0.8,  lfoRate: 0.15, lfoDepth: 0.4 } },
  { id: 'stream', label: 'Stream',     icon: '🏞️', type: 'noise', params: { color: 'white', freq: 1200, q: 0.4,  lfoRate: 0.2,  lfoDepth: 0.3 } },
  { id: 'bells',  label: 'Singing Bowl', icon: '🔔', type: 'tone', params: { freq: 432, harmonics: [1, 2.756, 5.404], decay: 4 } },
];
