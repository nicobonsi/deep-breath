import { useState, useRef, useCallback, useEffect } from 'react';

const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'; // Daniel – deep, calm British male (premade, free tier)
const MODEL_ID = 'eleven_turbo_v2';
const LS_KEY   = 'deep-breath-el-key';

export function useElevenLabs() {
  const [apiKey,     setApiKeyState] = useState(() => localStorage.getItem(LS_KEY) ?? '');
  const [isSpeaking, setIsSpeaking]  = useState(false);
  const [error,      setError]       = useState(null);

  const audioRef = useRef(null);
  const abortRef = useRef(null);

  const saveApiKey = useCallback((key) => {
    const k = key.trim();
    setApiKeyState(k);
    localStorage.setItem(LS_KEY, k);
    setError(null);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current._blobUrl) URL.revokeObjectURL(audioRef.current._blobUrl);
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text) => {
    if (!apiKey) return;
    stop();
    setError(null);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          signal: ctrl.signal,
          headers: {
            'xi-api-key':   apiKey,
            'Content-Type': 'application/json',
            'Accept':       'audio/mpeg',
          },
          body: JSON.stringify({
            text,
            model_id: MODEL_ID,
            voice_settings: {
              stability:        0.75,
              similarity_boost: 0.75,
              speed:            0.8,
              style:            0.15,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!res.ok) {
        let msg = `ElevenLabs error ${res.status}`;
        try { const j = await res.json(); msg = j?.detail?.message ?? msg; } catch {}
        throw new Error(msg);
      }

      const blob = await res.blob();
      if (ctrl.signal.aborted) return;

      const url   = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio._blobUrl = url;
      audio.volume   = 0.9;
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        if (audioRef.current === audio) audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        if (audioRef.current === audio) audioRef.current = null;
      };

      setIsSpeaking(true);
      await audio.play();
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      setIsSpeaking(false);
    }
  }, [apiKey, stop]);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  return { speak, stop, isSpeaking, error, apiKey, saveApiKey };
}
