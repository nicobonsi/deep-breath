import { BoxGuide }         from './BoxGuide';
import { CircleGuide }      from './CircleGuide';
import { GuidedMeditation } from './GuidedMeditation';

export function BreathingGuide({ technique, phase, phaseIndex, progress, countdown, isRunning, hasStarted }) {
  const color  = technique?.color  ?? '#6366f1';
  const phases = technique?.phases ?? [];

  if (technique?.guideType === 'box') {
    return (
      <BoxGuide
        phaseIndex={phaseIndex}
        phase={phase}
        color={color}
        countdown={countdown}
        isRunning={isRunning}
        hasStarted={hasStarted}
        progress={progress}
      />
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
      />
    );
  }

  return (
    <CircleGuide
      phase={phase}
      phaseIndex={phaseIndex}
      phases={phases}
      color={color}
      countdown={countdown}
      isRunning={isRunning}
      hasStarted={hasStarted}
      progress={progress}
    />
  );
}
