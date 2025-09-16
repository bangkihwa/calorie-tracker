import React, { useState, useEffect } from 'react';
import { Utensils, BarChart3, Calendar as CalendarIcon, Heart } from 'lucide-react';
import FoodEntryForm from './components/FoodEntryForm';
import FoodEntryList from './components/FoodEntryList';
import DailySummary from './components/DailySummary';
import Statistics from './components/Statistics';
import CalendarView from './components/CalendarView';
import GoalSetting from './components/GoalSetting';
import { getFoodEntries, getDailyGoal } from './utils/storage';
import { filterEntriesByDate, calculateDailySummary } from './utils/calculations';
import './App.css';

type TabType = 'entry' | 'stats' | 'calendar';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('entry');
  const [entries, setEntries] = useState(getFoodEntries());
  const [goal, setGoal] = useState(getDailyGoal());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const refreshData = () => {
    setEntries(getFoodEntries());
    setGoal(getDailyGoal());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const todayEntries = filterEntriesByDate(entries, selectedDate);
  const todaySummary = calculateDailySummary(todayEntries, goal.targetCalories);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setActiveTab('entry');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <Utensils size={28} />
            칼로리 트래커
          </h1>
          <p>사진으로 간편하게 식사를 기록하고 건강을 관리하세요</p>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={activeTab === 'entry' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('entry')}
        >
          <Utensils size={20} />
          음식 기록
        </button>
        <button
          className={activeTab === 'stats' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={20} />
          통계
        </button>
        <button
          className={activeTab === 'calendar' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarIcon size={20} />
          달력
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'entry' && (
          <div className="entry-view">
            <div className="left-panel">
              <GoalSetting currentGoal={goal} onGoalUpdate={refreshData} />
              <DailySummary summary={todaySummary} goal={goal} />
              <FoodEntryForm onEntryAdded={refreshData} />
            </div>
            <div className="right-panel">
              <FoodEntryList entries={todayEntries} onEntryDeleted={refreshData} />
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <Statistics entries={entries} targetCalories={goal.targetCalories} />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            entries={entries}
            targetCalories={goal.targetCalories}
            onDateSelect={handleDateSelect}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <Heart size={16} className="heart-icon" />
            Developed by <span className="developer-name">개복구</span>
          </p>
          <p className="footer-subtitle">AI 기반 스마트 칼로리 트래커</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
