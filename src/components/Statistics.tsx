import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { FoodEntry } from '../types';
import { calculateDailySummary, groupEntriesByDate } from '../utils/calculations';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface StatisticsProps {
  entries: FoodEntry[];
  targetCalories: number;
}

type PeriodType = 'daily' | 'weekly' | 'monthly';

const Statistics: React.FC<StatisticsProps> = ({ entries, targetCalories }) => {
  const [period, setPeriod] = useState<PeriodType>('daily');
  const [selectedDate] = useState(new Date());

  const chartData = useMemo(() => {
    let days: Date[] = [];

    switch (period) {
      case 'daily':
        days = eachDayOfInterval({
          start: subDays(new Date(), 6),
          end: new Date()
        });
        break;
      case 'weekly':
        days = eachDayOfInterval({
          start: subDays(new Date(), 29),
          end: new Date()
        });
        break;
      case 'monthly':
        days = eachDayOfInterval({
          start: subDays(new Date(), 89),
          end: new Date()
        });
        break;
    }

    const groupedEntries = groupEntriesByDate(entries);

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayEntries = groupedEntries[dateStr] || [];
      const summary = calculateDailySummary(dayEntries, targetCalories);

      return {
        date: format(day, 'MM/dd'),
        calories: summary.totalCalories,
        carbs: summary.totalCarbs,
        protein: summary.totalProtein,
        fat: summary.totalFat,
        goal: targetCalories
      };
    });
  }, [entries, period, selectedDate, targetCalories]);

  const nutritionDistribution = useMemo(() => {
    const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0);
    const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0);
    const totalFat = entries.reduce((sum, e) => sum + e.fat, 0);

    return [
      { name: '탄수화물', value: totalCarbs, color: '#8884d8' },
      { name: '단백질', value: totalProtein, color: '#82ca9d' },
      { name: '지방', value: totalFat, color: '#ffc658' }
    ];
  }, [entries]);

  const averageCalories = useMemo(() => {
    if (chartData.length === 0) return 0;
    const total = chartData.reduce((sum, day) => sum + day.calories, 0);
    return Math.round(total / chartData.length);
  }, [chartData]);

  return (
    <div className="statistics">
      <div className="stats-header">
        <h3>
          <TrendingUp size={24} />
          통계
        </h3>
        <div className="period-selector">
          <button
            className={period === 'daily' ? 'active' : ''}
            onClick={() => setPeriod('daily')}
          >
            일간
          </button>
          <button
            className={period === 'weekly' ? 'active' : ''}
            onClick={() => setPeriod('weekly')}
          >
            주간
          </button>
          <button
            className={period === 'monthly' ? 'active' : ''}
            onClick={() => setPeriod('monthly')}
          >
            월간
          </button>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-label">평균 칼로리</span>
          <span className="stat-value">{averageCalories} kcal</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">총 기록</span>
          <span className="stat-value">{entries.length}개</span>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h4>칼로리 추이</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#8884d8" name="칼로리" />
              <Line type="monotone" dataKey="goal" stroke="#ff7c7c" strokeDasharray="5 5" name="목표" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h4>영양소 구성</h4>
          <div className="chart-row">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={nutritionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nutritionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="50%" height={250}>
              <BarChart data={chartData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="carbs" fill="#8884d8" name="탄수화물" />
                <Bar dataKey="protein" fill="#82ca9d" name="단백질" />
                <Bar dataKey="fat" fill="#ffc658" name="지방" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;