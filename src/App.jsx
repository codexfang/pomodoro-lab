import { useEffect } from 'react';
import useStore from './store';
import Timer from './components/Timer';
import Controls from './components/Controls';
import TaskInput from './components/TaskInput';
import SessionHistory from './components/SessionHistory';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

function applyTheme(theme) {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

export default function App() {
  const view = useStore((s) => s.view);
  const theme = useStore((s) => s.theme);
  const setView = useStore((s) => s.setView);
  const setSettingsOpen = useStore((s) => s.setSettingsOpen);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (useStore.getState().theme === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    document.title = 'Pomodoro Lab';
  }, []);

  if (view === 'analytics') {
    return <Analytics />;
  }

  return (
    <div className="app">
      <Settings />

      <header className="app-header">
        <span className="app-logo">Pomodoro Lab</span>
        <div className="app-header-actions">
          <button className="btn-header" onClick={() => setView('analytics')}>Analytics</button>
          <button className="btn-header" onClick={() => setSettingsOpen(true)}>Settings</button>
        </div>
      </header>

      <main className="app-main">
        <div className="timer-section">
          <Timer />
          <Controls />
          <TaskInput />
        </div>

        <aside className="sidebar">
          <SessionHistory />
        </aside>
      </main>
    </div>
  );
}
