import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { DEFAULT_CONFIG } from "@/lib/ai/gemini";

// Define table schemas and their relationships
interface DatabaseSchema {
  workout_logs: {
    id: string;
    user_id: string;
    date: string;
    notes: string;
    duration: number;
  };
  habit_records: {
    id: string;
    user_id: string;
    habit_id: string;
    completed: boolean;
    date: string;
  };
  journal_entries: {
    id: string;
    user_id: string;
    content: string;
    date: string;
  };
  // Add other table schemas as needed
}

// Type for the query plan from Gemini
interface QueryPlan {
  tables: (keyof DatabaseSchema)[];
  timeRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
  limit?: number;
}

export async function POST(req: Request) {
  let analysis;

  try {
    const { message } = await req.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: DEFAULT_CONFIG,
    });

    const analysisPrompt = `
      User Question: "${message}"
      
      Available Tables and their relationships:
      
      workout_logs:
        - Contains individual workout sessions
        - Fields: id, user_id, date, notes, duration
        - Related to: workout_log_exercises
      
      habit_records:
        - Contains daily habit completion records
        - Fields: id, user_id, habit_id, completed, date
        - Related to: habits table
      
      journal_entries:
        - Contains user's journal entries
        - Fields: id, user_id, content, date
        - Related to: journal_daily_moods
      
      Based on this question, what data should we fetch?
      Respond with ONLY a valid JSON object, no markdown formatting or backticks.
      If no date range is needed, omit the timeRange field completely.
      Format:
      {
        "tables": ["table_name"],
        "timeRange": {
          "start": "YYYY-MM-DD",
          "end": "YYYY-MM-DD"
        },
        "filters": {},
        "limit": number
      }
    `;

    analysis = await model.generateContent(analysisPrompt);

    // Clean the response before parsing
    const cleanResponse = analysis.response
      .text()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    console.log("Cleaned response:", cleanResponse);
    const queryPlan = JSON.parse(cleanResponse) as QueryPlan;

    // Type-safe data fetching
    const contextData: Partial<Record<keyof DatabaseSchema, any[]>> = {};

    for (const table of queryPlan.tables) {
      let query = supabase.from(table).select("*").eq("user_id", user.id);

      // Only apply date filters if timeRange has valid dates
      if (queryPlan.timeRange?.start && queryPlan.timeRange?.end) {
        query = query
          .gte("date", queryPlan.timeRange.start)
          .lte("date", queryPlan.timeRange.end);
      }

      if (queryPlan.limit && queryPlan.limit > 0) {
        query = query.limit(queryPlan.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Database error for ${table}:`, error);
        throw error;
      }

      contextData[table] = data || [];
    }

    // Second prompt to Gemini with the fetched data
    const responsePrompt = `
      User Question: "${message}"
      
      Available Data:
      ${JSON.stringify(contextData, null, 2)}
      
      Please provide a detailed, helpful answer based on this data.
      If no data is available, mention that.
    `;

    const result = await model.generateContent(responsePrompt);
    return NextResponse.json({ response: result.response.text() });
  } catch (error) {
    console.error("AI API Error:", error);
    if (error instanceof SyntaxError) {
      console.error("Raw response:", analysis?.response.text());
    }
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}
