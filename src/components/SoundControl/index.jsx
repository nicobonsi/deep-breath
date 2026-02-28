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
        {activeSound?.icon ?? '🔇'}
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
            <span>🔈</span>
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
            <span>🔊</span>
          </div>
        </div>
      )}
    </div>
  );
}
