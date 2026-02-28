import { motion } from 'framer-motion';

/**
 * Box Breathing visual guide — three rendering states:
 *
 *  IDLE    (!hasStarted)          → ball sits statically at the start corner
 *  RUNNING (isRunning)            → ball animates smoothly corner-to-corner via
 *                                   framer-motion over the full phase duration
 *  PAUSED  (hasStarted&&!isRunning) → ball frozen at the stepped-progress position
 */

const SIZE   = 220;
const BALL   = 18;
const MARGIN = 22;

const corners = [
  { x: MARGIN,        y: MARGIN        }, // top-left     — inhale
  { x: SIZE - MARGIN, y: MARGIN        }, // top-right    — hold
  { x: SIZE - MARGIN, y: SIZE - MARGIN }, // bottom-right — exhale
  { x: MARGIN,        y: SIZE - MARGIN }, // bottom-left  — hold
];

const sideLabels = [
  { label: 'Inhale', x: SIZE / 2, y: 8,         anchor: 'middle' },
  { label: 'Hold',   x: SIZE - 5, y: SIZE / 2,  anchor: 'end'    },
  { label: 'Exhale', x: SIZE / 2, y: SIZE - 3,  anchor: 'middle' },
  { label: 'Hold',   x: 5,        y: SIZE / 2,  anchor: 'start'  },
];

export function BoxGuide({ phaseIndex, phase, color, countdown, isRunning, hasStarted, progress }) {
  const sideIndex  = phaseIndex % 4;
  const fromCorner = corners[sideIndex];
  const toCorner   = corners[(sideIndex + 1) % 4];
  const dur        = phase?.duration ?? 4;

  // ── Compute ball position based on state ──────────────────
  let ballCx, ballCy, animated;

  if (!hasStarted) {
    // Idle: sit at the very start corner, no animation
    ballCx    = corners[0].x;
    ballCy    = corners[0].y;
    animated  = false;
  } else if (!isRunning) {
    // Paused: frozen at current stepped-progress position
    ballCx    = fromCorner.x + (toCorner.x - fromCorner.x) * progress;
    ballCy    = fromCorner.y + (toCorner.y - fromCorner.y) * progress;
    animated  = false;
  } else {
    // Running: let framer-motion own the full interpolation
    ballCx    = toCorner.x;
    ballCy    = toCorner.y;
    animated  = true;
  }

  return (
    <div className="breathing-box-wrapper">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="breathing-box-svg"
        aria-label="Box breathing guide"
        overflow="visible"
      >
        {/* Track */}
        <rect
          x={MARGIN} y={MARGIN}
          width={SIZE - MARGIN * 2}
          height={SIZE - MARGIN * 2}
          rx={6} ry={6}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1.5}
        />

        {/* Active-side progress trail — only when running */}
        {isRunning && (
          <motion.line
            key={`side-${sideIndex}`}
            x1={fromCorner.x} y1={fromCorner.y}
            x2={fromCorner.x} y2={fromCorner.y}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.6}
            animate={{ x2: toCorner.x, y2: toCorner.y }}
            transition={{ duration: dur, ease: 'linear' }}
          />
        )}

        {/* Side labels */}
        {sideLabels.map((s, i) => (
          <text
            key={i}
            x={s.x} y={s.y}
            textAnchor={s.anchor}
            dominantBaseline="middle"
            fill={
              hasStarted && i === sideIndex
                ? 'rgba(255,255,255,0.9)'
                : !hasStarted && i === 0
                ? 'rgba(255,255,255,0.6)'
                : 'rgba(255,255,255,0.22)'
            }
            fontSize="11"
            fontFamily="inherit"
            style={{ transition: 'fill 0.5s' }}
          >
            {s.label}
          </text>
        ))}

        {/* Corner dots */}
        {corners.map((c, i) => (
          <circle
            key={i}
            cx={c.x} cy={c.y}
            r={3}
            fill={hasStarted && i === sideIndex ? color : 'rgba(255,255,255,0.18)'}
            style={{ transition: 'fill 0.4s' }}
          />
        ))}

        {/* Ball */}
        {animated ? (
          <motion.circle
            key={`ball-${phaseIndex}`}
            cx={fromCorner.x}
            cy={fromCorner.y}
            r={BALL / 2}
            fill={color}
            filter="url(#boxGlow)"
            initial={{ cx: fromCorner.x, cy: fromCorner.y }}
            animate={{ cx: toCorner.x,   cy: toCorner.y   }}
            transition={{ duration: dur, ease: 'linear' }}
          />
        ) : (
          <circle
            cx={ballCx}
            cy={ballCy}
            r={BALL / 2}
            fill={color}
            filter="url(#boxGlow)"
            opacity={hasStarted ? 1 : 0.55}
          />
        )}

        <defs>
          <filter id="boxGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Central info */}
      <div className="box-center-info">
        {hasStarted ? (
          <>
            <span className="box-countdown">{countdown}</span>
            <span className="box-phase-label">{phase?.label}</span>
          </>
        ) : (
          <span className="box-phase-label box-idle-hint">Press Begin</span>
        )}
      </div>
    </div>
  );
}
