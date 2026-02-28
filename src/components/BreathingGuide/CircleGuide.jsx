import { motion } from 'framer-motion';

/**
 * Circle / orb breathing guide.
 *
 * Animation is driven entirely by framer-motion over the full phase duration.
 * key={phaseIndex} remounts the animated element at each phase transition so
 * framer-motion starts a fresh interpolation — completely independent of the
 * 1-second countdown tick, giving perfectly smooth expansion and contraction.
 */

const MIN_R = 58;
const MAX_R = 110;

// Resolve the end radius for a given phase direction.
function endR(direction) {
  if (direction === 'expand')   return MAX_R;
  if (direction === 'contract') return MIN_R;
  return null; // 'hold' — inherits from previous phase
}

// Walk backwards through phases to find the radius that a phase should start at.
function startRadius(phases, phaseIndex) {
  for (let i = phaseIndex - 1; i >= 0; i--) {
    const r = endR(phases[i].direction);
    if (r !== null) return r;
  }
  return MIN_R; // first phase, or no prior non-hold phase found
}

// The radius this phase ends at (hold phases stay where they started).
function targetRadius(phases, phaseIndex) {
  const r = endR(phases[phaseIndex].direction);
  if (r !== null) return r;
  return startRadius(phases, phaseIndex); // hold: no change
}

export function CircleGuide({ phase, phaseIndex, phases, color, countdown }) {
  const fromR = startRadius(phases, phaseIndex);
  const toR   = targetRadius(phases, phaseIndex);
  const dur   = phase?.duration ?? 4;

  // Large when expanded for font sizing
  const isLarge = toR >= MAX_R - 10 || fromR >= MAX_R - 10;

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

        {/* Decorative pulsing rings — independent of orb size */}
        {[0, 1, 2].map(i => (
          <motion.circle
            key={i}
            cx={0} cy={0}
            fill="none"
            stroke={color}
            strokeWidth={1}
            initial={{ r: 75, opacity: 0.25 - i * 0.07 }}
            animate={{ r: 75 + (i + 1) * 22, opacity: 0 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: i * 0.65,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Main orb — smooth per-phase animation */}
        <motion.circle
          key={`orb-${phaseIndex}`}
          cx={0}
          cy={0}
          fill={color}
          opacity={0.85}
          filter="url(#circleGlow)"
          initial={{ r: fromR }}
          animate={{ r: toR }}
          transition={{
            duration: dur,
            ease: phase?.direction === 'hold' ? 'linear' : 'easeInOut',
          }}
        />

        {/* Countdown */}
        <text
          x={0} y={-8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={isLarge ? '36' : '30'}
          fontWeight="200"
          fontFamily="inherit"
        >
          {countdown}
        </text>

        {/* Phase label */}
        <text
          x={0} y={20}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.75)"
          fontSize="12"
          fontFamily="inherit"
          letterSpacing="1.5"
        >
          {phase?.label?.toUpperCase()}
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
