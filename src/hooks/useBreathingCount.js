import { useState, useEffect, useRef } from 'react';

// Technique + duration combos that have pre-generated counting audio
const VOICE_COMBOS = {
  'box':      [[4,4,4,4], [5,5,5,5]],
  '478':      [[4,7,8]],
  'coherent': [[5,5], [6,6]],
  'wim-hof':  [[2,1], [3,2]],
  'belly':    [[4,6]],
};

export const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

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

// Each file is a smooth single-take sequence: "one. two. three. four." etc.
// Indexed by duration: pool[3] = count-seq-4.mp3 (counts 1→4)
const SEQ_COUNT = 8;

export function useBreathingCount(technique, phaseIndex, phase, isRunning) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speed, setSpeedState]          = useState(1);
  const speedRef  = useRef(1);
  const poolRef   = useRef([]);
  const activeRef = useRef(null);
  const canUseVoice = isSupported(technique);

  // Preload count-seq-1.mp3 through count-seq-8.mp3
  useEffect(() => {
    const pool = Array.from({ length: SEQ_COUNT }, (_, i) => {
      const audio = new Audio(`${import.meta.env.BASE_URL}audio/count-seq-${i + 1}.mp3`);
      audio.preload = 'auto';
      return audio;
    });
    poolRef.current = pool;
    return () => {
      pool.forEach(a => { a.pause(); a.src = ''; });
      poolRef.current = [];
      activeRef.current = null;
    };
  }, []);

  // Auto-disable when technique / durations no longer match a supported combo
  useEffect(() => {
    if (!canUseVoice) {
      stopActive();
      setVoiceEnabled(false);
    }
  }, [canUseVoice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play the full sequence for this phase whenever the phase changes or session starts
  useEffect(() => {
    stopActive();
    if (!voiceEnabled || !isRunning || !canUseVoice) return;

    const dur = phase?.duration;
    if (!dur || dur < 1 || dur > SEQ_COUNT) return;

    const audio = poolRef.current[dur - 1];
    if (!audio) return;

    audio.currentTime  = 0;
    audio.playbackRate = speedRef.current;
    audio.play().catch(() => {});
    activeRef.current = audio;
  }, [phaseIndex, voiceEnabled, isRunning, canUseVoice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pause / resume audio with the session
  useEffect(() => {
    if (!activeRef.current) return;
    if (isRunning) {
      activeRef.current.play().catch(() => {});
    } else {
      activeRef.current.pause();
    }
  }, [isRunning]);

  function stopActive() {
    if (activeRef.current) {
      activeRef.current.pause();
      activeRef.current.currentTime = 0;
      activeRef.current = null;
    }
  }

  const setSpeed = (s) => {
    speedRef.current = s;
    setSpeedState(s);
    if (activeRef.current) activeRef.current.playbackRate = s;
  };

  const toggleVoice = () => {
    if (!canUseVoice) return;
    if (voiceEnabled) { stopActive(); }
    setVoiceEnabled(v => !v);
  };

  return { voiceEnabled, toggleVoice, canUseVoice, speed, setSpeed };
}
