export interface NutritionMeal {
  id: string;
  user_id: string;
  name: string;
  date: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  created_at: string;
  nutrition_food_items: NutritionFoodItem[];
}

export interface NutritionFoodItem {
  id: string;
  meal_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: number;
  serving_unit: string;
  created_at: string;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
}
