const KEYS = {
  SESSIONS: 'pomodoro-lab-sessions',
  SETTINGS: 'pomodoro-lab-settings',
};

export function loadSessions() {
  try {
    const data = localStorage.getItem(KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions) {
  try {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {
    // storage full or unavailable
  }
}

export function loadSettings() {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed;
    }
  } catch {
    // ignore
  }
  return {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    soundEnabled: true,
    theme: 'system',
  };
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // storage full or unavailable
  }
}
