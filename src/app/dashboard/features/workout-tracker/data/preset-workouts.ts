export type PresetExercise = {
  name: string;
  type: "strength" | "cardio";
  defaultSets?: number;
  defaultReps?: number;
  defaultDuration?: number; // in minutes
  category: string;
};

export type PresetWorkout = {
  id: string;
  name: string;
  description: string;
  category: "beginner" | "intermediate" | "advanced";
  exercises: PresetExercise[];
};

export const PRESET_WORKOUTS: Record<string, PresetWorkout> = {
  FULL_BODY: {
    id: "full-body",
    name: "Full Body",
    description: "Complete full body workout for beginners",
    category: "beginner",
    exercises: [
      {
        name: "Bench Press",
        type: "strength",
        defaultSets: 3,
        defaultReps: 10,
        category: "chest",
      },
      {
        name: "Squats",
        type: "strength",
        defaultSets: 3,
        defaultReps: 10,
        category: "legs",
      },
      {
        name: "Deadlifts",
        type: "strength",
        defaultSets: 3,
        defaultReps: 8,
        category: "back",
      },
      {
        name: "Treadmill",
        type: "cardio",
        defaultDuration: 30,
        category: "cardio",
      },
    ],
  },
  UPPER_BODY: {
    id: "upper-body",
    name: "Upper Body",
    description: "Focus on chest, shoulders, and arms",
    category: "beginner",
    exercises: [
      {
        name: "Bench Press",
        type: "strength",
        defaultSets: 3,
        defaultReps: 10,
        category: "chest",
      },
      {
        name: "Shoulder Press",
        type: "strength",
        defaultSets: 3,
        defaultReps: 10,
        category: "shoulders",
      },
      {
        name: "Tricep Extensions",
        type: "strength",
        defaultSets: 3,
        defaultReps: 12,
        category: "arms",
      },
    ],
  },
  LOWER_BODY: {
    id: "lower-body",
    name: "Lower Body",
    description: "Focus on legs and lower body strength",
    category: "beginner",
    exercises: [
      {
        name: "Squats",
        type: "strength",
        defaultSets: 3,
        defaultReps: 10,
        category: "legs",
      },
      {
        name: "Deadlifts",
        type: "strength",
        defaultSets: 3,
        defaultReps: 8,
        category: "legs",
      },
      {
        name: "Leg Press",
        type: "strength",
        defaultSets: 3,
        defaultReps: 12,
        category: "legs",
      },
      {
        name: "Calf Raises",
        type: "strength",
        defaultSets: 3,
        defaultReps: 15,
        category: "legs",
      },
      {
        name: "Lunges",
        type: "strength",
        defaultSets: 3,
        defaultReps: 10,
        category: "legs",
      },
    ],
  },
  CALISTHENICS: {
    id: "calisthenics",
    name: "Calisthenics",
    description: "Bodyweight exercises for strength and control",
    category: "beginner",
    exercises: [
      {
        name: "Push-Ups",
        type: "strength",
        defaultSets: 3,
        defaultReps: 12,
        category: "chest",
      },
      {
        name: "Pull-Ups",
        type: "strength",
        defaultSets: 3,
        defaultReps: 8,
        category: "back",
      },
      {
        name: "Dips",
        type: "strength",
        defaultSets: 3,
        defaultReps: 10,
        category: "chest",
      },
      {
        name: "Bodyweight Squats",
        type: "strength",
        defaultSets: 3,
        defaultReps: 15,
        category: "legs",
      },
      {
        name: "Plank",
        type: "strength",
        defaultDuration: 1, // 1 minute
        category: "core",
      },
      {
        name: "Mountain Climbers",
        type: "cardio",
        defaultDuration: 2, // 2 minutes
        category: "cardio",
      },
    ],
  },
  PUSH: {
    id: "push",
    name: "Push Day",
    description: "Focus on pushing movements (chest, shoulders, triceps)",
    category: "intermediate",
    exercises: [
      {
        name: "Bench Press",
        type: "strength",
        defaultSets: 4,
        defaultReps: 8,
        category: "chest",
      },
      {
        name: "Overhead Press",
        type: "strength",
        defaultSets: 4,
        defaultReps: 8,
        category: "shoulders",
      },
      {
        name: "Incline Dumbbell Press",
        type: "strength",
        defaultSets: 3,
        defaultReps: 10,
        category: "chest",
      },
      {
        name: "Lateral Raises",
        type: "strength",
        defaultSets: 3,
        defaultReps: 12,
        category: "shoulders",
      },
      {
        name: "Tricep Pushdowns",
        type: "strength",
        defaultSets: 3,
        defaultReps: 12,
        category: "arms",
      },
    ],
  },
  PULL: {
    id: "pull",
    name: "Pull Day",
    description: "Focus on pulling movements (back, biceps)",
    category: "intermediate",
    exercises: [
      {
        name: "Barbell Rows",
        type: "strength",
        defaultSets: 4,
        defaultReps: 8,
        category: "back",
      },
      {
        name: "Pull-Ups",
        type: "strength",
        defaultSets: 4,
        defaultReps: 8,
        category: "back",
      },
      {
        name: "Face Pulls",
        type: "strength",
        defaultSets: 3,
        defaultReps: 12,
        category: "shoulders",
      },
      {
        name: "Barbell Curls",
        type: "strength",
        defaultSets: 3,
        defaultReps: 10,
        category: "arms",
      },
      {
        name: "Hammer Curls",
        type: "strength",
        defaultSets: 3,
        defaultReps: 12,
        category: "arms",
      },
    ],
  },
  LEGS: {
    id: "legs",
    name: "Leg Day",
    description: "Comprehensive leg workout (quads, hamstrings, calves)",
    category: "intermediate",
    exercises: [
      {
        name: "Squats",
        type: "strength",
        defaultSets: 4,
        defaultReps: 8,
        category: "legs",
      },
      {
        name: "Romanian Deadlifts",
        type: "strength",
        defaultSets: 4,
        defaultReps: 8,
        category: "legs",
      },
      {
        name: "Leg Press",
        type: "strength",
        defaultSets: 3,
        defaultReps: 12,
        category: "legs",
      },
      {
        name: "Leg Extensions",
        type: "strength",
        defaultSets: 3,
        defaultReps: 15,
        category: "legs",
      },
      {
        name: "Calf Raises",
        type: "strength",
        defaultSets: 4,
        defaultReps: 15,
        category: "legs",
      },
    ],
  },
  CARDIO: {
    id: "cardio",
    name: "Cardio Session",
    description:
      "Mix of high and low intensity cardio for heart health and endurance",
    category: "beginner",
    exercises: [
      {
        name: "Treadmill",
        type: "cardio",
        defaultDuration: 20, // 20 minutes
        category: "cardio",
      },
      {
        name: "Jump Rope",
        type: "cardio",
        defaultDuration: 10, // 10 minutes
        category: "cardio",
      },
      {
        name: "Cycling",
        type: "cardio",
        defaultDuration: 15, // 15 minutes
        category: "cardio",
      },
      {
        name: "Rowing",
        type: "cardio",
        defaultDuration: 10, // 10 minutes
        category: "cardio",
      },
      {
        name: "High Knees",
        type: "cardio",
        defaultDuration: 5, // 5 minutes
        category: "cardio",
      },
    ],
  },
  HIIT: {
    id: "hiit",
    name: "HIIT Workout",
    description: "High-Intensity Interval Training for maximum calorie burn",
    category: "intermediate",
    exercises: [
      {
        name: "Burpees",
        type: "cardio",
        defaultSets: 4,
        defaultReps: 10,
        category: "cardio",
      },
      {
        name: "Mountain Climbers",
        type: "cardio",
        defaultDuration: 1, // 1 minute
        category: "cardio",
      },
      {
        name: "Jump Squats",
        type: "cardio",
        defaultSets: 4,
        defaultReps: 15,
        category: "cardio",
      },
      {
        name: "Jumping Jacks",
        type: "cardio",
        defaultDuration: 2, // 2 minutes
        category: "cardio",
      },
      {
        name: "Sprint Intervals",
        type: "cardio",
        defaultSets: 5,
        defaultDuration: 1, // 1 minute sprints
        category: "cardio",
      },
    ],
  },
};

export const getPresetWorkout = (id: string): PresetWorkout | undefined => {
  return PRESET_WORKOUTS[id];
};

export const getAllPresetWorkouts = (): PresetWorkout[] => {
  return Object.values(PRESET_WORKOUTS);
};
