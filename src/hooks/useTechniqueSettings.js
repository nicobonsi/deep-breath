import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Persists per-technique custom phase durations to localStorage.
 *
 * Returns helpers to read, write and reset durations for any technique.
 * Custom durations survive page refreshes and technique switching.
 */

const STORAGE_KEY = 'deep-breath-durations';

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function useTechniqueSettings() {
  const [stored, setStored] = useState(loadFromStorage);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }, [stored]);

  /**
   * Return the durations array for a technique, merging any saved
   * customisations over the defaults defined in techniques.js.
   */
  const getDurations = useCallback(
    (technique) => {
      const saved = stored[technique.id] ?? {};
      const durations = technique.phases.map((p, i) =>
        saved[i] !== undefined ? saved[i] : p.duration
      );
      // For linked techniques (e.g. box breathing) all phases must be equal — use phase 0
      if (technique.linkedDurations) {
        return durations.map(() => durations[0]);
      }
      return durations;
    },
    [stored]
  );

  /**
   * Build a copy of the technique with custom durations baked into phases.
   * This is what should be passed to useBreathing and all child components.
   */
  const getActiveTechnique = useCallback(
    (technique) => {
      const durations = getDurations(technique);
      return {
        ...technique,
        phases: technique.phases.map((p, i) => ({ ...p, duration: durations[i] })),
      };
    },
    [getDurations]
  );

  /**
   * Set duration for one phase of one technique.
   * Clamps to 1–90 seconds.
   */
  const setDuration = useCallback((techniqueId, phaseIndex, value) => {
    const clamped = Math.max(1, Math.min(90, value));
    setStored((prev) => ({
      ...prev,
      [techniqueId]: {
        ...(prev[techniqueId] ?? {}),
        [phaseIndex]: clamped,
      },
    }));
  }, []);

  /**
   * Remove all customisation for a technique, reverting to defaults.
   */
  const resetDurations = useCallback((techniqueId) => {
    setStored((prev) => {
      const next = { ...prev };
      delete next[techniqueId];
      return next;
    });
  }, []);

  /**
   * Returns true if any phase for this technique has been customised.
   */
  const isCustomised = useCallback(
    (technique) => {
      const saved = stored[technique.id];
      if (!saved) return false;
      return technique.phases.some(
        (p, i) => saved[i] !== undefined && saved[i] !== p.duration
      );
    },
    [stored]
  );

  return { getDurations, getActiveTechnique, setDuration, resetDurations, isCustomised };
}
