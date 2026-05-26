import useStore from '../store';

export default function TaskInput() {
  const taskName = useStore((s) => s.taskName);
  const setTaskName = useStore((s) => s.setTaskName);

  return (
    <div className="task-input">
      <label className="task-label" htmlFor="task-input">
        Current Task
      </label>
      <div className="task-input-wrapper">
        <svg className="task-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <input
          id="task-input"
          type="text"
          className="task-input-field"
          placeholder="What are you working on?"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          maxLength={100}
        />
      </div>
    </div>
  );
}
