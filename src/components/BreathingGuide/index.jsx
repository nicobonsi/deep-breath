import { BoxGuide }           from './BoxGuide';
import { CircleGuide }        from './CircleGuide';
import { GuidedMeditation }   from './GuidedMeditation';

export function BreathingGuide({ technique, phase, phaseIndex, progress, countdown, displayCount, isRunning, hasStarted, advancePhase }) {
  const color  = technique?.color  ?? '#6366f1';
  const phases = technique?.phases ?? [];

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
    </div>
  );
}
