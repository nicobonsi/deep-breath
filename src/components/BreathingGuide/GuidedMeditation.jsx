import { motion, AnimatePresence } from 'framer-motion';

/**
 * GuidedMeditation – full-screen text-driven experience.
 *
 * Shows:
 *  • A softly pulsing ambient orb (colour from technique)
 *  • Phase label at the top
 *  • Instruction text, cross-fading between phases
 *  • A thin progress bar showing time remaining in current phase
 *  • Phase breadcrumb dots at the bottom
 */
export function GuidedMeditation({ technique, phase, phaseIndex, progress, countdown, isRunning }) {
  const color    = technique?.color ?? '#818cf8';
  const phases   = technique?.phases ?? [];
  const total    = phases.length;

  // Format remaining time as m:ss
  const mins = Math.floor(countdown / 60);
  const secs = String(countdown % 60).padStart(2, '0');
  const timeLeft = mins > 0 ? `${mins}:${secs}` : `${countdown}s`;

  // Split instruction on \n for line breaks
  const lines = (phase?.instruction ?? '').split('\n');

  return (
    <div className="guided-wrapper">
      {/* Ambient orb — breathes slowly always */}
      <div className="guided-orb-container" aria-hidden="true">
        <motion.div
          className="guided-orb"
          style={{ background: `radial-gradient(circle, ${color}55 0%, ${color}22 50%, transparent 75%)` }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Phase label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${phaseIndex}`}
          className="guided-phase-label"
          style={{ color }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5 }}
        >
          {phase?.label}
        </motion.div>
      </AnimatePresence>

      {/* Instruction text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`instruction-${phaseIndex}`}
          className="guided-instruction"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {lines.map((line, i) =>
            line.trim() === '' ? (
              <br key={i} />
            ) : (
              <p key={i}>{line}</p>
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar + time remaining */}
      {isRunning && (
        <div className="guided-progress-area">
          <div className="guided-progress-track">
            <motion.div
              className="guided-progress-fill"
              style={{ background: color }}
              animate={{ width: `${(1 - progress) * 100}%` }}
              transition={{ ease: 'linear', duration: 1 }}
            />
          </div>
          <span className="guided-time-left">{timeLeft}</span>
        </div>
      )}

      {/* Phase breadcrumb dots */}
      <div className="guided-dots" aria-label={`Phase ${phaseIndex + 1} of ${total}`}>
        {phases.map((_, i) => (
          <motion.div
            key={i}
            className="guided-dot"
            animate={{
              scale:      i === phaseIndex ? 1.4 : 1,
              opacity:    i < phaseIndex ? 1 : i === phaseIndex ? 1 : 0.3,
              background: i <= phaseIndex ? color : 'rgba(255,255,255,0.3)',
            }}
            transition={{ duration: 0.35 }}
          />
        ))}
      </div>
    </div>
  );
}
