// =============================================
// Budget Tables & Info
// =============================================

export const BUDGET = {
  // Table Names
  TABLES: {
    CATEGORIES: "budget_categories",
    SAVINGS_GOALS: "budget_savings_goals",
    TRANSACTIONS: "budget_transactions",
    USER_SETTINGS: "budget_user_settings",
  },

  // Column Definitions
  COLUMNS: {
    budget_categories: {
      id: { type: "uuid", required: true },
      user_id: { type: "uuid", required: true },
      name: { type: "text", required: true },
      type: { type: "text", required: true },
      monthly_limit: { type: "numeric", required: false },
      color: { type: "text", required: true },
      created_at: { type: "timestamp with time zone", required: true },
      updated_at: { type: "timestamp with time zone", required: true },
    },

    budget_savings_goals: {
      id: { type: "uuid", required: true },
      user_id: { type: "uuid", required: true },
      name: { type: "text", required: true },
      target_amount: { type: "numeric", required: true },
      current_amount: { type: "numeric", required: false },
      target_date: { type: "date", required: false },
      color: { type: "text", required: true },
      created_at: { type: "timestamp with time zone", required: true },
      updated_at: { type: "timestamp with time zone", required: true },
    },

    budget_transactions: {
      id: { type: "uuid", required: true },
      user_id: { type: "uuid", required: true },
      category_id: { type: "uuid", required: false },
      type: { type: "text", required: true },
      amount: { type: "numeric", required: true },
      description: { type: "text", required: false },
      date: { type: "date", required: true },
      is_recurring: { type: "boolean", required: false },
      recurring_frequency: { type: "text", required: false },
      is_savings_transaction: { type: "boolean", required: true },
      created_at: { type: "timestamp with time zone", required: true },
      updated_at: { type: "timestamp with time zone", required: true },
    },

    budget_user_settings: {
      user_id: { type: "uuid", required: true },
      monthly_budget: { type: "numeric", required: true },
      created_at: { type: "timestamp with time zone", required: true },
      updated_at: { type: "timestamp with time zone", required: true },
    },
  },

  // Common fields for queries
  COMMON_FIELDS: {
    userIdField: "user_id",
    dateFields: ["date", "created_at", "updated_at", "target_date"],
    timestampFields: ["created_at", "updated_at"],
  },
} as const;

// =============================================
// Workout Tables & Info
// =============================================

export const WORKOUT = {
  // Table Names
  TABLES: {
    EXERCISES: "exercises",
    LOGS: "workout_logs",
    LOG_EXERCISES: "workout_log_exercises",
    TEMPLATES: "workout_templates",
    TEMPLATE_EXERCISES: "workout_template_exercises",
  },

  // Column Definitions
  COLUMNS: {
    exercises: {
      id: { type: "uuid", required: true },
      name: { type: "text", required: true },
      type: { type: "text", required: true },
      category: { type: "text", required: true },
      created_at: { type: "timestamp with time zone", required: false },
    },

    workout_logs: {
      id: { type: "uuid", required: true },
      user_id: { type: "uuid", required: false },
      name: { type: "text", required: true },
      date: { type: "date", required: true },
      template_id: { type: "uuid", required: false },
      created_at: { type: "timestamp with time zone", required: false },
    },

    workout_log_exercises: {
      id: { type: "uuid", required: true },
      workout_id: { type: "uuid", required: false },
      exercise_id: { type: "uuid", required: false },
      name: { type: "text", required: true },
      type: { type: "text", required: true },
      sets: { type: "integer", required: false },
      reps: { type: "integer", required: false },
      weight: { type: "numeric", required: false },
      duration: { type: "integer", required: false },
      distance: { type: "numeric", required: false },
      created_at: { type: "timestamp with time zone", required: false },
    },

    workout_templates: {
      id: { type: "uuid", required: true },
      name: { type: "text", required: true },
      description: { type: "text", required: false },
      created_by_user_id: { type: "uuid", required: false },
      created_at: { type: "timestamp with time zone", required: false },
      is_user_template: { type: "boolean", required: false },
    },

    workout_template_exercises: {
      id: { type: "uuid", required: true },
      template_id: { type: "uuid", required: false },
      exercise_id: { type: "uuid", required: false },
      name: { type: "text", required: true },
      type: { type: "text", required: true },
      default_sets: { type: "integer", required: false },
      default_reps: { type: "integer", required: false },
      default_duration: { type: "integer", required: false },
      created_at: { type: "timestamp with time zone", required: false },
    },
  },

  // Common fields for queries
  COMMON_FIELDS: {
    userIdFields: {
      workout_logs: "user_id",
      workout_templates: "created_by_user_id",
    },
    dateFields: ["date", "created_at"],
    timestampFields: ["created_at"],
  },
} as const;

// =============================================
// Journal Tables & Info
// =============================================

