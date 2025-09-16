import React, { useState } from 'react';
import { Target, Save } from 'lucide-react';
import { DailyGoal } from '../types';
import { saveDailyGoal } from '../utils/storage';

interface GoalSettingProps {
  currentGoal: DailyGoal;
  onGoalUpdate: () => void;
}

const GoalSetting: React.FC<GoalSettingProps> = ({ currentGoal, onGoalUpdate }) => {
  const [targetCalories, setTargetCalories] = useState(currentGoal.targetCalories);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    saveDailyGoal({ targetCalories });
    onGoalUpdate();
    setIsEditing(false);
  };

  const presetGoals = [
    { label: '다이어트', value: 1500 },
    { label: '체중 유지', value: 2000 },
    { label: '근육 증가', value: 2500 },
    { label: '고강도 운동', value: 3000 }
  ];

  return (
    <div className="goal-setting">
      <div className="goal-header">
        <h3>
          <Target size={20} />
          일일 목표 설정
        </h3>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            수정
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="goal-form">
          <div className="form-group">
            <label>목표 칼로리 (kcal)</label>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              min="500"
              max="5000"
              step="50"
            />
          </div>

          <div className="preset-buttons">
            {presetGoals.map(preset => (
              <button
                key={preset.label}
                onClick={() => setTargetCalories(preset.value)}
                className="preset-button"
              >
                {preset.label}
                <span>{preset.value} kcal</span>
              </button>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={handleSave} className="save-button">
              <Save size={16} />
              저장
            </button>
            <button onClick={() => {
              setTargetCalories(currentGoal.targetCalories);
              setIsEditing(false);
            }} className="cancel-button">
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="goal-display">
          <div className="goal-value">
            <span className="value">{currentGoal.targetCalories}</span>
            <span className="unit">kcal</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalSetting;