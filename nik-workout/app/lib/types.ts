export type Exercise = {
    id: string;
    name: string;
    muscleGroup: string;
    description?: string;
};

export type WorkoutSet = {
    id: string;
    exerciseId: string;
    weight: number;
    reps: number;
    rpe?: number; // Rate of Perceived Exertion (1-10)
    completed: boolean;
    notes?: string;
};

export type Workout = {
    id: string;
    userId: string;
    name: string;
    date: string;
    notes?: string;
    sets: WorkoutSet[];
    duration?: number; // in minutes
    completed: boolean;
};

export type WorkoutPlan = {
    id: string;
    userId: string;
    name: string;
    description?: string;
    workouts: Workout[];
    startDate?: string;
    endDate?: string;
    goal?: string;
};

export type UserGoal = {
    id: string;
    userId: string;
    name: string;
    description?: string;
    targetDate?: string;
    achieved: boolean;
    progress: number; // 0-100
};

export type MuscleGroup =
    | "Chest"
    | "Back"
    | "Shoulders"
    | "Biceps"
    | "Triceps"
    | "Legs"
    | "Abs"
    | "Cardio"
    | "Full Body";

export const DEFAULT_EXERCISES: Exercise[] = [
    { id: "1", name: "Bench Press", muscleGroup: "Chest", description: "Lie on a flat bench and press the weight upward" },
    { id: "2", name: "Squat", muscleGroup: "Legs", description: "Lower your body by bending your knees and hips" },
    { id: "3", name: "Deadlift", muscleGroup: "Back", description: "Lift a weight from the ground to hip level" },
    { id: "4", name: "Pull-up", muscleGroup: "Back", description: "Pull your body up to a bar" },
    { id: "5", name: "Push-up", muscleGroup: "Chest", description: "Push your body up from the ground" },
    { id: "6", name: "Shoulder Press", muscleGroup: "Shoulders", description: "Press the weight upward from shoulder level" },
    { id: "7", name: "Bicep Curl", muscleGroup: "Biceps", description: "Curl the weight toward your shoulder" },
    { id: "8", name: "Tricep Extension", muscleGroup: "Triceps", description: "Extend your arm to straighten it" },
    { id: "9", name: "Leg Press", muscleGroup: "Legs", description: "Push the weight away with your legs" },
    { id: "10", name: "Plank", muscleGroup: "Abs", description: "Hold your body in a straight line from head to heels" },
]; 