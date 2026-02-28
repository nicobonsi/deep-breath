import { motion } from 'framer-motion';

/**
 * Circle / orb breathing guide — three rendering states:
 *
 *  IDLE    (!hasStarted)            → orb sits statically at MIN_R
 *  RUNNING (isRunning)              → orb animates smoothly via framer-motion
 *                                     over the full phase duration
 *  PAUSED  (hasStarted && !isRunning) → orb frozen at the stepped-progress radius
 */

const MIN_R = 58;
const MAX_R = 110;

function endR(direction) {
  if (direction === 'expand')   return MAX_R;
  if (direction === 'contract') return MIN_R;
  return null;
}

function startRadius(phases, phaseIndex) {
  for (let i = phaseIndex - 1; i >= 0; i--) {
    const r = endR(phases[i].direction);
    if (r !== null) return r;
  }
  return MIN_R;
}

function targetRadius(phases, phaseIndex) {
  const r = endR(phases[phaseIndex].direction);
  if (r !== null) return r;
  return startRadius(phases, phaseIndex);
}

export function CircleGuide({ phase, phaseIndex, phases, color, countdown, isRunning, hasStarted, progress }) {
  const fromR = startRadius(phases, phaseIndex);
  const toR   = targetRadius(phases, phaseIndex);
  const dur   = phase?.duration ?? 4;

  // ── Compute radius based on state ────────────────────────
  let displayR;

  if (!hasStarted) {
    displayR = MIN_R; // idle: always small
  } else if (!isRunning) {
    // Paused: frozen at stepped-progress position
    displayR = fromR + (toR - fromR) * progress;
  } else {
    displayR = null; // running: framer-motion handles it
  }

  const orbOpacity = hasStarted ? 0.85 : 0.45;

  return (
    <div className="circle-guide-wrapper">
      <svg
        width={260}
        height={260}
        viewBox="-130 -130 260 260"
        aria-label="Circle breathing guide"
      >
        {/* Static guide rings */}
        <circle r={MAX_R + 10} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />
        <circle r={MIN_R - 10} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />

        {/* Decorative pulsing rings — only when running */}
        {isRunning && [0, 1, 2].map(i => (
          <motion.circle
            key={i}
            cx={0} cy={0}
            fill="none"
            stroke={color}
            strokeWidth={1}
            initial={{ r: 75, opacity: 0.25 - i * 0.07 }}
            animate={{ r: 75 + (i + 1) * 22, opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.65, ease: 'easeOut' }}
          />
        ))}

        {/* Main orb */}
        {isRunning ? (
          // RUNNING — framer-motion owns the animation
          <motion.circle
            key={`orb-${phaseIndex}`}
            cx={0} cy={0}
            fill={color}
            opacity={orbOpacity}
            filter="url(#circleGlow)"
            initial={{ r: fromR }}
            animate={{ r: toR }}
            transition={{
              duration: dur,
              ease: phase?.direction === 'hold' ? 'linear' : 'easeInOut',
            }}
          />
        ) : (
          // IDLE or PAUSED — static circle at computed radius
          <circle
            cx={0} cy={0}
            r={displayR}
            fill={color}
            opacity={orbOpacity}
            filter="url(#circleGlow)"
          />
        )}

        {/* Countdown — hidden when idle */}
        {hasStarted && (
          <text
            x={0} y={-8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="34"
            fontWeight="200"
            fontFamily="inherit"
          >
            {countdown}
          </text>
        )}

        {/* Phase label / idle hint */}
        <text
          x={0} y={hasStarted ? 20 : 0}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={hasStarted ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)'}
          fontSize={hasStarted ? '12' : '13'}
          fontFamily="inherit"
          letterSpacing="1.5"
        >
          {hasStarted ? phase?.label?.toUpperCase() : 'PRESS BEGIN'}
        </text>

        <defs>
          <filter id="circleGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
