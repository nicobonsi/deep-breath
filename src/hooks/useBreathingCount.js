import { useState, useEffect, useRef } from 'react';

// Technique + duration combos that have pre-generated counting audio
const VOICE_COMBOS = {
  'box':      [[4,4,4,4], [5,5,5,5]],
  '478':      [[4,7,8]],
  'coherent': [[5,5], [6,6]],
  'wim-hof':  [[2,1], [3,2]],
  'belly':    [[4,6]],
};

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

// Individual number recordings: count-1.mp3 ("one") … count-8.mp3 ("eight").
// Each count is scheduled independently so audio stays locked to the 1s tick.
const MAX_COUNT = 8;

export function useBreathingCount(technique, phaseIndex, phase, isRunning, countdown) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const poolRef      = useRef([]);
  const timersRef    = useRef([]);
  const lastCountRef = useRef(0); // last count number that actually played this phase
  const countdownRef = useRef(countdown);
  const canUseVoice = isSupported(technique);

  // Keep the latest countdown readable without re-running the scheduler.
  // Declared before the scheduling effect so it syncs first on each commit.
  useEffect(() => { countdownRef.current = countdown; }, [countdown]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function stopPlayback() {
    clearTimers();
    poolRef.current.forEach(a => {
      if (!a.paused) { a.pause(); a.currentTime = 0; }
    });
  }

  function scheduleCount(n, delay) {
    const timer = setTimeout(() => {
      const audio = poolRef.current[n - 1];
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
      lastCountRef.current = n;
    }, delay);
    timersRef.current.push(timer);
  }

  // Preload count-1.mp3 through count-8.mp3
  useEffect(() => {
    const pool = Array.from({ length: MAX_COUNT }, (_, i) => {
      const audio = new Audio(`${import.meta.env.BASE_URL}audio/count-${i + 1}.mp3`);
      audio.preload = 'auto';
      return audio;
    });
    poolRef.current = pool;
    return () => {
      clearTimers();
      pool.forEach(a => { a.pause(); a.src = ''; });
      poolRef.current = [];
    };
  }, []);

  // A new phase starts its count history from scratch
  useEffect(() => { lastCountRef.current = 0; }, [phaseIndex]);

  // Auto-disable when technique / durations no longer match a supported combo
  useEffect(() => {
    if (!canUseVoice) {
      stopPlayback();
      setVoiceEnabled(false);
    }
  }, [canUseVoice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Schedule one timer per count, aligned with the visual displayCount:
  // count N fires at (N-1) * 1000ms from phase start. Runs on phase change,
  // session start, and resume; cleanup cancels pending counts on pause/stop.
  useEffect(() => {
    stopPlayback();
    if (!voiceEnabled || !isRunning || !canUseVoice) return;

    const dur = phase?.duration;
    if (!dur || dur < 1 || dur > MAX_COUNT) return;

    // countdown === dur means the phase is (re)starting from the top.
    // Otherwise we're resuming mid-phase: the count currently shown is
    // dur - countdown + 1, and remaining counts tick every 1000ms.
    const cd = countdownRef.current;
    let firstCount = 1;
    if (cd >= dur || cd == null) {
      lastCountRef.current = 0;
    } else {
      firstCount = Math.min(Math.max(dur - cd + 1, 1), dur);
    }

    for (let n = firstCount; n <= dur; n++) {
      if (n <= lastCountRef.current) continue; // already played before pause
      scheduleCount(n, (n - firstCount) * 1000);
    }

    return stopPlayback;
  }, [phaseIndex, voiceEnabled, isRunning, canUseVoice]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleVoice = () => {
    if (!canUseVoice) return;
    if (voiceEnabled) stopPlayback();
    setVoiceEnabled(v => !v);
  };

  return { voiceEnabled, toggleVoice, canUseVoice };
}
