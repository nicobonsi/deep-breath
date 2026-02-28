import { motion } from 'framer-motion';

/**
 * Box Breathing visual guide.
 *
 * The ball travels around a square: top → right → bottom → left.
 * key={phaseIndex} remounts the ball at the exact start corner each phase,
 * then framer-motion animates it to the end corner over the full phase duration —
 * giving completely smooth, uninterrupted motion with zero 1-second stepping.
 */

const SIZE   = 220;
const BALL   = 18;
const MARGIN = 22; // distance of ball centres from edge

// Ball centre positions at each corner of the path
const corners = [
  { x: MARGIN,        y: MARGIN        }, // top-left     — inhale starts here
  { x: SIZE - MARGIN, y: MARGIN        }, // top-right    — first hold starts here
  { x: SIZE - MARGIN, y: SIZE - MARGIN }, // bottom-right — exhale starts here
  { x: MARGIN,        y: SIZE - MARGIN }, // bottom-left  — second hold starts here
];

// Labels centred on each side of the square
const sideLabels = [
  { label: 'Inhale',  x: SIZE / 2,    y: 8,            anchor: 'middle' },
  { label: 'Hold',    x: SIZE - 5,    y: SIZE / 2,     anchor: 'end'    },
  { label: 'Exhale',  x: SIZE / 2,    y: SIZE - 3,     anchor: 'middle' },
  { label: 'Hold',    x: 5,           y: SIZE / 2,     anchor: 'start'  },
];

export function BoxGuide({ phaseIndex, phase, color, countdown }) {
  const sideIndex  = phaseIndex % 4;
  const fromCorner = corners[sideIndex];
  const toCorner   = corners[(sideIndex + 1) % 4];
  const dur        = phase?.duration ?? 4;

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
        {/* Track rectangle */}
        <rect
          x={MARGIN}
          y={MARGIN}
          width={SIZE - MARGIN * 2}
          height={SIZE - MARGIN * 2}
          rx={6}
          ry={6}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1.5}
        />

        {/* Progress highlight — the side currently active */}
        <motion.line
          key={`side-${sideIndex}`}
          x1={fromCorner.x}
          y1={fromCorner.y}
          x2={fromCorner.x}
          y2={fromCorner.y}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.6}
          animate={{ x2: toCorner.x, y2: toCorner.y }}
          transition={{ duration: dur, ease: 'linear' }}
        />

        {/* Side labels */}
        {sideLabels.map((s, i) => (
          <text
            key={i}
            x={s.x}
            y={s.y}
            textAnchor={s.anchor}
            dominantBaseline="middle"
            fill={i === sideIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)'}
            fontSize="11"
            fontFamily="inherit"
            style={{ transition: 'fill 0.5s' }}
          >
            {s.label}
          </text>
        ))}

        {/* Ball — remounts each phase and animates the full distance smoothly */}
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

        {/* Corner dots */}
        {corners.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={3}
            fill={i === sideIndex ? color : 'rgba(255,255,255,0.2)'}
            style={{ transition: 'fill 0.4s' }}
          />
        ))}

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

      {/* Central countdown */}
      <div className="box-center-info">
        <span className="box-countdown">{countdown}</span>
        <span className="box-phase-label">{phase?.label}</span>
      </div>
    </div>
  );
}
