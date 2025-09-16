import { FoodEntry, DailyGoal } from '../types';

const FOOD_ENTRIES_KEY = 'calorie_tracker_entries';
const DAILY_GOAL_KEY = 'calorie_tracker_goal';

export const getFoodEntries = (): FoodEntry[] => {
  const data = localStorage.getItem(FOOD_ENTRIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFoodEntries = (entries: FoodEntry[]) => {
  localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(entries));
};

export const addFoodEntry = (entry: FoodEntry) => {
  const entries = getFoodEntries();
  entries.push(entry);
  saveFoodEntries(entries);
};

export const updateFoodEntry = (id: string, updatedEntry: Partial<FoodEntry>) => {
  const entries = getFoodEntries();
  const index = entries.findIndex(e => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updatedEntry };
    saveFoodEntries(entries);
  }
};

export const deleteFoodEntry = (id: string) => {
  const entries = getFoodEntries();
  const filtered = entries.filter(e => e.id !== id);
  saveFoodEntries(filtered);
};

export const getDailyGoal = (): DailyGoal => {
  const data = localStorage.getItem(DAILY_GOAL_KEY);
  return data ? JSON.parse(data) : { targetCalories: 2000 };
};

export const saveDailyGoal = (goal: DailyGoal) => {
  localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(goal));
};