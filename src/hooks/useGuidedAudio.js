import { useState, useRef, useCallback, useEffect } from 'react';

export function useGuidedAudio(techniqueId, phaseCount) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error,      setError]      = useState(null);
  const [speed,      setSpeedState] = useState(1);

  const poolRef    = useRef([]);   // preloaded Audio objects, one per phase
  const activeRef  = useRef(null); // currently playing Audio
  const speedRef   = useRef(1);

  // Preload all phase audio files when technique changes
  useEffect(() => {
    const pool = Array.from({ length: phaseCount }, (_, i) => {
      const audio = new Audio(`${import.meta.env.BASE_URL}audio/${techniqueId}-${i}.mp3`);
      audio.preload = 'auto';
      audio.volume  = 0.9;
      return audio;
    });
    poolRef.current = pool;

    return () => {
      pool.forEach(a => { a.pause(); a.src = ''; });
      poolRef.current = [];
      activeRef.current = null;
    };
  }, [techniqueId, phaseCount]);

  const setSpeed = useCallback((s) => {
    speedRef.current = s;
    setSpeedState(s);
    if (activeRef.current) activeRef.current.playbackRate = s;
  }, []);

  const stop = useCallback(() => {
    if (activeRef.current) {
      activeRef.current.pause();
      activeRef.current.currentTime = 0;
      activeRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((phaseIndex) => {
    // Stop whatever is currently playing
    if (activeRef.current) {
      activeRef.current.pause();
      activeRef.current.currentTime = 0;
      activeRef.current = null;
    }
    setIsSpeaking(false);
    setError(null);

    const audio = poolRef.current[phaseIndex];
    if (!audio) return;

    audio.currentTime    = 0;
    audio.playbackRate   = speedRef.current;
    activeRef.current    = audio;

    audio.onended = () => {
      setIsSpeaking(false);
      if (activeRef.current === audio) activeRef.current = null;
    };
    audio.onerror = () => {
      setError(`Could not play phase ${phaseIndex}. Run: node scripts/generate-audio.js`);
      setIsSpeaking(false);
      if (activeRef.current === audio) activeRef.current = null;
    };

    audio.play()
      .then(() => setIsSpeaking(true))
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      });
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { speak, stop, isSpeaking, error, speed, setSpeed };
}
