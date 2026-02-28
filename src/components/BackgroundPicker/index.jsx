import { useState } from 'react';
import { backgrounds } from '../../data/techniques';

export function BackgroundPicker({ active, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-picker">
      <button
        className="icon-btn"
        onClick={() => setOpen(o => !o)}
        title="Background Image"
        aria-label="Background settings"
      >
        🖼️
      </button>

      {open && (
        <div className="bg-popup">
          <p className="popup-title">Background</p>
          <div className="bg-grid">
            {backgrounds.map(bg => (
              <button
                key={bg.id}
                className={`bg-thumb-btn ${active?.id === bg.id ? 'active' : ''}`}
                onClick={() => { onSelect(bg); setOpen(false); }}
                title={bg.label}
              >
                {bg.url ? (
                  <img
                    src={bg.url.replace('w=1920', 'w=200')}
                    alt={bg.label}
                    className="bg-thumb"
                    loading="lazy"
                  />
                ) : (
                  <div className="bg-thumb bg-dark-thumb" />
                )}
                <span className="bg-thumb-label">{bg.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
