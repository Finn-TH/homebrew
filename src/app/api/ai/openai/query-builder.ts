import { createClient } from "@/utils/supabase/server";
import { BUDGET, WORKOUT, NUTRITION, HABITS, TODOS } from "@/lib/db/schema";

type ModuleType =
  | typeof BUDGET
  | typeof WORKOUT
  | typeof NUTRITION
  | typeof HABITS
  | typeof TODOS;

// Define the column schema type based on our schema structure
interface ColumnDefinition {
  type: string;
  required: boolean;
}

type TableSchema = Record<string, ColumnDefinition>;

interface QueryFilter {
  field: string;
  operator: "eq" | "gt" | "lt" | "gte" | "lte" | "between" | "like";
  value: string | number | boolean;
}

interface QueryArgs {
  table: string;
  select?: string;
  filters?: QueryFilter[];
}

// Type-safe module mapping
const MODULE_MAP: Record<string, ModuleType> = {
  budget_transactions: BUDGET,
  budget_categories: BUDGET,
  nutrition_meals: NUTRITION,
  nutrition_food_items: NUTRITION,
  workout_logs: WORKOUT,
  workout_exercises: WORKOUT,
  habits: HABITS,
  habit_records: HABITS,
  todos: TODOS,
};

// Helper function to get the correct user ID field for a table
function getUserIdField(table: string): string {
  // Special case for WORKOUT tables
  if (Object.values(WORKOUT.TABLES).includes(table as any)) {
    const workoutField =
      WORKOUT.COMMON_FIELDS.userIdFields[
        table as keyof typeof WORKOUT.COMMON_FIELDS.userIdFields
      ];
    return workoutField || "user_id";
  }

  // For other modules
  const module = MODULE_MAP[table];
  if (!module || !("COMMON_FIELDS" in module)) {
    throw new Error(`Invalid table: ${table}`);
  }

  return "userIdField" in module.COMMON_FIELDS
    ? module.COMMON_FIELDS.userIdField
    : "user_id";
}

// Update the getColumnSchema helper with proper typing
function getColumnSchema(table: string, module: ModuleType): TableSchema {
  const columns = module.COLUMNS[table as keyof typeof module.COLUMNS];
  if (!columns) {
    throw new Error(`No schema found for table: ${table}`);
  }
  return columns as TableSchema;
}

export async function executeQuery(args: QueryArgs, userId: string) {
  const supabase = await createClient();

  // 1. Validate table exists and get correct module
  const module = MODULE_MAP[args.table];
  if (!module) {
    throw new Error(`Invalid table: ${args.table}`);
  }

  // 2. Get table schema with proper typing
  const tableSchema = getColumnSchema(args.table, module);

  // 3. Validate columns if specific ones are requested
  if (args.select && args.select !== "*") {
    const requestedColumns = args.select
      .split(",")
      .map((col: string) => col.trim());
    const validColumns = Object.keys(tableSchema);

    const invalidColumns = requestedColumns.filter(
      (col: string) => !validColumns.includes(col)
    );
    if (invalidColumns.length > 0) {
      throw new Error(
        `Invalid columns for ${args.table}: ${invalidColumns.join(", ")}`
      );
    }
  }

  // 4. Build base query
  let query = supabase.from(args.table).select(args.select || "*");

  // 5. Add user_id filter using the helper function
  const userIdField = getUserIdField(args.table);
  query = query.eq(userIdField, userId);

  // 6. Apply additional filters with validation
  if (args.filters) {
    args.filters.forEach((filter: QueryFilter) => {
      // Skip user_id filters for security
      if (filter.field === userIdField) return;

      // Validate field exists in schema with proper typing
      const columnDef = tableSchema[filter.field];
      if (!columnDef) {
        throw new Error(`Invalid field for ${args.table}: ${filter.field}`);
      }

      // Now TypeScript knows columnDef has a type property
      const value = validateFieldValue(filter.value, columnDef.type);

      // Apply filter
      switch (filter.operator) {
        case "eq":
          query = query.eq(filter.field, value);
          break;
        case "gt":
          query = query.gt(filter.field, value);
          break;
        case "lt":
          query = query.lt(filter.field, value);
          break;
        // ... other operators
      }
    });
  }

  const { data, error } = await query;
  if (error) {
    console.error("Query error:", error);
    throw new Error(`Database query failed: ${error.message}`);
  }

  return { data, error };
}

// Helper to validate field values against schema types
function validateFieldValue(value: unknown, schemaType: string): any {
  switch (schemaType) {
    case "uuid":
      if (
        typeof value !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
          value
        )
      ) {
        throw new Error(`Invalid UUID format: ${value}`);
      }
      return value;
    case "numeric":
    case "double precision":
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Invalid number format: ${value}`);
      }
      return num;
    case "date":
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`Invalid date format: ${value}`);
      }
      return value;
    default:
      return value;
  }
}
