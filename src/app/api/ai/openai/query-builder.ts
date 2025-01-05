import { createClient } from "@/utils/supabase/server";
import {
  BUDGET,
  WORKOUT,
  JOURNAL,
  NUTRITION,
  HABITS,
  TODOS,
} from "@/lib/db/schema";

// Type-safe field definitions
type HabitStatsField = (typeof HABITS.COMMON_FIELDS.statsFields)[number];
type NutritionField = (typeof NUTRITION.COMMON_FIELDS.nutritionFields)[number];

interface QueryFilter {
  field: string;
  operator: "eq" | "gt" | "lt" | "gte" | "lte" | "between" | "like";
  value: string | number; // Allow both string and number values
}

// Create a union type of all possible table names
type TableName =
  | keyof typeof BUDGET.TABLES
  | keyof typeof WORKOUT.TABLES
  | keyof typeof NUTRITION.TABLES
  | keyof typeof HABITS.TABLES
  | keyof typeof TODOS.TABLES
  | keyof typeof JOURNAL.TABLES;

// Extended interface to handle all module-specific queries
interface QueryArgs {
  table: TableName; // Now table must be one of the valid table names
  select: string;
  filters?: QueryFilter[];
  // Module specific filters
  timeRange?: {
    start_date: string;
    end_date: string;
  };
  statsFilter?: {
    field: HabitStatsField;
    min: number;
    max: number;
  };
  nutritionRange?: {
    field: NutritionField;
    min: number;
    max: number;
  };
  completionStatus?: "completed" | "pending" | "all";
  dueDateRange?: {
    start: string;
    end: string;
  };
}

// Helper function to get the correct user ID field for a table
export function getUserIdField(table: TableName): string {
  // Special case for WORKOUT tables since it has a different structure
  if (table in WORKOUT.TABLES) {
    // Check if the table has a specific userIdField
    if (table in WORKOUT.COMMON_FIELDS.userIdFields) {
      return WORKOUT.COMMON_FIELDS.userIdFields[
        table as keyof typeof WORKOUT.COMMON_FIELDS.userIdFields
      ];
    }
    return "user_id"; // Default if not found
  }

  // For other modules
  const modules = [BUDGET, JOURNAL, NUTRITION, HABITS, TODOS];
  for (const module of modules) {
    if (Object.values(module.TABLES).includes(table as any)) {
      return module.COMMON_FIELDS.userIdField;
    }
  }

  return "user_id"; // default
}

// Helper function to validate table fields
function validateTableField(table: string, field: string): boolean {
  for (const module of [BUDGET, WORKOUT, JOURNAL, NUTRITION, HABITS, TODOS]) {
    if (table in module.TABLES) {
      const columns = module.COLUMNS[table as keyof typeof module.COLUMNS];
      return field in columns;
    }
  }
  return false;
}

// Main query builder function
export async function executeQuery(args: QueryArgs, userId: string) {
  const supabase = await createClient();

  // Validate table exists
  const allTables = [
    ...Object.values(BUDGET.TABLES),
    ...Object.values(WORKOUT.TABLES),
    ...Object.values(JOURNAL.TABLES),
    ...Object.values(NUTRITION.TABLES),
    ...Object.values(HABITS.TABLES),
    ...Object.values(TODOS.TABLES),
  ] as const;

  if (!allTables.includes(args.table as any)) {
    throw new Error(`Invalid table: ${args.table}`);
  }

  // Default select to * if not specified
  const selectColumns = args.select || "*";

  let query = supabase.from(args.table).select(selectColumns);

  // Add user_id filter
  const userIdField = getUserIdField(args.table);
  query = query.eq(userIdField, userId);

  // Add time range if specified
  if (args.timeRange) {
    query = query
      .gte("created_at", args.timeRange.start_date)
      .lte("created_at", args.timeRange.end_date);
  }

  // Add other filters
  if (args.filters) {
    args.filters.forEach((filter) => {
      if (filter.field === userIdField) return; // Skip user_id filters

      switch (filter.operator) {
        case "eq":
          query = query.eq(filter.field, filter.value);
          break;
        case "gt":
          query = query.gt(filter.field, filter.value);
          break;
        // ... other operators
      }
    });
  }

  return await query;
}
