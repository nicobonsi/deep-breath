import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useElevenLabs } from '../../hooks/useElevenLabs';

/**
 * GuidedMeditation – full-screen text-driven experience.
 *
 * Shows:
 *  • A softly pulsing ambient orb (colour from technique)
 *  • Phase label at the top
 *  • Instruction text, cross-fading between phases
 *  • A thin progress bar showing time remaining in current phase
 *  • Phase breadcrumb dots at the bottom
 *  • Optional ElevenLabs voice narration toggle
 */
export function GuidedMeditation({ technique, phase, phaseIndex, progress, countdown, isRunning }) {
  const color  = technique?.color ?? '#818cf8';
  const phases = technique?.phases ?? [];
  const total  = phases.length;

  // ── Speech state ──────────────────────────────────────────
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showKeyInput,  setShowKeyInput]  = useState(false);
  const [keyInput,      setKeyInput]      = useState('');
  const keyInputRef = useRef(null);

  const { speak, stop, isSpeaking, error, apiKey, saveApiKey } = useElevenLabs();

  // Trigger narration when phase changes or speech is toggled
  useEffect(() => {
    if (!speechEnabled || !isRunning) {
      stop();
      return;
    }
    if (phase?.instruction) {
      speak(phase.instruction);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, speechEnabled, isRunning, speak, stop]);

  // Auto-focus the key input when it appears
  useEffect(() => {
    if (showKeyInput) keyInputRef.current?.focus();
  }, [showKeyInput]);

  const handleSpeechToggle = () => {
    if (!speechEnabled) {
      setSpeechEnabled(true);
      if (!apiKey) {
        setShowKeyInput(true);
        setKeyInput('');
      }
    } else {
      setSpeechEnabled(false);
      setShowKeyInput(false);
      stop();
    }
  };

  const handleSaveKey = () => {
    if (keyInput.trim()) {
      saveApiKey(keyInput.trim());
      setShowKeyInput(false);
    }
  };

  const handleKeyInputKeyDown = (e) => {
    if (e.key === 'Enter')  handleSaveKey();
    if (e.key === 'Escape') {
      setShowKeyInput(false);
      if (!apiKey) setSpeechEnabled(false);
    }
  };

  // ── Format remaining time as m:ss ─────────────────────────
  const mins    = Math.floor(countdown / 60);
  const secs    = String(countdown % 60).padStart(2, '0');
  const timeLeft = mins > 0 ? `${mins}:${secs}` : `${countdown}s`;

  const lines = (phase?.instruction ?? '').split('\n');

  return (
    <div className="guided-wrapper">

      {/* Ambient orb — breathes slowly always */}
      <div className="guided-orb-container" aria-hidden="true">
        <motion.div
          className="guided-orb"
          style={{ background: `radial-gradient(circle, ${color}55 0%, ${color}22 50%, transparent 75%)` }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Phase label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${phaseIndex}`}
          className="guided-phase-label"
          style={{ color }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5 }}
        >
          {phase?.label}
        </motion.div>
      </AnimatePresence>

      {/* Instruction text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`instruction-${phaseIndex}`}
          className="guided-instruction"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {lines.map((line, i) =>
            line.trim() === '' ? (
              <br key={i} />
            ) : (
              <p key={i}>{line}</p>
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar + time remaining */}
      {isRunning && (
        <div className="guided-progress-area">
          <div className="guided-progress-track">
            <motion.div
              className="guided-progress-fill"
              style={{ background: color }}
              animate={{ width: `${(1 - progress) * 100}%` }}
              transition={{ ease: 'linear', duration: 1 }}
            />
          </div>
          <span className="guided-time-left">{timeLeft}</span>
        </div>
      )}

      {/* Phase breadcrumb dots */}
      <div className="guided-dots" aria-label={`Phase ${phaseIndex + 1} of ${total}`}>
        {phases.map((_, i) => (
          <motion.div
            key={i}
            className="guided-dot"
            animate={{
              scale:      i === phaseIndex ? 1.4 : 1,
              opacity:    i < phaseIndex ? 1 : i === phaseIndex ? 1 : 0.3,
              background: i <= phaseIndex ? color : 'rgba(255,255,255,0.3)',
            }}
            transition={{ duration: 0.35 }}
          />
        ))}
      </div>

      {/* Voice narration toggle */}
      <div className="speech-row">
        <button
          className={`speech-toggle-btn${speechEnabled ? ' active' : ''}${isSpeaking ? ' speaking' : ''}`}
          style={speechEnabled ? { '--accent': color } : {}}
          onClick={handleSpeechToggle}
          title={speechEnabled ? 'Disable voice narration' : 'Enable voice narration'}
          aria-pressed={speechEnabled}
        >
          {/* Headphones icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z"/>
            <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z"/>
          </svg>
          <span className="speech-toggle-label">Voice</span>
          {isSpeaking && (
            <span className="speech-wave" aria-hidden="true">
              <span /><span /><span />
            </span>
          )}
        </button>
      </div>

      {/* API key input */}
      {(showKeyInput || (speechEnabled && !apiKey)) && (
        <div className="speech-key-row">
          <input
            ref={keyInputRef}
            type="password"
            className="speech-key-input"
            placeholder="ElevenLabs API key"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            onKeyDown={handleKeyInputKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="speech-key-save"
            onClick={handleSaveKey}
            disabled={!keyInput.trim()}
          >
            Save
          </button>
        </div>
      )}

      {/* Error */}
      {error && speechEnabled && (
        <p className="speech-error">
          {error}
          {' · '}
          <button className="speech-error-link" onClick={() => { setShowKeyInput(true); setKeyInput(''); }}>
            change key
          </button>
        </p>
      )}

    </div>
  );
}
