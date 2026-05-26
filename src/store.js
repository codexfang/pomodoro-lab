import { create } from 'zustand';
import { loadSessions, saveSessions, loadSettings, saveSettings } from './utils/storage';
import { playNotificationSound } from './utils/time';

const settings = loadSettings();

const useStore = create((set, get) => ({
  mode: 'work',
  timeRemaining: settings.workDuration * 60,
  isRunning: false,
  startedAt: null,
  elapsed: 0,
  completedCycles: 0,
  taskName: '',
  sessions: loadSessions(),

  workDuration: settings.workDuration,
  shortBreakDuration: settings.shortBreakDuration,
  longBreakDuration: settings.longBreakDuration,
  soundEnabled: settings.soundEnabled,
  theme: settings.theme,
  view: 'timer',
  settingsOpen: false,

  setView: (view) => set({ view }),

  setTaskName: (taskName) => set({ taskName }),

  setTheme: (theme) => {
    set({ theme });
    saveSettings({ workDuration: get().workDuration, shortBreakDuration: get().shortBreakDuration, longBreakDuration: get().longBreakDuration, soundEnabled: get().soundEnabled, theme });
  },

  setSoundEnabled: (soundEnabled) => {
    set({ soundEnabled });
    saveSettings({ workDuration: get().workDuration, shortBreakDuration: get().shortBreakDuration, longBreakDuration: get().longBreakDuration, soundEnabled, theme: get().theme });
  },

  setDurations: (work, shortBreak, longBreak) => {
    const mode = get().mode;
    set({
      workDuration: work,
      shortBreakDuration: shortBreak,
      longBreakDuration: longBreak,
      timeRemaining: mode === 'work' ? work * 60 : mode === 'shortBreak' ? shortBreak * 60 : longBreak * 60,
    });
    saveSettings({ workDuration: work, shortBreakDuration: shortBreak, longBreakDuration: longBreak, soundEnabled: get().soundEnabled, theme: get().theme });
  },

  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),

  start: () => {
    set({ isRunning: true, startedAt: Date.now() });
  },

  pause: () => {
    const state = get();
    if (state.isRunning) {
      const elapsed = state.elapsed + (Date.now() - state.startedAt);
      set({ isRunning: false, elapsed });
    }
  },

  reset: () => {
    const { mode, workDuration, shortBreakDuration, longBreakDuration } = get();
    const durations = { work: workDuration, shortBreak: shortBreakDuration, longBreak: longBreakDuration };
    set({
      isRunning: false,
      startedAt: null,
      elapsed: 0,
      timeRemaining: durations[mode] * 60,
    });
  },

  tick: () => {
    const { startedAt, elapsed, workDuration, shortBreakDuration, longBreakDuration, mode, completedCycles, sessions, taskName } = get();
    if (!startedAt) return;

    const totalElapsed = elapsed + (Date.now() - startedAt);
    const totalSeconds = Math.floor(totalElapsed / 1000);
    const durations = {
      work: workDuration * 60,
      shortBreak: shortBreakDuration * 60,
      longBreak: longBreakDuration * 60,
    };
    const sessionLength = durations[mode];
    const remaining = Math.max(0, sessionLength - totalSeconds);

    if (remaining <= 0) {
      const now = new Date().toISOString();
      const newSession = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        taskName: taskName || 'Untitled',
        duration: mode,
        durationMinutes: mode === 'work' ? workDuration : mode === 'shortBreak' ? shortBreakDuration : longBreakDuration,
        timestamp: now,
      };

      const updatedSessions = [...sessions, newSession];
      saveSessions(updatedSessions);

      const newCompletedCycles = mode === 'work' ? completedCycles + 1 : completedCycles;
      const isLongBreakDue = newCompletedCycles > 0 && newCompletedCycles % 4 === 0;
      const nextMode = mode === 'work' ? (isLongBreakDue ? 'longBreak' : 'shortBreak') : 'work';
      const nextDuration = nextMode === 'work' ? workDuration * 60 : nextMode === 'shortBreak' ? shortBreakDuration * 60 : longBreakDuration * 60;

      const state = get();
      if (state.soundEnabled) {
        playNotificationSound();
      }
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        const labels = { work: 'Focus session', shortBreak: 'Short break', longBreak: 'Long break' };
        new Notification('Pomodoro Lab', { body: `${labels[mode]} completed!` });
      }

      set({
        mode: nextMode,
        timeRemaining: nextDuration,
        isRunning: false,
        startedAt: null,
        elapsed: 0,
        completedCycles: newCompletedCycles,
        sessions: updatedSessions,
      });

      document.title = `Pomodoro Lab`;
      return;
    }

    set({ timeRemaining: remaining });
    const labels = { work: 'Focus Session', shortBreak: 'Short Break', longBreak: 'Long Break' };
    const h = Math.floor(remaining / 60);
    const m = remaining % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    document.title = `⏰ ${timeStr} - ${labels[mode]}`;
  },

  clearSessions: () => {
    set({ sessions: [] });
    saveSessions([]);
  },
}));

export default useStore;
