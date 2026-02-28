import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { techniques, backgrounds, sounds } from './data/techniques';
import { useBreathing }         from './hooks/useBreathing';
import { useAmbientSound }      from './hooks/useAmbientSound';
import { useTechniqueSettings } from './hooks/useTechniqueSettings';

import { BreathingGuide }    from './components/BreathingGuide';
import { TechniqueSelector } from './components/TechniqueSelector';
import { SoundControl }      from './components/SoundControl';
import { BackgroundPicker }  from './components/BackgroundPicker';
import { SessionTimer }      from './components/SessionTimer';
import { PhaseStrip }        from './components/PhaseStrip';

import './App.css';

const DEFAULT_TECHNIQUE  = techniques[0];
const DEFAULT_BACKGROUND = backgrounds[0];
const DEFAULT_SOUND      = sounds[0];

export default function App() {
  const [technique,    setTechnique]    = useState(DEFAULT_TECHNIQUE);
  const [background,   setBackground]   = useState(DEFAULT_BACKGROUND);
  const [activeSound,  setActiveSound]  = useState(DEFAULT_SOUND);
  const [volume,       setVolume]       = useState(0.4);
  const [showSelector, setShowSelector] = useState(false);

  const { play, stop, setVolume: setSoundVolume } = useAmbientSound();

  const {
    getActiveTechnique,
    setDuration,
    resetDurations,
    isCustomised,
  } = useTechniqueSettings();

  const activeTechnique = getActiveTechnique(technique);
  const breathing       = useBreathing(activeTechnique);

  const handleSoundChange = useCallback((sound) => {
    setActiveSound(sound);
    if (sound.type === 'none') stop();
    else play(sound, volume);
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
            {isCustomised(technique) && (
              <span className="technique-custom-badge" title="Timing customised">✦</span>
            )}
            <span className="chevron">▾</span>
          </button>

          {technique.note && !breathing.isRunning && (
            <p className="technique-note">{technique.note}</p>
          )}
        </div>

        {/* Breathing / meditation visual */}
        <div className={`guide-container ${technique.guideType === 'guided' ? 'guide-container--guided' : ''}`}>
          <BreathingGuide
            technique={activeTechnique}
            phase={breathing.phase}
            phaseIndex={breathing.phaseIndex}
            progress={breathing.progress}
            countdown={breathing.countdown}
            isRunning={breathing.isRunning}
            hasStarted={breathing.hasStarted}
          />
        </div>

        {/* Phase strip — inline-editable chips, hidden for guided meditations */}
        {technique.guideType !== 'guided' && (
          <PhaseStrip
            technique={technique}
            phases={activeTechnique.phases}
            defaultPhases={technique.phases}
            activeIndex={breathing.phaseIndex}
            isRunning={breathing.isRunning}
            hasStarted={breathing.hasStarted}
            onSetDuration={setDuration}
            onReset={resetDurations}
            isCustomised={isCustomised(technique)}
          />
        )}

        {/* Session stats — always visible for breathing techniques so layout never jumps */}
        {technique.guideType !== 'guided' && (
          <SessionTimer
            totalTime={breathing.totalTime}
            cycleCount={breathing.cycleCount}
            technique={activeTechnique}
          />
        )}

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

        {/* Description — always visible */}
        <p className="technique-description">{technique.description}</p>

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
