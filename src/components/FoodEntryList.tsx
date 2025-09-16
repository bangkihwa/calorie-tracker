import React from 'react';
import { Trash2, Clock, Users } from 'lucide-react';
import { FoodEntry } from '../types';
import { deleteFoodEntry } from '../utils/storage';
import { format } from 'date-fns';

interface FoodEntryListProps {
  entries: FoodEntry[];
  onEntryDeleted: () => void;
}

const FoodEntryList: React.FC<FoodEntryListProps> = ({ entries, onEntryDeleted }) => {
  const handleDelete = (id: string) => {
    if (window.confirm('이 기록을 삭제하시겠습니까?')) {
      deleteFoodEntry(id);
      onEntryDeleted();
    }
  };

  const groupedEntries = entries.reduce((groups, entry) => {
    const date = format(new Date(entry.date), 'yyyy년 MM월 dd일');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <p>아직 기록된 음식이 없습니다.</p>
        <p>위의 폼을 사용해 음식을 기록해보세요!</p>
      </div>
    );
  }

  return (
    <div className="food-entry-list">
      <h3>음식 기록</h3>
      {Object.entries(groupedEntries)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, dateEntries]) => (
          <div key={date} className="date-group">
            <h4 className="date-header">{date}</h4>
            {dateEntries
              .sort((a, b) => b.time.localeCompare(a.time))
              .map(entry => (
                <div key={entry.id} className="food-entry-card">
                  {entry.imageUrl && (
                    <div className="entry-image">
                      <img src={entry.imageUrl} alt={entry.foodName} />
                    </div>
                  )}
                  <div className="entry-content">
                    <div className="entry-header">
                      <h5>{entry.foodName}</h5>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="delete-button"
                        aria-label="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="entry-info">
                      <span className="time">
                        <Clock size={14} />
                        {entry.time}
                      </span>
                      <span className="servings">
                        <Users size={14} />
                        {entry.servings}인분
                      </span>
                    </div>
                    <div className="entry-nutrition">
                      <span className="calories">{entry.calories} kcal</span>
                      <span>탄 {entry.carbs}g</span>
                      <span>단 {entry.protein}g</span>
                      <span>지 {entry.fat}g</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default FoodEntryList;