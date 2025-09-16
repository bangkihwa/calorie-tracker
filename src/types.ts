export interface FoodEntry {
  id: string;
  date: string;
  time: string;
  imageUrl?: string;
  foodName: string;
  servings: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface DailyGoal {
  targetCalories: number;
}

export interface NutritionSummary {
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  goalProgress: number;
}