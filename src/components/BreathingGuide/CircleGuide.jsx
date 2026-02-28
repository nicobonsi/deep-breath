import { motion, AnimatePresence } from 'framer-motion';

/**
 * Circle / orb breathing guide.
 * The circle expands on inhale, holds, contracts on exhale.
 */

const MIN_R = 60;
const MAX_R = 110;

function phaseToRadius(phase) {
  if (!phase) return MIN_R;
  const dir = phase.direction;
  if (dir === 'expand')   return MAX_R;
  if (dir === 'contract') return MIN_R;
  if (dir === 'hold')     return MAX_R; // hold after inhale
  return MIN_R;
}

export function CircleGuide({ phase, progress, color, countdown }) {
  const targetR = phaseToRadius(phase);

  // During transition, animate toward the target based on progress
  const fromR = phase?.direction === 'expand' ? MIN_R : MAX_R;
  const currentR = phase?.direction === 'hold'
    ? targetR
    : fromR + (targetR - fromR) * progress;

  const isExpanding  = phase?.direction === 'expand';
  const isContracting = phase?.direction === 'contract';

  return (
    <div className="circle-guide-wrapper">
      <svg
        width={260}
        height={260}
        viewBox="-130 -130 260 260"
        aria-label="Circle breathing guide"
      >
        {/* Outer ring */}
        <circle
          r={MAX_R + 8}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={2}
        />
        {/* Inner ring */}
        <circle
          r={MIN_R - 8}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={2}
        />

        {/* Pulsing rings */}
        {[1, 2, 3].map(i => (
          <motion.circle
            key={i}
            r={currentR}
            fill="none"
            stroke={color}
            strokeWidth={1}
            opacity={0.15 / i}
            animate={{ r: currentR + i * 10, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
          />
        ))}

        {/* Main breathing orb */}
        <motion.circle
          r={currentR}
          fill={color}
          opacity={0.85}
          filter="url(#circleGlow)"
          animate={{ r: currentR }}
          transition={{ ease: 'linear', duration: 0.8 }}
        />

        {/* Countdown */}
        <text
          x={0}
          y={-6}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={currentR > 90 ? '36' : '28'}
          fontWeight="300"
          fontFamily="inherit"
          style={{ transition: 'font-size 0.3s' }}
        >
          {countdown}
        </text>

        <text
          x={0}
          y={22}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize="13"
          fontFamily="inherit"
          letterSpacing="1"
        >
          {phase?.label?.toUpperCase()}
        </text>

        <defs>
          <filter id="circleGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
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
