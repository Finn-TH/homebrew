import OpenAI from "openai";

type ChatCompletionCreateParams = OpenAI.ChatCompletionCreateParams;
type OpenAIConfig = Pick<
  ChatCompletionCreateParams,
  "temperature" | "max_tokens"
>;

// OpenAI Constants
export const OPENAI_CONSTANTS = {
  MODEL: "gpt-4o-mini-2024-07-18" as const,

  // Database operations - More precise, deterministic
  DATABASE: {
    temperature: 0,
    max_tokens: 8000,
  } satisfies OpenAIConfig,

  // General chat - More creative and conversational
  GENERAL: {
    temperature: 0.7,
    max_tokens: 3000,
  } satisfies OpenAIConfig,
} as const;

// First, let's define our conversation types
export type ConversationType = "NEW_QUERY" | "FOLLOWUP" | "GENERAL";

// System prompts
export const SYSTEM_PROMPTS = {
  // Initial prompt to determine conversation flow
  CONVERSATION_ROUTER: `You are HomeBrew, a personal AI assistant.
    Analyze the user's message and respond with one of these types:
    - NEW_QUERY: First time querying data
    - FOLLOWUP: Questions about previously shown data
    - GENERAL: General advice or questions not needing data

    Examples:
    "Show my spending" -> NEW_QUERY (always query first)
    "What do you think of my budget?" -> NEW_QUERY (needs fresh data)
    "Why is that amount so high?" -> FOLLOWUP (references shown data)
    "What do you think of my spending?" -> GENERAL (no data needed)
    "What are some good foods to eat healthy?" -> GENERAL (no data needed)
    "How do I build good habits?" -> GENERAL (no data needed)
    "Financial tips?" -> GENERAL (no data needed)
    "Good Journaling?" -> GENERAL (no data needed)
    Respond with valid JSON: {"type": "NEW_QUERY" | "FOLLOWUP" | "GENERAL"}`,

  // Stage 1: Select the right function to call
  FUNCTION_SELECTION: `You are HomeBrew, a data-focused AI assistant.
    ALWAYS query the database when users ask about their data.
    
    When users ask about spending/budget:
    - Use query_budget function
    - Select all relevant fields
    - Include recent transactions
    - Set appropriate time range (default: last 30 days)
    
    Example:
    User: "What do you think of my spending?"
    Action: ALWAYS query budget data to provide insights
    
    Never ask for data - query it immediately.
    Assume users want to see their data when they ask about it.`,

  // Stage 2: Format the data into a response
  DATA_ANALYSIS: `You are HomeBrew, analyzing data in context.
    Previous context will be provided if available.
    
    For NEW_QUERY or CONTEXT_SWITCH:
    Present fresh data in the appropriate format.
    
    For FOLLOWUP:
    Reference previous data and provide deeper insights.
    
    Always maintain conversation flow and reference relevant history.`,
} as const;

// Export the creation function
export function createOpenAIClient(apiKey: string) {
  return new OpenAI({
    apiKey,
  });
}
