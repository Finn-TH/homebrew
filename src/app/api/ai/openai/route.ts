import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";
import { OPENAI_CONSTANTS, SYSTEM_PROMPTS } from "@/lib/ai/openai/openai";
import {
  BUDGET,
  WORKOUT,
  JOURNAL,
  NUTRITION,
  HABITS,
  TODOS,
} from "@/lib/db/schema";
import { executeQuery } from "./query-builder";

// Move client creation to route handler
function createOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Define database functions based on our schema - one for each module
const functions = [
  {
    name: "query_budget",
    description: "Query budget and financial data",
    parameters: {
      type: "object",
      properties: {
        table: {
          type: "string",
          enum: Object.values(BUDGET.TABLES),
          description: "Budget table to query",
        },
        select: {
          type: "string",
          description: "Columns to select (* for all)",
          default: "*",
        },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                enum: Object.keys(BUDGET.COLUMNS.budget_transactions),
              },
              operator: {
                type: "string",
                enum: ["eq", "gt", "lt", "gte", "lte", "between", "like"],
              },
              value: { type: "string" },
            },
          },
        },
      },
      required: ["table"],
    },
  },
  {
    name: "query_habits",
    description: "Query habit tracking and progress data",
    parameters: {
      type: "object",
      properties: {
        table: {
          type: "string",
          enum: Object.values(HABITS.TABLES),
          description: "The habits table to query",
        },
        select: {
          type: "string",
          description: "Columns to select (* for all)",
          default: "*",
        },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                enum: Object.keys(HABITS.COLUMNS.habits),
              },
              operator: {
                type: "string",
                enum: ["eq", "gt", "lt", "gte", "lte", "between", "like"],
              },
              value: { type: "string" },
            },
          },
        },
      },
      required: ["table"],
    },
  },
  {
    name: "query_nutrition",
    description: "Query nutrition meals and food items",
    parameters: {
      type: "object",
      properties: {
        table: {
          type: "string",
          enum: [
            NUTRITION.TABLES.MEALS,
            NUTRITION.TABLES.FOOD_ITEMS,
            NUTRITION.TABLES.COMMON_FOODS,
          ],
          description: "Nutrition table to query",
        },
        select: {
          type: "string",
          description: "Columns to select (* for all)",
          default: "*",
        },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                enum: [
                  ...Object.keys(NUTRITION.COLUMNS.nutrition_meals),
                  ...Object.keys(NUTRITION.COLUMNS.nutrition_food_items),
                  ...Object.keys(NUTRITION.COLUMNS.nutri_common_foods),
                ],
              },
              operator: {
                type: "string",
                enum: ["eq", "gt", "lt", "gte", "lte", "between", "like"],
              },
              value: { type: "string" },
            },
          },
        },
      },
      required: ["table"],
    },
  },
  {
    name: "query_workouts",
    description: "Query workout logs, exercises, and templates",
    parameters: {
      type: "object",
      properties: {
        table: {
          type: "string",
          enum: Object.values(WORKOUT.TABLES),
          description: "Workout table to query (logs, exercises, templates)",
        },
        select: {
          type: "string",
          description: "Columns to select (* for all)",
          default: "*",
        },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                enum: Object.keys(WORKOUT.COLUMNS.workout_logs),
              },
              operator: {
                type: "string",
                enum: ["eq", "gt", "lt", "gte", "lte", "between", "like"],
              },
              value: { type: "string" },
            },
          },
        },
      },
      required: ["table"],
    },
  },
  {
    name: "query_journal",
    description: "Query journal entries, moods, and activities",
    parameters: {
      type: "object",
      properties: {
        table: {
          type: "string",
          enum: Object.values(JOURNAL.TABLES),
          description: "Journal table to query (entries, moods, activities)",
        },
        select: {
          type: "string",
          description: "Columns to select (* for all)",
          default: "*",
        },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                enum: Object.keys(JOURNAL.COLUMNS.journal_entries),
              },
              operator: {
                type: "string",
                enum: ["eq", "gt", "lt", "gte", "lte", "between", "like"],
              },
              value: { type: "string" },
            },
          },
        },
      },
      required: ["table"],
    },
  },
  {
    name: "query_todos",
    description: "Query todo items and their status",
    parameters: {
      type: "object",
      properties: {
        table: {
          type: "string",
          enum: Object.values(TODOS.TABLES),
          description: "Todos table to query",
        },
        select: {
          type: "string",
          description: "Columns to select (* for all)",
          default: "*",
        },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                enum: Object.keys(TODOS.COLUMNS.todos),
              },
              operator: {
                type: "string",
                enum: ["eq", "gt", "lt", "gte", "lte", "between", "like"],
              },
              value: { type: "string" },
            },
          },
        },
      },
      required: ["table"],
    },
  },
];

const DATABASE_KEYWORDS = ["data", "database", "personal", "homebrew"];

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json();
    const openai = createOpenAIClient();
    const supabase = await createClient();

    // Get authenticated user first
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shouldQueryDatabase = DATABASE_KEYWORDS.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );

    // If no database keywords, use higher temperature for general responses
    if (!shouldQueryDatabase) {
      const directResponse = await openai.chat.completions.create({
        model: OPENAI_CONSTANTS.MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.DATA_ANALYSIS },
          ...conversationHistory,
          { role: "user", content: message },
        ],
        temperature: OPENAI_CONSTANTS.GENERAL.temperature,
        max_tokens: OPENAI_CONSTANTS.GENERAL.max_tokens,
      });

      return NextResponse.json({
        response: directResponse.choices[0].message.content,
        type: "GENERAL",
      });
    }

    // Database queries use low temperature for precision
    try {
      const functionResponse = await openai.chat.completions.create({
        model: OPENAI_CONSTANTS.MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.FUNCTION_SELECTION },
          ...conversationHistory,
          { role: "user", content: message },
        ],
        functions,
        function_call: "auto",
        temperature: OPENAI_CONSTANTS.DATABASE.temperature,
        max_tokens: OPENAI_CONSTANTS.DATABASE.max_tokens,
      });

      const functionCall = functionResponse.choices[0].message.function_call;
      if (!functionCall) {
        throw new Error("No function call received");
      }

      const args = JSON.parse(functionCall.arguments);
      const { data: queryData, error: queryError } = await executeQuery(
        args,
        user.id
      );

      if (queryError) throw queryError;

      const analysisResponse = await openai.chat.completions.create({
        model: OPENAI_CONSTANTS.MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.DATA_ANALYSIS },
          ...conversationHistory,
          {
            role: "assistant",
            content: `New data retrieved: ${JSON.stringify(queryData)}`,
          },
          { role: "user", content: message },
        ],
        temperature: OPENAI_CONSTANTS.DATABASE.temperature,
        max_tokens: OPENAI_CONSTANTS.DATABASE.max_tokens,
      });

      return NextResponse.json({
        response: analysisResponse.choices[0].message.content,
        data: queryData,
        type: "DATABASE",
      });
    } catch (dbError) {
      const fallbackResponse = await openai.chat.completions.create({
        model: OPENAI_CONSTANTS.MODEL,
        messages: [
          {
            role: "system",
            content:
              "First apologize for database error, then provide general advice.",
          },
          ...conversationHistory,
          { role: "user", content: message },
        ],
        temperature: OPENAI_CONSTANTS.GENERAL.temperature,
        max_tokens: OPENAI_CONSTANTS.GENERAL.max_tokens,
      });

      return NextResponse.json({
        response: `I apologize, I had trouble reading the database. Please try again later. In the meantime, here's some general advice: ${fallbackResponse.choices[0].message.content}`,
        type: "GENERAL",
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
