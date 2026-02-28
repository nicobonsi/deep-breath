import { motion } from 'framer-motion';

/**
 * Box Breathing visual guide.
 * A ball travels around a square: up → right → down → left.
 * Each side corresponds to one phase (inhale / hold / exhale / hold).
 */

const SIZE   = 220;  // box size in px
const BALL   = 18;   // ball diameter
const CORNER = 20;   // corner rounding

// Corner positions (centres of each corner)
const corners = [
  { x: CORNER,        y: CORNER        }, // top-left     → start of inhale
  { x: SIZE - CORNER, y: CORNER        }, // top-right    → start of first hold
  { x: SIZE - CORNER, y: SIZE - CORNER }, // bottom-right → start of exhale
  { x: CORNER,        y: SIZE - CORNER }, // bottom-left  → start of second hold
];

// Direction labels along each side
const sideLabels = [
  { label: 'Inhale',  x: SIZE / 2, y: 8,          anchor: 'middle' },
  { label: 'Hold',    x: SIZE - 4, y: SIZE / 2,   anchor: 'end'    },
  { label: 'Exhale',  x: SIZE / 2, y: SIZE - 2,   anchor: 'middle' },
  { label: 'Hold',    x: 4,        y: SIZE / 2,   anchor: 'start'  },
];

export function BoxGuide({ phaseIndex, progress, color, countdown, phase }) {
  // Interpolate ball position between the start corner of this phase
  // and the start corner of the NEXT phase.
  const fromCorner = corners[phaseIndex % 4];
  const toCorner   = corners[(phaseIndex + 1) % 4];

  const bx = fromCorner.x + (toCorner.x - fromCorner.x) * progress - BALL / 2;
  const by = fromCorner.y + (toCorner.y - fromCorner.y) * progress - BALL / 2;

  return (
    <div className="breathing-box-wrapper">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="breathing-box-svg"
        aria-label="Box breathing guide"
      >
        {/* Track */}
        <rect
          x={CORNER}
          y={CORNER}
          width={SIZE - CORNER * 2}
          height={SIZE - CORNER * 2}
          rx={8}
          ry={8}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={2}
        />

        {/* Side labels */}
        {sideLabels.map((s, i) => (
          <text
            key={i}
            x={s.x}
            y={s.y}
            textAnchor={s.anchor}
            dominantBaseline="middle"
            fill={i === phaseIndex % 4 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'}
            fontSize="11"
            fontFamily="inherit"
            style={{ transition: 'fill 0.4s' }}
          >
            {s.label}
          </text>
        ))}

        {/* Ball */}
        <motion.circle
          cx={bx + BALL / 2}
          cy={by + BALL / 2}
          r={BALL / 2}
          fill={color}
          filter="url(#glow)"
          animate={{ cx: bx + BALL / 2, cy: by + BALL / 2 }}
          transition={{ ease: 'linear', duration: 0.5 }}
        />

        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
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
