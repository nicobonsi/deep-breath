import { BoxGuide }    from './BoxGuide';
import { CircleGuide } from './CircleGuide';

export function BreathingGuide({ technique, phase, phaseIndex, progress, countdown }) {
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

  return (
    <CircleGuide
      phase={phase}
      progress={progress}
      color={color}
      countdown={countdown}
    />
  );
}
