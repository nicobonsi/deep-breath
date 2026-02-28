import { useState } from 'react';
import { sounds } from '../../data/techniques';

export function SoundControl({ activeSound, onSoundChange, volume, onVolumeChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sound-control">
      <button
        className="icon-btn"
        onClick={() => setOpen(o => !o)}
        title="Background Sound"
        aria-label="Sound settings"
      >
        {activeSound?.type === 'none' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {open && (
        <div className="sound-popup">
          <p className="popup-title">Background Sound</p>
          <div className="sound-grid">
            {sounds.map(s => (
              <button
                key={s.id}
                className={`sound-btn ${activeSound?.id === s.id ? 'active' : ''}`}
                onClick={() => { onSoundChange(s); }}
                title={s.label}
              >
                <span className="sound-icon">{s.icon}</span>
                <span className="sound-label">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="volume-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={e => onVolumeChange(parseFloat(e.target.value))}
              className="volume-slider"
              aria-label="Volume"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
