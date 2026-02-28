import { useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DurationEditor
 *
 * Shows per-phase duration controls (+/−) for breathing techniques.
 * Visible only when the session is not running.
 * Each phase shows its default time alongside the current setting.
 * Long-pressing +/− accelerates the value change.
 */

const MIN = 1;
const MAX = 90;

function PhaseControl({ phase, defaultDuration, current, color, onChange }) {
  const intervalRef = useRef(null);
  const timeoutRef  = useRef(null);

  const isDefault = current === defaultDuration;

  const startRepeat = useCallback((delta) => {
    // Immediate first step
    onChange(delta);
    // After 500ms, start repeating every 120ms
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => onChange(delta), 120);
    }, 500);
  }, [onChange]);

  const stopRepeat = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="dur-phase">
      <span className="dur-phase-label">{phase.label}</span>
      <div className="dur-controls">
        <button
          className="dur-btn dur-minus"
          onPointerDown={() => startRepeat(-1)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          disabled={current <= MIN}
          aria-label={`Decrease ${phase.label} duration`}
        >
          −
        </button>

        <div className="dur-value-wrap">
          <span className="dur-value" style={{ color: isDefault ? undefined : color }}>
            {current}
          </span>
          <span className="dur-unit">s</span>
          {!isDefault && (
            <span className="dur-default-hint">({defaultDuration}s)</span>
          )}
        </div>

        <button
          className="dur-btn dur-plus"
          onPointerDown={() => startRepeat(+1)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          disabled={current >= MAX}
          aria-label={`Increase ${phase.label} duration`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function DurationEditor({ technique, durations, onSetDuration, onReset, isCustomised }) {
  if (!technique || technique.guideType === 'guided') return null;

  return (
    <motion.div
      className="duration-editor"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <div className="dur-header">
        <span className="dur-title">Adjust timing</span>
        <AnimatePresence>
          {isCustomised && (
            <motion.button
              className="dur-reset-btn"
              onClick={() => onReset(technique.id)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              title="Reset to recommended defaults"
            >
              ↺ Defaults
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="dur-phases">
        {technique.phases.map((phase, i) => (
          <PhaseControl
            key={i}
            phase={phase}
            defaultDuration={phase.duration}   // original default from techniques.js
            current={durations[i]}
            color={technique.color}
            onChange={(delta) => onSetDuration(technique.id, i, durations[i] + delta)}
          />
        ))}
      </div>
    </motion.div>
  );
}
