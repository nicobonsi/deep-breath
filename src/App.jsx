import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { techniques, backgrounds, sounds } from './data/techniques';
import { useBreathing }    from './hooks/useBreathing';
import { useAmbientSound } from './hooks/useAmbientSound';

import { BreathingGuide }    from './components/BreathingGuide';
import { TechniqueSelector } from './components/TechniqueSelector';
import { SoundControl }      from './components/SoundControl';
import { BackgroundPicker }  from './components/BackgroundPicker';
import { SessionTimer }      from './components/SessionTimer';

import './App.css';

const DEFAULT_TECHNIQUE  = techniques[0];
const DEFAULT_BACKGROUND = backgrounds[0];
const DEFAULT_SOUND      = sounds[0]; // silence

export default function App() {
  const [technique,    setTechnique]    = useState(DEFAULT_TECHNIQUE);
  const [background,   setBackground]   = useState(DEFAULT_BACKGROUND);
  const [activeSound,  setActiveSound]  = useState(DEFAULT_SOUND);
  const [volume,       setVolume]       = useState(0.4);
  const [showSelector, setShowSelector] = useState(false);

  const { play, stop, setVolume: setSoundVolume } = useAmbientSound();
  const breathing = useBreathing(technique);

  const handleSoundChange = useCallback((sound) => {
    setActiveSound(sound);
    if (sound.type === 'none') {
      stop();
    } else {
      play(sound, volume);
    }
  }, [play, stop, volume]);

  const handleVolumeChange = useCallback((v) => {
    setVolume(v);
    setSoundVolume(v);
  }, [setSoundVolume]);

  const handleTechniqueSelect = useCallback((t) => {
    setTechnique(t);
  }, []);

  return (
    <div
      className="app-root"
      style={{
        backgroundImage: background.url ? `url(${background.url})` : 'none',
        backgroundColor: background.url ? undefined : '#0a0a0f',
      }}
    >
      <div className="app-overlay" />

      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🌬️</span>
          <span className="logo-text">Deep Breath</span>
        </div>

        <div className="header-controls">
          <BackgroundPicker active={background} onSelect={setBackground} />
          <SoundControl
            activeSound={activeSound}
            onSoundChange={handleSoundChange}
            volume={volume}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        {/* Technique picker button */}
        <div className="technique-header">
          <button
            className="technique-select-btn"
            onClick={() => setShowSelector(true)}
            style={{ '--accent': technique.color }}
          >
            <span className="technique-dot-sm" style={{ background: technique.color }} />
            {technique.name}
            <span className="chevron">▾</span>
          </button>

          {technique.note && !breathing.isRunning && (
            <p className="technique-note">{technique.note}</p>
          )}
        </div>

        {/* Breathing / meditation visual */}
        <div className={`guide-container ${technique.guideType === 'guided' ? 'guide-container--guided' : ''}`}>
          <BreathingGuide
            technique={technique}
            phase={breathing.phase}
            phaseIndex={breathing.phaseIndex}
            progress={breathing.progress}
            countdown={breathing.countdown}
            isRunning={breathing.isRunning}
          />
        </div>

        {/* Phase strip — hidden for guided meditations (the component handles its own progress) */}
        {technique.guideType !== 'guided' && (
          <div className="phase-sequence">
            {technique.phases.map((p, i) => (
              <div
                key={i}
                className={`phase-chip ${i === breathing.phaseIndex && breathing.isRunning ? 'active' : ''}`}
                style={{ '--accent': technique.color }}
              >
                <span className="phase-chip-label">{p.label}</span>
                <span className="phase-chip-dur">{p.duration}s</span>
              </div>
            ))}
          </div>
        )}

        {/* Session stats — only for breathing techniques */}
        <AnimatePresence>
          {technique.guideType !== 'guided' && (breathing.isRunning || breathing.cycleCount > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <SessionTimer
                totalTime={breathing.totalTime}
                cycleCount={breathing.cycleCount}
                technique={technique}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="controls">
          <motion.button
            className="primary-btn"
            style={{ '--accent': technique.color }}
            onClick={breathing.toggle}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
          >
            {breathing.isRunning
              ? '⏸  Pause'
              : breathing.cycleCount > 0
              ? '▶  Resume'
              : '▶  Begin'}
          </motion.button>

          {(breathing.isRunning || breathing.cycleCount > 0) && (
            <button className="ghost-btn" onClick={breathing.reset}>
              ↺ Reset
            </button>
          )}
        </div>

        {/* Description (only when idle) */}
        <AnimatePresence mode="wait">
          {!breathing.isRunning && (
            <motion.p
              key={technique.id}
              className="technique-description"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {technique.description}
            </motion.p>
          )}
        </AnimatePresence>
      </main>

      {/* Technique selector overlay */}
      <AnimatePresence>
        {showSelector && (
          <TechniqueSelector
            selected={technique}
            onSelect={handleTechniqueSelect}
            onClose={() => setShowSelector(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
