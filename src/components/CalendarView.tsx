import React, { useMemo } from 'react';
import Calendar from 'react-calendar';
import { FoodEntry } from '../types';
import { groupEntriesByDate, calculateDailySummary } from '../utils/calculations';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
  entries: FoodEntry[];
  targetCalories: number;
  onDateSelect: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries, targetCalories, onDateSelect }) => {
  const dailySummaries = useMemo(() => {
    const grouped = groupEntriesByDate(entries);
    const summaries: Record<string, { calories: number; progress: number }> = {};

    Object.entries(grouped).forEach(([date, dayEntries]) => {
      const summary = calculateDailySummary(dayEntries, targetCalories);
      summaries[date] = {
        calories: summary.totalCalories,
        progress: summary.goalProgress
      };
    });

    return summaries;
  }, [entries, targetCalories]);

  const getTileContent = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const summary = dailySummaries[dateStr];

    if (!summary) return null;

    let colorClass = 'cal-low';
    if (summary.progress >= 80 && summary.progress < 100) {
      colorClass = 'cal-medium';
    } else if (summary.progress >= 100) {
      colorClass = 'cal-high';
    }

    return (
      <div className={`calendar-tile-content ${colorClass}`}>
        <div className="cal-calories">{summary.calories}</div>
        <div className="cal-progress">{Math.round(summary.progress)}%</div>
      </div>
    );
  };

  const getTileClassName = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const summary = dailySummaries[dateStr];

    if (!summary) return '';

    if (summary.progress >= 100) return 'goal-achieved';
    if (summary.progress >= 80) return 'goal-near';
    return 'goal-low';
  };

  return (
    <div className="calendar-view">
      <h3>달력 보기</h3>
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color goal-low"></span>
          <span>목표 80% 미만</span>
        </div>
        <div className="legend-item">
          <span className="legend-color goal-near"></span>
          <span>목표 80-100%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color goal-achieved"></span>
          <span>목표 달성</span>
        </div>
      </div>
      <Calendar
        onChange={(value) => onDateSelect(value as Date)}
        tileContent={getTileContent}
        tileClassName={getTileClassName}
        locale="ko-KR"
      />
    </div>
  );
};

export default CalendarView;