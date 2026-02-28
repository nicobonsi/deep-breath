import { BoxGuide }         from './BoxGuide';
import { CircleGuide }      from './CircleGuide';
import { GuidedMeditation } from './GuidedMeditation';

export function BreathingGuide({ technique, phase, phaseIndex, progress, countdown, isRunning }) {
  const color = technique?.color ?? '#6366f1';

  if (technique?.guideType === 'box') {
    return (
      <BoxGuide
        phaseIndex={phaseIndex}
        progress={progress}
        color={color}
        countdown={countdown}
        phase={phase}
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
      progress={progress}
      color={color}
      countdown={countdown}
    />
  );
}
