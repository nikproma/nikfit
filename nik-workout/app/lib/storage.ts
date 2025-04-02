"use client";

import { DEFAULT_EXERCISES, Exercise, UserGoal, Workout, WorkoutPlan } from "./types";

// Initialize local storage with default exercises if not already present
export function initializeStorage() {
    if (typeof window === "undefined") return;

    // Initialize exercises
    if (!localStorage.getItem("exercises")) {
        localStorage.setItem("exercises", JSON.stringify(DEFAULT_EXERCISES));
    }

    // Initialize empty arrays for other data
    if (!localStorage.getItem("workouts")) {
        localStorage.setItem("workouts", JSON.stringify([]));
    }

    if (!localStorage.getItem("workoutPlans")) {
        localStorage.setItem("workoutPlans", JSON.stringify([]));
    }

    if (!localStorage.getItem("goals")) {
        localStorage.setItem("goals", JSON.stringify([]));
    }
}

// Exercise functions
export function getExercises(): Exercise[] {
    if (typeof window === "undefined") return [];
    const exercises = localStorage.getItem("exercises");
    return exercises ? JSON.parse(exercises) : [];
}

export function addExercise(exercise: Exercise): void {
    if (typeof window === "undefined") return;
    const exercises = getExercises();
    exercises.push(exercise);
    localStorage.setItem("exercises", JSON.stringify(exercises));
}

export function updateExercise(exercise: Exercise): void {
    if (typeof window === "undefined") return;
    const exercises = getExercises();
    const index = exercises.findIndex((e) => e.id === exercise.id);
    if (index !== -1) {
        exercises[index] = exercise;
        localStorage.setItem("exercises", JSON.stringify(exercises));
    }
}

export function deleteExercise(id: string): void {
    if (typeof window === "undefined") return;
    const exercises = getExercises();
    const filteredExercises = exercises.filter((e) => e.id !== id);
    localStorage.setItem("exercises", JSON.stringify(filteredExercises));
}

// Workout functions
export function getWorkouts(userId: string): Workout[] {
    if (typeof window === "undefined") return [];
    const workouts = localStorage.getItem("workouts");
    const allWorkouts = workouts ? JSON.parse(workouts) : [];
    return allWorkouts.filter((w: Workout) => w.userId === userId);
}

export function getWorkout(id: string): Workout | undefined {
    if (typeof window === "undefined") return undefined;
    const workouts = localStorage.getItem("workouts");
    const allWorkouts = workouts ? JSON.parse(workouts) : [];
    return allWorkouts.find((w: Workout) => w.id === id);
}

export function addWorkout(workout: Workout): void {
    if (typeof window === "undefined") return;
    const workouts = localStorage.getItem("workouts");
    const allWorkouts = workouts ? JSON.parse(workouts) : [];
    allWorkouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(allWorkouts));
}

export function updateWorkout(workout: Workout): void {
    if (typeof window === "undefined") return;
    const workouts = localStorage.getItem("workouts");
    const allWorkouts = workouts ? JSON.parse(workouts) : [];
    const index = allWorkouts.findIndex((w: Workout) => w.id === workout.id);
    if (index !== -1) {
        allWorkouts[index] = workout;
        localStorage.setItem("workouts", JSON.stringify(allWorkouts));
    }
}

export function deleteWorkout(id: string): void {
    if (typeof window === "undefined") return;
    const workouts = localStorage.getItem("workouts");
    const allWorkouts = workouts ? JSON.parse(workouts) : [];
    const filteredWorkouts = allWorkouts.filter((w: Workout) => w.id !== id);
    localStorage.setItem("workouts", JSON.stringify(filteredWorkouts));
}

// Workout Plan functions
export function getWorkoutPlans(userId: string): WorkoutPlan[] {
    if (typeof window === "undefined") return [];
    const plans = localStorage.getItem("workoutPlans");
    const allPlans = plans ? JSON.parse(plans) : [];
    return allPlans.filter((p: WorkoutPlan) => p.userId === userId);
}

export function getWorkoutPlan(id: string): WorkoutPlan | undefined {
    if (typeof window === "undefined") return undefined;
    const plans = localStorage.getItem("workoutPlans");
    const allPlans = plans ? JSON.parse(plans) : [];
    return allPlans.find((p: WorkoutPlan) => p.id === id);
}

export function addWorkoutPlan(plan: WorkoutPlan): void {
    if (typeof window === "undefined") return;
    const plans = localStorage.getItem("workoutPlans");
    const allPlans = plans ? JSON.parse(plans) : [];
    allPlans.push(plan);
    localStorage.setItem("workoutPlans", JSON.stringify(allPlans));
}

export function updateWorkoutPlan(plan: WorkoutPlan): void {
    if (typeof window === "undefined") return;
    const plans = localStorage.getItem("workoutPlans");
    const allPlans = plans ? JSON.parse(plans) : [];
    const index = allPlans.findIndex((p: WorkoutPlan) => p.id === plan.id);
    if (index !== -1) {
        allPlans[index] = plan;
        localStorage.setItem("workoutPlans", JSON.stringify(allPlans));
    }
}

export function deleteWorkoutPlan(id: string): void {
    if (typeof window === "undefined") return;
    const plans = localStorage.getItem("workoutPlans");
    const allPlans = plans ? JSON.parse(plans) : [];
    const filteredPlans = allPlans.filter((p: WorkoutPlan) => p.id !== id);
    localStorage.setItem("workoutPlans", JSON.stringify(filteredPlans));
}

// Goal functions
export function getGoals(userId: string): UserGoal[] {
    if (typeof window === "undefined") return [];
    const goals = localStorage.getItem("goals");
    const allGoals = goals ? JSON.parse(goals) : [];
    return allGoals.filter((g: UserGoal) => g.userId === userId);
}

export function addGoal(goal: UserGoal): void {
    if (typeof window === "undefined") return;
    const goals = localStorage.getItem("goals");
    const allGoals = goals ? JSON.parse(goals) : [];
    allGoals.push(goal);
    localStorage.setItem("goals", JSON.stringify(allGoals));
}

export function updateGoal(goal: UserGoal): void {
    if (typeof window === "undefined") return;
    const goals = localStorage.getItem("goals");
    const allGoals = goals ? JSON.parse(goals) : [];
    const index = allGoals.findIndex((g: UserGoal) => g.id === goal.id);
    if (index !== -1) {
        allGoals[index] = goal;
        localStorage.setItem("goals", JSON.stringify(allGoals));
    }
}

export function deleteGoal(id: string): void {
    if (typeof window === "undefined") return;
    const goals = localStorage.getItem("goals");
    const allGoals = goals ? JSON.parse(goals) : [];
    const filteredGoals = allGoals.filter((g: UserGoal) => g.id !== id);
    localStorage.setItem("goals", JSON.stringify(filteredGoals));
} 