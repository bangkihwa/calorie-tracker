import React from 'react';
import { Target, Zap, Wheat, Beef, Droplet } from 'lucide-react';
import { NutritionSummary, DailyGoal } from '../types';

interface DailySummaryProps {
  summary: NutritionSummary;
  goal: DailyGoal;
}

const DailySummary: React.FC<DailySummaryProps> = ({ summary, goal }) => {
  const getProgressColor = (progress: number) => {
    if (progress < 80) return '#4CAF50';
    if (progress < 100) return '#FFC107';
    return '#FF5252';
  };

  const progressColor = getProgressColor(summary.goalProgress);

  return (
    <div className="daily-summary">
      <h3>오늘의 요약</h3>

      <div className="goal-progress">
        <div className="goal-header">
          <Target size={20} />
          <span>일일 목표 달성률</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(summary.goalProgress, 100)}%`,
              backgroundColor: progressColor
            }}
          />
        </div>
        <div className="progress-text">
          <span>{summary.totalCalories} / {goal.targetCalories} kcal</span>
          <span>{summary.goalProgress.toFixed(1)}%</span>
        </div>
      </div>

      <div className="nutrition-grid">
        <div className="nutrition-card calories">
          <div className="icon">
            <Zap size={24} />
          </div>
          <div className="content">
            <span className="label">칼로리</span>
            <span className="value">{summary.totalCalories}</span>
            <span className="unit">kcal</span>
          </div>
        </div>

        <div className="nutrition-card carbs">
          <div className="icon">
            <Wheat size={24} />
          </div>
          <div className="content">
            <span className="label">탄수화물</span>
            <span className="value">{summary.totalCarbs}</span>
            <span className="unit">g</span>
          </div>
        </div>

        <div className="nutrition-card protein">
          <div className="icon">
            <Beef size={24} />
          </div>
          <div className="content">
            <span className="label">단백질</span>
            <span className="value">{summary.totalProtein}</span>
            <span className="unit">g</span>
          </div>
        </div>

        <div className="nutrition-card fat">
          <div className="icon">
            <Droplet size={24} />
          </div>
          <div className="content">
            <span className="label">지방</span>
            <span className="value">{summary.totalFat}</span>
            <span className="unit">g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;