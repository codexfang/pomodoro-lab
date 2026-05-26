import useStore from '../store';

export function useSessions() {
  const sessions = useStore((s) => s.sessions);
  return sessions;
}
