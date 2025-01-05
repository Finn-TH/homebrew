import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  createOpenAIClient,
  OPENAI_CONSTANTS,
  SYSTEM_PROMPTS,
  ConversationType,
} from "@/lib/ai/openai/openai";
import {
  BUDGET,
  WORKOUT,
  JOURNAL,
  NUTRITION,
  HABITS,
  TODOS,
} from "@/lib/db/schema";
import { executeQuery } from "./query-builder";

// Define database functions based on our schema - one for each module
const functions = [
  {
    name: "query_budget",
    description: "Query budget transactions and categories",
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
    name: "query_nutrition",
    description: "Query nutrition meals and food items",
    parameters: {
      type: "object",
      properties: {
        table: {
          type: "string",
          enum: Object.values(NUTRITION.TABLES),
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
                enum: Object.keys(NUTRITION.COLUMNS.nutrition_meals),
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
  // Add similar definitions for WORKOUT, HABITS, TODOS, etc.
];

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json();
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const openai = createOpenAIClient(process.env.OPENAI_API_KEY!);

    // First, determine conversation type
    const routerResponse = await openai.chat.completions.create({
      model: OPENAI_CONSTANTS.MODEL,
      temperature: 0.3, // Lower temperature for more consistent routing
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.CONVERSATION_ROUTER,
        },
        ...conversationHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: message,
        },
      ],
    });

    const conversationType = JSON.parse(
      routerResponse.choices[0].message.content!
    ).type as ConversationType;

    // Handle based on conversation type
    if (conversationType === "FOLLOWUP") {
      // Use existing data from conversation history
      const analysisResponse = await openai.chat.completions.create({
        model: OPENAI_CONSTANTS.MODEL,
        temperature: OPENAI_CONSTANTS.TEMPERATURE,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.DATA_ANALYSIS },
          ...conversationHistory,
          { role: "user", content: message },
        ],
      });

      return NextResponse.json({
        response: analysisResponse.choices[0].message.content,
        type: "FOLLOWUP",
      });
    }

    // For NEW_QUERY or CONTEXT_SWITCH, fetch fresh data
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONSTANTS.MODEL,
      temperature: OPENAI_CONSTANTS.TEMPERATURE,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.FUNCTION_SELECTION },
        { role: "user", content: message },
      ],
      functions,
      function_call: "auto",
    });

    const functionCall = completion.choices[0].message.function_call;
    if (!functionCall) throw new Error("No function call received");

    // Execute query
    const args = JSON.parse(functionCall.arguments);
    if (!args.filters) args.filters = [];
    args.filters.push({ field: "user_id", operator: "eq", value: user.id });

    const { data: queryData, error: queryError } = await executeQuery(
      args,
      user.id
    );
    if (queryError) throw queryError;

    // Analysis with context
    const analysisResponse = await openai.chat.completions.create({
      model: OPENAI_CONSTANTS.MODEL,
      temperature: OPENAI_CONSTANTS.TEMPERATURE,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.DATA_ANALYSIS },
        ...conversationHistory,
        {
          role: "assistant",
          content: `New data retrieved: ${JSON.stringify(queryData)}`,
        },
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({
      response: analysisResponse.choices[0].message.content,
      data: queryData,
      type: conversationType,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
