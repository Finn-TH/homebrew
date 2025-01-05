import { createClient } from "@/utils/supabase/server";
import {
  BUDGET,
  WORKOUT,
  NUTRITION,
  HABITS,
  TODOS,
  JOURNAL,
} from "@/lib/db/schema";

// Define ModuleType
type ModuleType =
  | typeof BUDGET
  | typeof WORKOUT
  | typeof NUTRITION
  | typeof HABITS
  | typeof TODOS
  | typeof JOURNAL;

// Define TableSchema type based on column definitions
type TableSchema = Record<
  string,
  {
    type: string;
    required: boolean;
  }
>;

// Strict type for all possible tables
type TableName =
  | keyof typeof BUDGET.TABLES
  | keyof typeof WORKOUT.TABLES
  | keyof typeof NUTRITION.TABLES
  | keyof typeof HABITS.TABLES
  | keyof typeof TODOS.TABLES
  | keyof typeof JOURNAL.TABLES;

interface QueryFilter {
  field: string;
  operator: "eq" | "gt" | "lt" | "gte" | "lte" | "between" | "like";
  value: string | number | boolean;
}

interface QueryArgs {
  table: TableName;
  select?: string;
  filters?: QueryFilter[];
}

// Type-safe module mapping
const MODULE_MAP: Record<string, ModuleType> = {
  // Budget Tables
  [BUDGET.TABLES.CATEGORIES]: BUDGET,
  [BUDGET.TABLES.SAVINGS_GOALS]: BUDGET,
  [BUDGET.TABLES.TRANSACTIONS]: BUDGET,
  [BUDGET.TABLES.USER_SETTINGS]: BUDGET,

  // Workout Tables
  [WORKOUT.TABLES.EXERCISES]: WORKOUT,
  [WORKOUT.TABLES.LOGS]: WORKOUT,
  [WORKOUT.TABLES.LOG_EXERCISES]: WORKOUT,
  [WORKOUT.TABLES.TEMPLATES]: WORKOUT,
  [WORKOUT.TABLES.TEMPLATE_EXERCISES]: WORKOUT,

  // Nutrition Tables
  [NUTRITION.TABLES.MEALS]: NUTRITION,
  [NUTRITION.TABLES.FOOD_ITEMS]: NUTRITION,
  [NUTRITION.TABLES.COMMON_FOODS]: NUTRITION,

  // Habits Tables
  [HABITS.TABLES.HABITS]: HABITS,
  [HABITS.TABLES.RECORDS]: HABITS,

  // Todos Table
  [TODOS.TABLES.TODOS]: TODOS,

  // Journal Tables
  [JOURNAL.TABLES.ENTRIES]: JOURNAL,
  [JOURNAL.TABLES.ENTRY_ACTIVITIES]: JOURNAL,
} as const;

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

// Get column schema helper with proper typing
function getColumnSchema(table: string, module: ModuleType): TableSchema {
  const columns = module.COLUMNS[table as keyof typeof module.COLUMNS];
  if (!columns) {
    throw new Error(`No schema found for table: ${table}`);
  }
  return columns;
}

export async function executeQuery(args: QueryArgs, userId: string) {
  try {
    const supabase = await createClient();

    // 1. Debug log the incoming request
    console.log("Query Args:", {
      table: args.table,
      select: args.select,
      filters: args.filters,
      userId,
    });

    // 2. Validate table exists in schema
    const module = MODULE_MAP[args.table];
    if (!module) {
      throw new Error(`Invalid table: ${args.table}`);
    }

    // 3. Get and validate schema with detailed logging
    const tableSchema = getColumnSchema(args.table, module);
    console.log("Table Schema:", tableSchema);

    // 4. Get and validate user ID field
    const userIdField = getUserIdField(args.table);
    console.log("User ID Field:", userIdField);

    // 5. Build base query with explicit error handling
    let query = supabase.from(args.table).select(args.select || "*");

    // 6. Add user ID filter with validation
    if (!tableSchema[userIdField]) {
      console.error(
        `Missing user ID field "${userIdField}" in table "${args.table}"`
      );
      throw new Error(`Table schema validation failed for ${args.table}`);
    }
    query = query.eq(userIdField, userId);

    // 7. Apply additional filters with validation
    if (args.filters) {
      args.filters.forEach((filter) => {
        // Skip user_id filters for security
        if (filter.field === userIdField) return;

        // Validate field exists in schema
        const columnDef = tableSchema[filter.field];
        if (!columnDef) {
          throw new Error(
            `Invalid field ${filter.field} for table ${args.table}`
          );
        }

        const value = validateFieldValue(filter.value, columnDef.type);

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
          case "gte":
            query = query.gte(filter.field, value);
            break;
          case "lte":
            query = query.lte(filter.field, value);
            break;
          case "like":
            query = query.like(filter.field, `%${value}%`);
            break;
        }
      });
    }

    // 8. Execute query with error catching
    const { data, error } = await query;

    if (error) {
      console.error("Supabase Query Error:", error);
      throw error;
    }

    // 9. Validate response
    if (!data) {
      console.warn("No data returned for query:", args);
      return { data: [], error: null };
    }

    return { data, error: null };
  } catch (error) {
    // 10. Detailed error logging
    console.error("Query Builder Error:", {
      error,
      args,
      userId,
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
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
