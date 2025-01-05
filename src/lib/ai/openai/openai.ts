import OpenAI from "openai";

// OpenAI Constants
export const OPENAI_CONSTANTS = {
  MODEL: "gpt-4o-mini" as const,
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
} as const;

// First, let's define our conversation types
export type ConversationType = "NEW_QUERY" | "FOLLOWUP" | "CONTEXT_SWITCH";

// System prompts
export const SYSTEM_PROMPTS = {
  // Initial prompt to determine conversation flow
  CONVERSATION_ROUTER: `You are HomeBrew, a personal AI assistant.
    When users ask about their data, ALWAYS classify as NEW_QUERY first time.
    Only use FOLLOWUP for specific questions about data just shown.
    
    Examples:
    "Show my spending" -> NEW_QUERY (always query first)
    "What do you think of my budget?" -> NEW_QUERY (needs fresh data)
    "Why is that amount so high?" -> FOLLOWUP (references shown data)
    
    Return classification as: { "type": "NEW_QUERY" | "FOLLOWUP" | "CONTEXT_SWITCH" }`,

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
