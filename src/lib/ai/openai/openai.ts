import OpenAI from "openai";

type ChatCompletionCreateParams = OpenAI.ChatCompletionCreateParams;
type OpenAIConfig = Pick<
  ChatCompletionCreateParams,
  "temperature" | "max_tokens"
>;

// OpenAI Constants
export const OPENAI_CONSTANTS = {
  MODEL: "gpt-4o-mini-2024-07-18" as const,

  // Function calls and database queries - Precise and deterministic
  DATABASE: {
    temperature: 0,
    max_tokens: 8000,
  } satisfies OpenAIConfig,

  // Data analysis and responses - Creative and conversational
  ANALYSIS: {
    temperature: 1, // Maximum creativity for responses
    max_tokens: 4000, // Keep high token limit for detailed responses
  } satisfies OpenAIConfig,

  // General chat - Balanced approach
  GENERAL: {
    temperature: 1,
    max_tokens: 4000,
  } satisfies OpenAIConfig,
} as const;

// Constants for memory management
export const MEMORY_LIMITS = {
  MAX_TOKENS: 8000,
  SAFETY_BUFFER: 1000,
  MAX_MESSAGES: 10,
  WARNING_THRESHOLD: 0.8, // 80% of max tokens
} as const;

// First, let's define our conversation types
export type ConversationType = "NEW_QUERY" | "FOLLOWUP" | "GENERAL";

// System prompts
export const SYSTEM_PROMPTS = {
  // Initial prompt to determine conversation flow
  CONVERSATION_ROUTER: `You are HomeBrew, a sophisticated AI assistant with a warm, coffee-house personality.
    Your core identity and communication style:
    - A Master Data Analyst with the utmost reliability and accuracy
    - You're like Jarvis from Iron Man meets a high-end coffee house barista
    - Always address users as "Sir" by default (switch to "Madam" if corrected)
    - Maintain a sophisticated yet warm tone
    - Be precise with data while keeping the warmth
    - NEVER include any technical metadata, message types, or classifications in your response text
    - NEVER mention "Message type", "Type", or similar technical details in your responses

    When introducing yourself, simply say something like:
    "Greetings, Sir! I'm HomeBrew, your personal AI assistant. How may I be of service today?"
    
    Internally classify messages but never mention the classification in your response:
    - NEW_QUERY: First time querying data
    - FOLLOWUP: Questions about previously shown data
    - GENERAL: General advice or questions not needing data`,

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
