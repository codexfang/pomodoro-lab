import useStore from '../store';
import { formatDate, formatTimeShort, formatDuration } from '../utils/time';

export default function SessionHistory() {
  const sessions = useStore((s) => s.sessions);
  const clearSessions = useStore((s) => s.clearSessions);

  const focusSessions = sessions.filter((s) => s.duration === 'work');

  return (
    <div className="session-history">
      <div className="session-history-header">
        <h3 className="section-title">Session History</h3>
        {focusSessions.length > 0 && (
          <button className="btn-text" onClick={clearSessions}>
            Clear
          </button>
        )}
      </div>

      {focusSessions.length === 0 ? (
        <div className="session-empty">
          <p>No sessions yet. Start a focus session to track your work.</p>
        </div>
      ) : (
        <div className="session-list">
          {[...focusSessions].reverse().slice(0, 50).map((session) => (
            <div key={session.id} className="session-item">
              <div className="session-item-main">
                <span className="session-task">{session.taskName}</span>
                <span className="session-duration">{formatDuration(session.durationMinutes)}</span>
              </div>
              <div className="session-item-meta">
                <span className="session-date">{formatDate(session.timestamp)}</span>
                <span className="session-time">{formatTimeShort(session.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {focusSessions.length > 50 && (
        <div className="session-more">
          Showing 50 of {focusSessions.length} sessions
        </div>
      )}
    </div>
  );
}
