import useStore from '../store';

export default function Settings() {
  const settingsOpen = useStore((s) => s.settingsOpen);
  const setSettingsOpen = useStore((s) => s.setSettingsOpen);
  const workDuration = useStore((s) => s.workDuration);
  const shortBreakDuration = useStore((s) => s.shortBreakDuration);
  const longBreakDuration = useStore((s) => s.longBreakDuration);
  const setDurations = useStore((s) => s.setDurations);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const setSoundEnabled = useStore((s) => s.setSoundEnabled);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  if (!settingsOpen) return null;

  return (
    <div className="settings-overlay" onClick={() => setSettingsOpen(false)}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button className="btn-icon" onClick={() => setSettingsOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Timer Durations (minutes)</h3>
          <div className="settings-durations">
            <div className="settings-field">
              <label htmlFor="work-duration">Focus</label>
              <input
                id="work-duration"
                type="number"
                min="1"
                max="120"
                value={workDuration}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(120, parseInt(e.target.value) || 1));
                  setDurations(val, shortBreakDuration, longBreakDuration);
                }}
              />
            </div>
            <div className="settings-field">
              <label htmlFor="short-break-duration">Short Break</label>
              <input
                id="short-break-duration"
                type="number"
                min="1"
                max="30"
                value={shortBreakDuration}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(30, parseInt(e.target.value) || 1));
                  setDurations(workDuration, val, longBreakDuration);
                }}
              />
            </div>
            <div className="settings-field">
              <label htmlFor="long-break-duration">Long Break</label>
              <input
                id="long-break-duration"
                type="number"
                min="1"
                max="60"
                value={longBreakDuration}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(60, parseInt(e.target.value) || 1));
                  setDurations(workDuration, shortBreakDuration, val);
                }}
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Preferences</h3>
          <div className="settings-field-row">
            <label htmlFor="sound-toggle">Sound Alerts</label>
            <label className="toggle">
              <input
                id="sound-toggle"
                type="checkbox"
                checked={soundEnabled}
                onChange={() => setSoundEnabled(!soundEnabled)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="settings-field-row">
            <label>Theme</label>
            <div className="theme-options">
              {['system', 'light', 'dark'].map((t) => (
                <button
                  key={t}
                  className={`theme-option ${theme === t ? 'active' : ''}`}
                  onClick={() => setTheme(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
