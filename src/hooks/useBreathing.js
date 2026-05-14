import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Core breathing session engine.
 * Drives phase progression, counting, and cycle tracking.
 */
export function useBreathing(technique) {
  const [isRunning,    setIsRunning]    = useState(false);
  const [hasStarted,   setHasStarted]   = useState(false); // true after first Begin press
  const [phaseIndex,   setPhaseIndex]   = useState(0);
  const [countdown,    setCountdown]    = useState(0);
  const [cycleCount,   setCycleCount]   = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const tickRef     = useRef(null);
  const phaseRef    = useRef(0);
  const countRef    = useRef(0);
  const cycleRef    = useRef(0);

  const phases = technique?.phases ?? [];

  const reset = useCallback(() => {
    clearInterval(tickRef.current);
    setIsRunning(false);
    setHasStarted(false);
    setPhaseIndex(0);
    setCountdown(phases[0]?.duration ?? 0);
    setCycleCount(0);
    setTotalSeconds(0);
    phaseRef.current  = 0;
    countRef.current  = phases[0]?.duration ?? 0;
    cycleRef.current  = 0;
  }, [phases]);

  // Reset when technique changes
  useEffect(() => { reset(); }, [technique?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(() => {
    if (!phases.length) return;
    setIsRunning(true);
    setHasStarted(true);
    setPhaseIndex(phaseRef.current);
    setCountdown(countRef.current || phases[phaseRef.current]?.duration);
    countRef.current = countRef.current || phases[phaseRef.current]?.duration;

    tickRef.current = setInterval(() => {
      setTotalSeconds(s => s + 1);

      countRef.current -= 1;
      setCountdown(countRef.current);

      if (countRef.current <= 0) {
        // Advance phase
        const nextPhase = (phaseRef.current + 1) % phases.length;

        if (nextPhase === 0) {
          cycleRef.current += 1;
          setCycleCount(cycleRef.current);
        }

        phaseRef.current = nextPhase;
        setPhaseIndex(nextPhase);
        countRef.current = phases[nextPhase].duration;
        setCountdown(countRef.current);
      }
    }, 1000);
  }, [phases]);

  const advancePhase = useCallback(() => {
    const nextPhase = (phaseRef.current + 1) % phases.length;
    if (nextPhase === 0) {
      cycleRef.current += 1;
      setCycleCount(cycleRef.current);
    }
    phaseRef.current = nextPhase;
    setPhaseIndex(nextPhase);
    countRef.current = phases[nextPhase].duration;
    setCountdown(countRef.current);
  }, [phases]);

  const pause = useCallback(() => {
    clearInterval(tickRef.current);
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    if (isRunning) pause(); else start();
  }, [isRunning, pause, start]);

  useEffect(() => () => clearInterval(tickRef.current), []);

  const currentPhase = phases[phaseIndex] ?? {};
  const progress     = currentPhase.duration
    ? 1 - (countdown / currentPhase.duration)
    : 0;

  // Count-up display: 1 → duration (for breathing visuals)
  // countdown stays as-is for guided meditation time-remaining display
  const displayCount = currentPhase.duration
    ? currentPhase.duration - countdown + 1
    : 1;

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return {
    isRunning,
    hasStarted,
    phase: currentPhase,
    phaseIndex,
    countdown,        // original countdown (guided meditation time remaining)
    displayCount,     // count-up 1→duration (breathing guide display)
    cycleCount,
    progress,         // 0 → 1 within current phase
    totalTime: formatTime(totalSeconds),
    toggle,
    reset,
    start,
    pause,
    advancePhase,
  };
}
