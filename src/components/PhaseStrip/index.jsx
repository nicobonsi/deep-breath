import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * EditablePhaseChip
 *
 * When the session is idle, clicking the duration (e.g. "4s") opens an
 * inline number input right inside the chip. Press Enter, Tab, or click
 * away to save. Press Escape to cancel. Spinners are hidden — just type
 * the number you want.
 */
function EditablePhaseChip({ phase, duration, defaultDuration, isActive, canEdit, color, onSave }) {
  const [editing,  setEditing]  = useState(false);
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef(null);

  const isCustomised = duration !== defaultDuration;

  // Focus + select-all when entering edit mode
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const openEdit = useCallback(() => {
    if (!canEdit) return;
    setInputVal(String(duration));
    setEditing(true);
  }, [canEdit, duration]);

  const commit = useCallback(() => {
    const parsed = parseInt(inputVal, 10);
    const clamped = isNaN(parsed) ? duration : Math.max(1, Math.min(90, parsed));
    onSave(clamped);
    setEditing(false);
  }, [inputVal, duration, onSave]);

  const cancel = useCallback(() => {
    setEditing(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') cancel();
  }, [commit, cancel]);

  // Auto-size input to content (1–2 digits wide)
  const inputWidth = `${Math.max(1, inputVal.length)}ch`;

  return (
    <div
      className={[
        'phase-chip',
        isActive  ? 'active'   : '',
        canEdit   ? 'editable' : '',
        editing   ? 'editing'  : '',
      ].join(' ')}
      style={{ '--accent': color }}
      onClick={!editing ? openEdit : undefined}
      title={canEdit && !editing ? 'Click to edit duration' : undefined}
    >
      <span className="phase-chip-label">{phase.label}</span>

      {editing ? (
        <span className="phase-chip-dur editing-wrap">
          <input
            ref={inputRef}
            type="number"
            className="phase-chip-input"
            value={inputVal}
            min={1}
            max={90}
            style={{ width: inputWidth }}
            onChange={e => setInputVal(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            onClick={e => e.stopPropagation()}
            aria-label={`${phase.label} duration in seconds`}
          />
          <span className="phase-chip-unit">s</span>
        </span>
      ) : (
        <span
          className={`phase-chip-dur ${isCustomised ? 'customised' : ''}`}
        >
          {duration}s
        </span>
      )}
    </div>
  );
}

/**
 * PhaseStrip
 *
 * Renders the row of phase chips.
 * When canEdit is true (session idle, breathing technique), each chip's
 * duration is clickable. Shows a subtle "↺ defaults" link if any
 * duration has been customised.
 */
export function PhaseStrip({ technique, phases, activeIndex, isRunning, hasStarted, defaultPhases, onSetDuration, onReset, isCustomised }) {
  const canEdit = !isRunning && !hasStarted;

  return (
    <div className="phase-strip-wrapper">
      <div className="phase-sequence">
        {phases.map((p, i) => (
          <EditablePhaseChip
            key={i}
            phase={p}
            duration={p.duration}
            defaultDuration={defaultPhases[i]?.duration ?? p.duration}
            isActive={i === activeIndex && (isRunning || hasStarted)}
            canEdit={canEdit && (!technique.linkedDurations || i === 0)}
            color={technique.color}
            onSave={(val) => {
              if (technique.linkedDurations) {
                phases.forEach((_, j) => onSetDuration(technique.id, j, val));
              } else {
                onSetDuration(technique.id, i, val);
              }
            }}
          />
        ))}
      </div>

      {/* Reset link — only when timing is customised and session is idle */}
      {isCustomised && canEdit && (
        <button
          className="phase-strip-reset"
          onClick={() => onReset(technique.id)}
          title="Reset all durations to recommended defaults"
        >
          ↺ defaults
        </button>
      )}
    </div>
  );
}
