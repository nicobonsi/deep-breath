import { useState, useEffect, useRef } from 'react';

// Technique + duration combos that have pre-generated counting audio
const VOICE_COMBOS = {
  'box':      [[4,4,4,4], [5,5,5,5]],
  '478':      [[4,7,8]],
  'coherent': [[5,5], [6,6]],
  'wim-hof':  [[2,1], [3,2]],
  'belly':    [[4,6]],
};

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

function isSupported(technique) {
  if (!technique) return false;
  const combos = VOICE_COMBOS[technique.id];
  if (!combos) return false;
  const durations = technique.phases.map(p => p.duration);
  return combos.some(combo =>
    combo.length === durations.length &&
    combo.every((d, i) => d === durations[i])
  );
}

export { SPEEDS };

export function useBreathingCount(technique, displayCount, isRunning) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const speedRef = useRef(1);
  const poolRef = useRef([]);
  const canUseVoice = isSupported(technique);

  // Preload count-1.mp3 through count-8.mp3
  useEffect(() => {
    const pool = Array.from({ length: 8 }, (_, i) => {
      const audio = new Audio(`${import.meta.env.BASE_URL}audio/count-${i + 1}.mp3`);
      audio.preload = 'auto';
      return audio;
    });
    poolRef.current = pool;
    return () => pool.forEach(a => { a.pause(); a.src = ''; });
  }, []);

  // Auto-disable when technique or durations no longer match a supported combo
  useEffect(() => {
    if (!canUseVoice) setVoiceEnabled(false);
  }, [canUseVoice]);

  // Play the number audio on each count tick
  useEffect(() => {
    if (!voiceEnabled || !isRunning || !canUseVoice) return;
    if (displayCount < 1 || displayCount > 8) return;
    const audio = poolRef.current[displayCount - 1];
    if (!audio) return;
    audio.currentTime = 0;
    audio.playbackRate = speedRef.current;
    audio.play().catch(() => {});
  }, [displayCount, voiceEnabled, isRunning, canUseVoice]);

  const setSpeed = (s) => {
    speedRef.current = s;
    setSpeedState(s);
  };

  const toggleVoice = () => {
    if (!canUseVoice) return;
    setVoiceEnabled(v => !v);
  };

  return { voiceEnabled, toggleVoice, canUseVoice, speed, setSpeed };
}
