import useStore from '../store';
import { formatTime } from '../utils/time';
import { useTimer } from '../hooks/useTimer';

const modeConfig = {
  work: { label: 'Focus', color: '#6366f1' },
  shortBreak: { label: 'Short Break', color: '#22c55e' },
  longBreak: { label: 'Long Break', color: '#3b82f6' },
};

export default function Timer() {
  const mode = useStore((s) => s.mode);
  const timeRemaining = useStore((s) => s.timeRemaining);
  const workDuration = useStore((s) => s.workDuration);
  const shortBreakDuration = useStore((s) => s.shortBreakDuration);
  const longBreakDuration = useStore((s) => s.longBreakDuration);
  const completedCycles = useStore((s) => s.completedCycles);

  useTimer();

  const config = modeConfig[mode];
  const durations = { work: workDuration, shortBreak: shortBreakDuration, longBreak: longBreakDuration };
  const total = durations[mode] * 60;
  const progress = total > 0 ? (total - timeRemaining) / total : 0;
  const strokeDasharray = 2 * Math.PI * 130;
  const strokeDashoffset = strokeDasharray * (1 - progress);

  return (
    <div className="timer-container">
      <div className="timer-mode-label" style={{ color: config.color }}>
        {config.label}
      </div>

      <div className="timer-ring-wrapper">
        <svg className="timer-ring" viewBox="0 0 300 300">
          <circle
            cx="150"
            cy="150"
            r="130"
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
          <circle
            cx="150"
            cy="150"
            r="130"
            fill="none"
            stroke={config.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 150 150)"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div className="timer-display">
          <span className="timer-time">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {mode === 'work' && (
        <div className="timer-cycles">
          Session #{completedCycles + 1}
        </div>
      )}
    </div>
  );
}
