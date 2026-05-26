import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts';
import useStore from '../store';
import { getDayKey, getWeekDateRange, getDayName, getHour, formatDuration } from '../utils/time';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#a855f7'];

function useAnalytics() {
  const sessions = useStore((s) => s.sessions);
  const focusSessions = sessions.filter((s) => s.duration === 'work');

  return useMemo(() => {
    const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + (s.durationMinutes || 25), 0);

    const dailyMap = {};
    focusSessions.forEach((s) => {
      const key = getDayKey(s.timestamp);
      dailyMap[key] = (dailyMap[key] || 0) + (s.durationMinutes || 25);
    });
    const dailyData = Object.entries(dailyMap)
      .map(([date, minutes]) => ({ date, minutes }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);

    const weekDates = getWeekDateRange(new Date());
    const weeklyData = weekDates.map((d) => {
      const key = getDayKey(d);
      return {
        day: getDayName(d),
        date: key,
        minutes: dailyMap[key] || 0,
      };
    });

    const taskMap = {};
    focusSessions.forEach((s) => {
      const name = s.taskName || 'Untitled';
      taskMap[name] = (taskMap[name] || 0) + (s.durationMinutes || 25);
    });
    const taskData = Object.entries(taskMap)
      .map(([name, minutes]) => ({ name, minutes }))
      .sort((a, b) => b.minutes - a.minutes);

    const hourCounts = {};
    focusSessions.forEach((s) => {
      const hour = getHour(s.timestamp);
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const bestHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

    const weekDaysCount = {};
    focusSessions.forEach((s) => {
      const day = getDayName(s.timestamp);
      weekDaysCount[day] = (weekDaysCount[day] || 0) + 1;
    });
    const bestDay = Object.entries(weekDaysCount).sort((a, b) => b[1] - a[1])[0];

    return {
      totalFocusMinutes,
      totalSessions: focusSessions.length,
      dailyData,
      weeklyData,
      taskData,
      bestHour: bestHour ? `${bestHour[0]}:00` : '--',
      bestDay: bestDay ? bestDay[0] : '--',
    };
  }, [focusSessions]);
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">{formatDuration(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function Analytics() {
  const {
    totalFocusMinutes,
    totalSessions,
    dailyData,
    weeklyData,
    taskData,
    bestHour,
    bestDay,
  } = useAnalytics();

  const setView = useStore((s) => s.setView);

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2 className="analytics-title">Analytics</h2>
        <button className="btn btn-secondary" onClick={() => setView('timer')}>
          Back to Timer
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Focus Time</span>
          <span className="stat-value">{formatDuration(totalFocusMinutes)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sessions Completed</span>
          <span className="stat-value">{totalSessions}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Best Hour</span>
          <span className="stat-value">{bestHour}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Best Day</span>
          <span className="stat-value">{bestDay}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">This Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barCategoryGap={8}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--hover-bg)' }} />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Task Distribution</h3>
          {taskData.length === 0 ? (
            <div className="chart-empty">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={taskData}
                  dataKey="minutes"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                >
                  {taskData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card chart-card-wide">
          <h3 className="chart-title">Daily Focus (Last 14 Days)</h3>
          {dailyData.length === 0 ? (
            <div className="chart-empty">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
