export type Mood = "happy" | "calm" | "neutral" | "angry" | "anxious" | "sad";

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood: Mood | null;
  gratitude: string | null;
  created_at: string;
  updated_at: string;
  activities: string[];
}

export interface DailyMood {
  id: string;
  user_id: string;
  mood: Mood;
  created_at: string;
}

export const MOOD_EMOJIS: Record<Mood, string> = {
  happy: "😊",
  calm: "😌",
  neutral: "😐",
  angry: "😠",
  anxious: "😰",
  sad: "😢",
};
