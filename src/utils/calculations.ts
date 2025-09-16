import { FoodEntry, NutritionSummary } from '../types';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const calculateDailySummary = (entries: FoodEntry[], targetCalories: number): NutritionSummary => {
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalCarbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalFat = entries.reduce((sum, entry) => sum + entry.fat, 0);
  const goalProgress = targetCalories > 0 ? (totalCalories / targetCalories) * 100 : 0;

  return {
    totalCalories,
    totalCarbs,
    totalProtein,
    totalFat,
    goalProgress
  };
};

export const filterEntriesByDate = (entries: FoodEntry[], date: Date): FoodEntry[] => {
  const start = startOfDay(date);
  const end = endOfDay(date);

  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= start && entryDate <= end;
  });
};

export const filterEntriesByDateRange = (entries: FoodEntry[], startDate: Date, endDate: Date): FoodEntry[] => {
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= endDate;
  });
};

export const getWeeklyEntries = (entries: FoodEntry[], date: Date): FoodEntry[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return filterEntriesByDateRange(entries, start, end);
};

export const getMonthlyEntries = (entries: FoodEntry[], date: Date): FoodEntry[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return filterEntriesByDateRange(entries, start, end);
};

export const groupEntriesByDate = (entries: FoodEntry[]): Record<string, FoodEntry[]> => {
  return entries.reduce((groups, entry) => {
    const date = format(new Date(entry.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);
};

export const estimateNutritionFromImage = (foodName: string, servings: number): Partial<FoodEntry> => {
  const foodDatabase: Record<string, { calories: number; carbs: number; protein: number; fat: number }> = {
    '밥': { calories: 210, carbs: 48, protein: 4, fat: 0.5 },
    '김치': { calories: 15, carbs: 3, protein: 1, fat: 0.2 },
    '된장찌개': { calories: 120, carbs: 10, protein: 8, fat: 5 },
    '불고기': { calories: 250, carbs: 8, protein: 22, fat: 15 },
    '비빔밥': { calories: 490, carbs: 65, protein: 15, fat: 16 },
    '김밥': { calories: 320, carbs: 45, protein: 10, fat: 10 },
    '라면': { calories: 500, carbs: 65, protein: 10, fat: 20 },
    '치킨': { calories: 350, carbs: 20, protein: 25, fat: 20 },
    '피자': { calories: 280, carbs: 35, protein: 12, fat: 10 },
    '햄버거': { calories: 450, carbs: 40, protein: 20, fat: 22 },
    '샐러드': { calories: 150, carbs: 10, protein: 5, fat: 10 },
    '파스타': { calories: 380, carbs: 50, protein: 12, fat: 14 },
    '삼겹살': { calories: 330, carbs: 0, protein: 20, fat: 28 },
    '짜장면': { calories: 550, carbs: 75, protein: 15, fat: 20 },
    '짬뽕': { calories: 480, carbs: 60, protein: 18, fat: 15 }
  };

  const normalizedName = foodName.toLowerCase();
  let nutrition = foodDatabase['밥'];

  for (const [food, values] of Object.entries(foodDatabase)) {
    if (normalizedName.includes(food)) {
      nutrition = values;
      break;
    }
  }

  const adjustedCalories = Math.round(nutrition.calories * servings);
  const adjustedCarbs = Math.round(nutrition.carbs * servings);
  const adjustedProtein = Math.round(nutrition.protein * servings);
  const adjustedFat = Math.round(nutrition.fat * servings);

  return {
    calories: adjustedCalories,
    carbs: adjustedCarbs,
    protein: adjustedProtein,
    fat: adjustedFat
  };
};