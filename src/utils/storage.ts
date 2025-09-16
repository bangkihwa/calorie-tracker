import { FoodEntry, DailyGoal } from '../types';

const FOOD_ENTRIES_KEY = 'calorie_tracker_entries';
const DAILY_GOAL_KEY = 'calorie_tracker_goal';

// localStorage 사용 가능 여부 확인
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.error('LocalStorage is not available:', e);
    return false;
  }
};

// 메모리 스토리지 (localStorage 사용 불가 시 fallback)
let memoryStorage: { [key: string]: string } = {};

const getItem = (key: string): string | null => {
  if (isLocalStorageAvailable()) {
    return localStorage.getItem(key);
  }
  return memoryStorage[key] || null;
};

const setItem = (key: string, value: string): void => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  } catch (e) {
    console.error('Storage error:', e);
    memoryStorage[key] = value;
  }
};

export const getFoodEntries = (): FoodEntry[] => {
  try {
    const data = getItem(FOOD_ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error getting food entries:', e);
    return [];
  }
};

export const saveFoodEntries = (entries: FoodEntry[]) => {
  try {
    setItem(FOOD_ENTRIES_KEY, JSON.stringify(entries));
    console.log('Food entries saved:', entries.length);
  } catch (e) {
    console.error('Error saving food entries:', e);
  }
};

export const addFoodEntry = (entry: FoodEntry) => {
  try {
    const entries = getFoodEntries();
    entries.push(entry);
    saveFoodEntries(entries);
    console.log('Food entry added:', entry);
  } catch (e) {
    console.error('Error adding food entry:', e);
    alert('음식 기록 저장에 실패했습니다. 다시 시도해주세요.');
  }
};

export const updateFoodEntry = (id: string, updatedEntry: Partial<FoodEntry>) => {
  try {
    const entries = getFoodEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updatedEntry };
      saveFoodEntries(entries);
    }
  } catch (e) {
    console.error('Error updating food entry:', e);
  }
};

export const deleteFoodEntry = (id: string) => {
  try {
    const entries = getFoodEntries();
    const filtered = entries.filter(e => e.id !== id);
    saveFoodEntries(filtered);
  } catch (e) {
    console.error('Error deleting food entry:', e);
  }
};

export const getDailyGoal = (): DailyGoal => {
  try {
    const data = getItem(DAILY_GOAL_KEY);
    return data ? JSON.parse(data) : { targetCalories: 2000 };
  } catch (e) {
    console.error('Error getting daily goal:', e);
    return { targetCalories: 2000 };
  }
};

export const saveDailyGoal = (goal: DailyGoal) => {
  try {
    setItem(DAILY_GOAL_KEY, JSON.stringify(goal));
  } catch (e) {
    console.error('Error saving daily goal:', e);
  }
};