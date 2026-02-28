import { useRef, useCallback, useEffect } from 'react';

/**
 * Web Audio API ambient sound engine.
 * Generates rain, ocean, wind, fire, stream from filtered noise.
 * Generates singing bowl tones with harmonics.
 */
export function useAmbientSound() {
  const ctxRef    = useRef(null);
  const nodesRef  = useRef([]);
  const volumeRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const stop = useCallback(() => {
    nodesRef.current.forEach(n => {
      try { n.stop?.(); n.disconnect?.(); } catch (_) {}
    });
    nodesRef.current = [];
    if (volumeRef.current) {
      volumeRef.current.disconnect();
      volumeRef.current = null;
    }
  }, []);

  // --- Noise buffer (white or brown) ---
  const createNoiseBuffer = useCallback((ctx, color = 'white') => {
    const bufferSize = ctx.sampleRate * 4; // 4 seconds loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data   = buffer.getChannelData(0);

    if (color === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i]  = (lastOut + (0.02 * white)) / 1.02;
        lastOut  = data[i];
        data[i] *= 3.5; // compensate for low amplitude
      }
    } else {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }, []);

  const playNoise = useCallback((params, volume) => {
    const ctx = getCtx();
    stop();

    const { color = 'white', freq = 500, q = 1, lfoRate = 0.1, lfoDepth = 0.5 } = params;

    // Master gain
    const master = ctx.createGain();
    master.gain.setValueAtTime(volume, ctx.currentTime);
    master.connect(ctx.destination);
    volumeRef.current = master;

    // Noise source
    const buffer  = createNoiseBuffer(ctx, color);
    const source  = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop   = true;

    // Filter
    const filter       = ctx.createBiquadFilter();
    filter.type        = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value     = q;

    // LFO for organic wavering
    const lfo      = ctx.createOscillator();
    const lfoGain  = ctx.createGain();
    lfo.frequency.value  = lfoRate;
    lfoGain.gain.value   = freq * lfoDepth;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(master);

    lfo.start();
    source.start();

    nodesRef.current = [source, lfo];
  }, [getCtx, stop, createNoiseBuffer]);

  const playTone = useCallback((params, volume) => {
    const ctx = getCtx();
    stop();

    const { freq = 432, harmonics = [1], decay = 4 } = params;
    const master = ctx.createGain();
    master.gain.setValueAtTime(volume, ctx.currentTime);
    master.connect(ctx.destination);
    volumeRef.current = master;

    const playBowl = () => {
      harmonics.forEach((ratio, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value   = freq * ratio;
        osc.type              = 'sine';
        gain.gain.setValueAtTime(0.3 / (i + 1), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay);
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + decay);
      });
    };

    // Play immediately and repeat
    playBowl();
    const interval = setInterval(playBowl, (decay + 2) * 1000);
    nodesRef.current = [{ stop: () => clearInterval(interval) }];
  }, [getCtx, stop]);

  const play = useCallback((sound, volume = 0.5) => {
    if (!sound || sound.type === 'none') { stop(); return; }
    if (sound.type === 'noise') playNoise(sound.params, volume);
    if (sound.type === 'tone')  playTone(sound.params, volume);
  }, [stop, playNoise, playTone]);

  const setVolume = useCallback((v) => {
    if (volumeRef.current) {
      volumeRef.current.gain.setTargetAtTime(v, ctxRef.current.currentTime, 0.1);
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { play, stop, setVolume };
}
