import { useState, useRef, useCallback, useEffect } from 'react';

export function useGuidedAudio() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error,      setError]      = useState(null);
  const [speed,      setSpeedState] = useState(1);
  const audioRef = useRef(null);
  const speedRef = useRef(1);

  const setSpeed = useCallback((s) => {
    speedRef.current = s;
    setSpeedState(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((techniqueId, phaseIndex) => {
    stop();
    setError(null);

    const src   = `audio/${techniqueId}-${phaseIndex}.mp3`;
    const audio = new Audio(src);
    audio.volume      = 0.9;
    audio.playbackRate = speedRef.current;
    audioRef.current  = audio;

    audio.onended = () => {
      setIsSpeaking(false);
      if (audioRef.current === audio) audioRef.current = null;
    };
    audio.onerror = () => {
      setError('Audio file not found. Run: node scripts/generate-audio.js');
      setIsSpeaking(false);
      if (audioRef.current === audio) audioRef.current = null;
    };

    audio.play()
      .then(() => setIsSpeaking(true))
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      });
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return { speak, stop, isSpeaking, error, speed, setSpeed };
}
