export function SessionTimer({ totalTime, cycleCount, technique }) {
  return (
    <div className="session-timer">
      <div className="timer-item">
        <span className="timer-value">{totalTime}</span>
        <span className="timer-label">Session</span>
      </div>
      {cycleCount > 0 && (
        <div className="timer-item">
          <span className="timer-value">{cycleCount}</span>
          <span className="timer-label">{cycleCount === 1 ? 'Cycle' : 'Cycles'}</span>
        </div>
      )}
      {technique?.cycles && (
        <div className="timer-item">
          <span className="timer-value">{technique.cycles}</span>
          <span className="timer-label">Target</span>
        </div>
      )}
    </div>
  );
}