export const JOURNAL = {
  // Table Names
  TABLES: {
    DAILY_MOODS: "journal_daily_moods",
    ENTRIES: "journal_entries",
    ENTRY_ACTIVITIES: "journal_entry_activities",
  },

  // Column Definitions
  COLUMNS: {
    journal_daily_moods: {
      id: { type: "uuid", required: true },
      user_id: { type: "uuid", required: true },
      mood: { type: "text", required: true },
      energy: { type: "integer", required: false },
      created_at: { type: "timestamp with time zone", required: true },
    },

    journal_entries: {
      id: { type: "uuid", required: true },
      user_id: { type: "uuid", required: true },
      title: { type: "text", required: false },
      content: { type: "text", required: true },
      mood: { type: "text", required: false },
      gratitude: { type: "text", required: false },
      activities: { type: "ARRAY", required: false },
      created_at: { type: "timestamp with time zone", required: true },
      updated_at: { type: "timestamp with time zone", required: true },
    },

    journal_entry_activities: {
      id: { type: "uuid", required: true },
      journal_entry_id: { type: "uuid", required: true },
      activity: { type: "text", required: true },
      created_at: { type: "timestamp with time zone", required: true },
    },
  },

  // Common fields for queries
  COMMON_FIELDS: {
    userIdField: "user_id",
    dateFields: ["created_at", "updated_at"],
    timestampFields: ["created_at", "updated_at"],
  },
} as const;

// =============================================
// Nutrition Tables & Info
// =============================================

export const NUTRITION = {
  // Table Names
  TABLES: {
    COMMON_FOODS: "nutri_common_foods",
    FOOD_ITEMS: "nutrition_food_items",
    MEALS: "nutrition_meals",
  },

  // Column Definitions
  COLUMNS: {
    nutri_common_foods: {
      id: { type: "uuid", required: true },
      name: { type: "text", required: true },
      brand: { type: "text", required: false },
      serving_size: { type: "numeric", required: true },
      serving_unit: { type: "text", required: true },
      calories: { type: "integer", required: true },
      protein: { type: "numeric", required: true },
      carbs: { type: "numeric", required: true },
      fat: { type: "numeric", required: true },
      verified: { type: "boolean", required: false },
      food_type: { type: "text", required: true },
      meal_category: { type: "text", required: true },
      created_at: { type: "timestamp with time zone", required: false },
      updated_at: { type: "timestamp with time zone", required: false },
    },

    nutrition_food_items: {
      id: { type: "uuid", required: true },
      meal_id: { type: "uuid", required: false },
      name: { type: "text", required: true },
      calories: { type: "integer", required: true },
      protein: { type: "double precision", required: false },
      carbs: { type: "double precision", required: false },
      fat: { type: "double precision", required: false },
      serving_size: { type: "double precision", required: false },
      serving_unit: { type: "text", required: false },
      created_at: { type: "timestamp with time zone", required: true },
    },

    nutrition_meals: {
      id: { type: "uuid", required: true },
      user_id: { type: "uuid", required: true },
      name: { type: "text", required: true },
      date: { type: "date", required: true },
      meal_type: { type: "text", required: true },
      created_at: { type: "timestamp with time zone", required: true },
    },
  },

  // Common fields for queries
  COMMON_FIELDS: {
    userIdField: "user_id",
    dateFields: ["date", "created_at", "updated_at"],
    timestampFields: ["created_at", "updated_at"],
    nutritionFields: ["calories", "protein", "carbs", "fat"],
  },
} as const;

// =============================================
// Habits Tables & Info
// =============================================

export const HABITS = {
  // Table Names
  TABLES: {
    HABITS: "habits",
    RECORDS: "habit_records",
  },

  // Column Definitions
  COLUMNS: {
    habits: {
      id: { type: "uuid", required: true },
      user_id: { type: "uuid", required: true },
      title: { type: "text", required: true },
      category: { type: "text", required: false },
      current_streak: { type: "integer", required: false },
      longest_streak: { type: "integer", required: false },
      total_completions: { type: "integer", required: false },
      created_at: { type: "timestamp with time zone", required: false },
    },

    habit_records: {
      id: { type: "uuid", required: true },
      habit_id: { type: "uuid", required: true },
      date: { type: "date", required: true },
      status: { type: "USER-DEFINED", required: true }, // Enum type
      created_at: { type: "timestamp with time zone", required: false },
    },
  },

  // Common fields for queries
  COMMON_FIELDS: {
    userIdField: "user_id",
    dateFields: ["date", "created_at"],
    timestampFields: ["created_at"],
    statsFields: ["current_streak", "longest_streak", "total_completions"],
  },
} as const;

// =============================================
// Todos Tables & Info
// =============================================

export const TODOS = {
  // Table Names
  TABLES: {
    TODOS: "todos",
  },

  // Column Definitions
  COLUMNS: {
    todos: {
      id: { type: "uuid", required: true },
      user_id: { type: "uuid", required: true },
      title: { type: "text", required: true },
      completed: { type: "boolean", required: false },
      priority: { type: "text", required: false },
      due_date: { type: "timestamp with time zone", required: false },
      recurrence: { type: "jsonb", required: false },
      created_at: { type: "timestamp with time zone", required: false },
    },
  },

  // Common fields for queries
  COMMON_FIELDS: {
    userIdField: "user_id",
    dateFields: ["due_date", "created_at"],
    timestampFields: ["created_at", "due_date"],
    statusField: "completed",
  },
} as const;
