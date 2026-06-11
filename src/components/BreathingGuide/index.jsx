import { BoxGuide }           from './BoxGuide';
import { CircleGuide }        from './CircleGuide';
import { GuidedMeditation }   from './GuidedMeditation';
import { useBreathingCount } from '../../hooks/useBreathingCount';

function VoiceToggle({ color, voiceEnabled, toggleVoice, canUseVoice }) {
  return (
    <div className="breathing-voice-row">
      <button
        className={`speech-toggle-btn${voiceEnabled ? ' active' : ''}`}
        style={voiceEnabled ? { '--accent': color } : {}}
        onClick={toggleVoice}
        disabled={!canUseVoice}
        title={
          !canUseVoice
            ? 'Voice counting not available for this timing'
            : voiceEnabled
            ? 'Disable voice counting'
            : 'Enable voice counting'
        }
        aria-pressed={voiceEnabled}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
        <span className="speech-toggle-label">Count</span>
      </button>
    </div>
  );
}

export function BreathingGuide({ technique, phase, phaseIndex, progress, countdown, displayCount, isRunning, hasStarted, advancePhase }) {
  const color  = technique?.color  ?? '#6366f1';
  const phases = technique?.phases ?? [];

  const { voiceEnabled, toggleVoice, canUseVoice } = useBreathingCount(
    technique,
    phaseIndex,
    phase,
    isRunning,
    countdown,
  );

  if (technique?.guideType === 'box') {
    return (
      <div className="breathing-guide-stack">
        <BoxGuide
          phaseIndex={phaseIndex}
          phase={phase}
          color={color}
          countdown={displayCount}
          isRunning={isRunning}
          hasStarted={hasStarted}
          progress={progress}
        />
        <VoiceToggle
          color={color}
          voiceEnabled={voiceEnabled}
          toggleVoice={toggleVoice}
          canUseVoice={canUseVoice}
        />
      </div>
    );
  }

  if (technique?.guideType === 'guided') {
    return (
      <GuidedMeditation
        technique={technique}
        phase={phase}
        phaseIndex={phaseIndex}
        progress={progress}
        countdown={countdown}
        isRunning={isRunning}
        advancePhase={advancePhase}
      />
    );
  }

  return (
    <div className="breathing-guide-stack">
      <CircleGuide
        phase={phase}
        phaseIndex={phaseIndex}
        phases={phases}
        color={color}
        countdown={displayCount}
        isRunning={isRunning}
        hasStarted={hasStarted}
        progress={progress}
      />
      <VoiceToggle
        color={color}
        voiceEnabled={voiceEnabled}
        toggleVoice={toggleVoice}
        canUseVoice={canUseVoice}
      />
    </div>
  );
}
