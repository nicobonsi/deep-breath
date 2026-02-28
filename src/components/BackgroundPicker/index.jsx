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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M3 15l5-5 4 4 3-3 6 6" />
        </svg>
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
