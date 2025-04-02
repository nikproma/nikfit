"use client";

import { initializeStorage } from "./storage";
import { UserGoal, Workout, WorkoutPlan, WorkoutSet } from "./types";

interface UserData {
    id: string;
    username: string;
    password: string;
    name: string;
}

// Function to seed a test user with username: test, password: test
export function seedTestUser() {
    if (typeof window === "undefined") return;

    // Initialize storage first
    initializeStorage();

    // Create test user if it doesn't exist
    const users = JSON.parse(localStorage.getItem("users") || "[]") as UserData[];
    const testUserExists = users.some((u) => u.username === "test");

    if (!testUserExists) {
        const testUser: UserData = {
            id: "test-user-id",
            username: "test",
            password: "test",
            name: "Test User",
        };

        users.push(testUser);
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Test user created");
    }

    // Get the test user ID
    const testUser = users.find((u) => u.username === "test");
    const testUserId = testUser?.id || "test-user-id";

    // Clear existing data for the test user
    clearUserData(testUserId);

    // Seed workouts
    seedYearOfWorkouts(testUserId);

    // Seed workout plans
    seedWorkoutPlans(testUserId);

    // Seed goals
    seedGoals(testUserId);

    console.log("Test data seeded successfully");
}

// Clear existing user data to avoid duplicates
function clearUserData(userId: string) {
    // Clear workouts
    const workouts = JSON.parse(localStorage.getItem("workouts") || "[]") as Workout[];
    const filteredWorkouts = workouts.filter(w => w.userId !== userId);
    localStorage.setItem("workouts", JSON.stringify(filteredWorkouts));

    // Clear plans
    const plans = JSON.parse(localStorage.getItem("workoutPlans") || "[]") as WorkoutPlan[];
    const filteredPlans = plans.filter(p => p.userId !== userId);
    localStorage.setItem("workoutPlans", JSON.stringify(filteredPlans));

    // Clear goals
    const goals = JSON.parse(localStorage.getItem("goals") || "[]") as UserGoal[];
    const filteredGoals = goals.filter(g => g.userId !== userId);
    localStorage.setItem("goals", JSON.stringify(filteredGoals));

    console.log("Cleared existing user data");
}

// Generate a random number between min and max (inclusive)
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a workout for a specific date with realistic progression
function generateWorkoutForDate(userId: string, date: Date, workoutType: string): Workout {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const yearProgress = (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
        (new Date(date.getFullYear() + 1, 0, 1).getTime() - new Date(date.getFullYear(), 0, 1).getTime());

    // Base progression factor (0.8 to 1.2) - increases weights over time
    const progressionFactor = 0.8 + (yearProgress * 0.4);

    // Determine workout type based on day of week if not specified
    if (!workoutType) {
        if (dayOfWeek === 1 || dayOfWeek === 4) { // Monday or Thursday
            workoutType = "Push";
        } else if (dayOfWeek === 2 || dayOfWeek === 5) { // Tuesday or Friday
            workoutType = "Pull";
        } else if (dayOfWeek === 3 || dayOfWeek === 6) { // Wednesday or Saturday
            workoutType = "Legs";
        } else {
            workoutType = ["Push", "Pull", "Legs"][getRandomInt(0, 2)]; // Random on Sunday
        }
    }

    // Create workout sets based on type
    const sets: WorkoutSet[] = [];
    let workoutName = "";
    let workoutDuration = 0;

    if (workoutType === "Push") {
        workoutName = "Push Day";
        workoutDuration = getRandomInt(45, 75);

        // Bench Press
        const benchWeight = Math.round(135 * progressionFactor);
        for (let i = 0; i < 3; i++) {
            sets.push({
                id: `set-${crypto.randomUUID()}`,
                exerciseId: "1", // Bench Press
                weight: benchWeight - (i === 0 ? 20 : 0) + getRandomInt(-5, 5), // Slight variation
                reps: getRandomInt(6, 12),
                completed: true,
                notes: i === 0 ? "Warm-up set" : `Working set ${i}`
            });
        }

        // Shoulder Press
        const shoulderWeight = Math.round(95 * progressionFactor);
        for (let i = 0; i < 3; i++) {
            sets.push({
                id: `set-${crypto.randomUUID()}`,
                exerciseId: "6", // Shoulder Press
                weight: shoulderWeight + getRandomInt(-5, 5),
                reps: getRandomInt(8, 12),
                completed: true,
                notes: `Working set ${i + 1}`
            });
        }

        // Tricep Extension
        const tricepWeight = Math.round(50 * progressionFactor);
        for (let i = 0; i < 3; i++) {
            sets.push({
                id: `set-${crypto.randomUUID()}`,
                exerciseId: "8", // Tricep Extension
                weight: tricepWeight + getRandomInt(-5, 5),
                reps: getRandomInt(10, 15),
                completed: true,
                notes: `Working set ${i + 1}`
            });
        }
    }
    else if (workoutType === "Pull") {
        workoutName = "Pull Day";
        workoutDuration = getRandomInt(45, 75);

        // Deadlift
        const deadliftWeight = Math.round(225 * progressionFactor);
        for (let i = 0; i < 3; i++) {
            sets.push({
                id: `set-${crypto.randomUUID()}`,
                exerciseId: "3", // Deadlift
                weight: deadliftWeight - (i === 0 ? 40 : 0) + getRandomInt(-10, 10),
                reps: getRandomInt(5, 8),
                completed: true,
                notes: i === 0 ? "Warm-up set" : `Working set ${i}`
            });
        }

        // Pull-up
        for (let i = 0; i < 3; i++) {
            sets.push({
                id: `set-${crypto.randomUUID()}`,
                exerciseId: "4", // Pull-up
                weight: 0, // Bodyweight
                reps: Math.round(8 * progressionFactor) + getRandomInt(-2, 2),
                completed: true,
                notes: "Bodyweight"
            });
        }

        // Bicep Curl
        const bicepWeight = Math.round(35 * progressionFactor);
        for (let i = 0; i < 3; i++) {
            sets.push({
                id: `set-${crypto.randomUUID()}`,
                exerciseId: "7", // Bicep Curl
                weight: bicepWeight + getRandomInt(-5, 5),
                reps: getRandomInt(10, 15),
                completed: true,
                notes: `Working set ${i + 1}`
            });
        }
    }
    else if (workoutType === "Legs") {
        workoutName = "Leg Day";
        workoutDuration = getRandomInt(50, 80);

        // Squat
        const squatWeight = Math.round(185 * progressionFactor);
        for (let i = 0; i < 3; i++) {
            sets.push({
                id: `set-${crypto.randomUUID()}`,
                exerciseId: "2", // Squat
                weight: squatWeight - (i === 0 ? 45 : 0) + getRandomInt(-10, 10),
                reps: getRandomInt(6, 10),
                completed: true,
                notes: i === 0 ? "Warm-up set" : `Working set ${i}`
            });
        }

        // Leg Press
        const legPressWeight = Math.round(315 * progressionFactor);
        for (let i = 0; i < 3; i++) {
            sets.push({
                id: `set-${crypto.randomUUID()}`,
                exerciseId: "9", // Leg Press
                weight: legPressWeight + getRandomInt(-20, 20),
                reps: getRandomInt(8, 12),
                completed: true,
                notes: `Working set ${i + 1}`
            });
        }

        // Plank (for core)
        sets.push({
            id: `set-${crypto.randomUUID()}`,
            exerciseId: "10", // Plank
            weight: 0,
            reps: 1,
            completed: true,
            notes: `${getRandomInt(30, 90)} seconds`
        });
    }

    // Add some randomness to workout completion
    const isCompleted = Math.random() > 0.05; // 95% chance of completion

    // For very recent workouts (last 3 days), sometimes mark as incomplete
    const isRecent = (new Date().getTime() - date.getTime()) < (3 * 24 * 60 * 60 * 1000);
    const finalIsCompleted = isRecent ? (Math.random() > 0.3) : isCompleted;

    // If not completed, mark some sets as incomplete
    if (!finalIsCompleted) {
        const incompleteStartIndex = getRandomInt(Math.floor(sets.length / 2), sets.length - 1);
        for (let i = incompleteStartIndex; i < sets.length; i++) {
            sets[i].completed = false;
        }
    }

    // Create the workout
    return {
        id: `workout-${crypto.randomUUID()}`,
        userId: userId,
        name: `${date.toLocaleDateString('en-US', { weekday: 'long' })} ${workoutName}`,
        date: date.toISOString(),
        notes: generateRandomWorkoutNote(workoutType, finalIsCompleted),
        sets: sets,
        duration: finalIsCompleted ? workoutDuration : Math.floor(workoutDuration * 0.7),
        completed: finalIsCompleted
    };
}

// Generate a random workout note
function generateRandomWorkoutNote(workoutType: string, completed: boolean): string {
    const positiveNotes = [
        "Felt strong today",
        "Great energy levels",
        "Increased weights on most exercises",
        "Good form throughout",
        "Quick recovery between sets",
        "New personal best on main lift",
        "Focused on mind-muscle connection",
        "Excellent pump",
        "Nutrition on point before workout",
        "Slept well last night, felt the difference"
    ];

    const negativeNotes = [
        "Feeling a bit tired today",
        "Lower energy than usual",
        "Maintained weights but struggled with reps",
        "Need to work on form for main lift",
        "Longer rest periods needed",
        "Slight discomfort in shoulder/knee/back",
        "Nutrition was off yesterday",
        "Poor sleep affected performance",
        "Busy day at work, mentally fatigued",
        "Deload might be needed soon"
    ];

    const incompleteNotes = [
        "Had to cut workout short",
        "Not feeling well, stopped early",
        "Time constraints today",
        "Will finish remaining exercises tomorrow",
        "Minor strain, decided to stop as precaution"
    ];

    if (!completed) {
        return incompleteNotes[getRandomInt(0, incompleteNotes.length - 1)];
    }

    // 70% chance of positive note, 30% chance of negative
    const notes = Math.random() < 0.7 ? positiveNotes : negativeNotes;
    let note = notes[getRandomInt(0, notes.length - 1)];

    // Add workout type specific comment
    if (workoutType === "Push") {
        note += Math.random() < 0.5 ? ", chest feeling stronger" : ", focused on tricep activation";
    } else if (workoutType === "Pull") {
        note += Math.random() < 0.5 ? ", back width improving" : ", biceps getting a good pump";
    } else if (workoutType === "Legs") {
        note += Math.random() < 0.5 ? ", quad definition improving" : ", hamstring flexibility better";
    }

    return note;
}

// Seed a year's worth of workouts with realistic patterns
function seedYearOfWorkouts(userId: string) {
    const workouts = JSON.parse(localStorage.getItem("workouts") || "[]") as Workout[];

    // Generate dates for workouts (3-5 workouts per week for a year)
    const workoutDates: Date[] = [];
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Start with a consistent schedule
    const currentDate = new Date(oneYearAgo);
    while (currentDate <= today) {
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Typical workout days: Monday, Tuesday, Thursday, Friday
        // With some randomness for Wednesday/Saturday workouts
        if (
            dayOfWeek === 1 || // Monday
            dayOfWeek === 2 || // Tuesday
            dayOfWeek === 4 || // Thursday
            dayOfWeek === 5 || // Friday
            (dayOfWeek === 3 && Math.random() < 0.3) || // Wednesday (30% chance)
            (dayOfWeek === 6 && Math.random() < 0.2)    // Saturday (20% chance)
        ) {
            // Skip some workouts randomly (simulating missed days)
            if (Math.random() > 0.15) { // 85% attendance rate
                workoutDates.push(new Date(currentDate));
            }
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`Generating ${workoutDates.length} workouts over the past year`);

    // Create workouts for each date
    const yearOfWorkouts: Workout[] = [];

    // Track the workout type to create a realistic split routine
    let lastWorkoutType = "";

    workoutDates.forEach((date) => {
        // Determine workout type based on previous workout to maintain a rotation
        let workoutType = "";
        if (lastWorkoutType === "Push") {
            workoutType = "Pull";
        } else if (lastWorkoutType === "Pull") {
            workoutType = "Legs";
        } else if (lastWorkoutType === "Legs") {
            workoutType = "Push";
        } else {
            // First workout or after a break
            workoutType = ["Push", "Pull", "Legs"][getRandomInt(0, 2)];
        }

        // Generate the workout
        const workout = generateWorkoutForDate(userId, date, workoutType);
        yearOfWorkouts.push(workout);

        // Update last workout type
        lastWorkoutType = workoutType;
    });

    // Add all workouts to storage
    workouts.push(...yearOfWorkouts);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    console.log(`Added ${yearOfWorkouts.length} workouts spanning the past year`);
}

function seedWorkoutPlans(userId: string) {
    const plans = JSON.parse(localStorage.getItem("workoutPlans") || "[]") as WorkoutPlan[];

    // Create sample workout plans
    const today = new Date();

    // Plan 1: Current PPL plan
    const pplStartDate = new Date(today);
    pplStartDate.setDate(today.getDate() - 30); // Started a month ago

    const pplEndDate = new Date(today);
    pplEndDate.setDate(today.getDate() + 60); // Ends in 2 months

    // Plan 2: Past 5x5 plan
    const fiveByFiveStartDate = new Date(today);
    fiveByFiveStartDate.setDate(today.getDate() - 120); // Started 4 months ago

    const fiveByFiveEndDate = new Date(today);
    fiveByFiveEndDate.setDate(today.getDate() - 30); // Ended a month ago

    // Plan 3: Future hypertrophy plan
    const hyperStartDate = new Date(today);
    hyperStartDate.setDate(today.getDate() + 70); // Starts in a bit over 2 months

    const hyperEndDate = new Date(today);
    hyperEndDate.setDate(today.getDate() + 160); // Runs for 3 months

    const samplePlans: WorkoutPlan[] = [
        {
            id: `plan-${crypto.randomUUID()}`,
            userId: userId,
            name: "Push/Pull/Legs Split",
            description: "3-day split focusing on pushing, pulling, and leg exercises for balanced development",
            workouts: [],
            startDate: pplStartDate.toISOString(),
            endDate: pplEndDate.toISOString(),
            goal: "Build strength and muscle mass"
        },
        {
            id: `plan-${crypto.randomUUID()}`,
            userId: userId,
            name: "5x5 Strength Program",
            description: "Classic 5x5 strength training program focusing on compound movements and progressive overload",
            workouts: [],
            startDate: fiveByFiveStartDate.toISOString(),
            endDate: fiveByFiveEndDate.toISOString(),
            goal: "Increase strength on compound lifts"
        },
        {
            id: `plan-${crypto.randomUUID()}`,
            userId: userId,
            name: "Hypertrophy Focus",
            description: "Higher volume training with moderate weights to maximize muscle growth",
            workouts: [],
            startDate: hyperStartDate.toISOString(),
            endDate: hyperEndDate.toISOString(),
            goal: "Maximize muscle growth and definition"
        },
        {
            id: `plan-${crypto.randomUUID()}`,
            userId: userId,
            name: "Summer Shred",
            description: "Higher rep ranges with shorter rest periods to burn fat while maintaining muscle",
            workouts: [],
            startDate: hyperStartDate.toISOString(),
            endDate: hyperEndDate.toISOString(),
            goal: "Reduce body fat while maintaining muscle mass"
        }
    ];

    // Add sample plans to storage
    plans.push(...samplePlans);
    localStorage.setItem("workoutPlans", JSON.stringify(plans));
    console.log("Sample workout plans added");
}

function seedGoals(userId: string) {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]") as UserGoal[];

    // Create target dates
    const today = new Date();

    // Future goals
    const targetDate1 = new Date(today);
    targetDate1.setDate(today.getDate() + 60); // 60 days from now

    const targetDate2 = new Date(today);
    targetDate2.setDate(today.getDate() + 30); // 30 days from now

    const targetDate3 = new Date(today);
    targetDate3.setDate(today.getDate() + 90); // 90 days from now

    // Past goals (completed)
    const pastDate1 = new Date(today);
    pastDate1.setDate(today.getDate() - 45); // 45 days ago

    const pastDate2 = new Date(today);
    pastDate2.setDate(today.getDate() - 90); // 90 days ago

    // Create sample goals
    const sampleGoals: UserGoal[] = [
        // Active goals
        {
            id: `goal-${crypto.randomUUID()}`,
            userId: userId,
            name: "Bench Press 225 lbs for 5 reps",
            description: "Increase bench press strength to 225 lbs for 5 reps",
            targetDate: targetDate1.toISOString(),
            achieved: false,
            progress: 75
        },
        {
            id: `goal-${crypto.randomUUID()}`,
            userId: userId,
            name: "Squat 315 lbs",
            description: "Reach a 315 lb squat for at least 1 rep",
            targetDate: targetDate2.toISOString(),
            achieved: false,
            progress: 60
        },
        {
            id: `goal-${crypto.randomUUID()}`,
            userId: userId,
            name: "Deadlift 405 lbs",
            description: "Build up to a 405 lb deadlift",
            targetDate: targetDate3.toISOString(),
            achieved: false,
            progress: 40
        },
        {
            id: `goal-${crypto.randomUUID()}`,
            userId: userId,
            name: "Complete 15 Pull-ups",
            description: "Be able to do 15 consecutive pull-ups with good form",
            targetDate: undefined,
            achieved: false,
            progress: 65
        },

        // Completed goals
        {
            id: `goal-${crypto.randomUUID()}`,
            userId: userId,
            name: "Complete 10 Pull-ups",
            description: "Be able to do 10 consecutive pull-ups with good form",
            targetDate: pastDate1.toISOString(),
            achieved: true,
            progress: 100
        },
        {
            id: `goal-${crypto.randomUUID()}`,
            userId: userId,
            name: "Squat 225 lbs for 5 reps",
            description: "Build up to squatting 225 lbs for 5 reps with good form",
            targetDate: pastDate2.toISOString(),
            achieved: true,
            progress: 100
        },
        {
            id: `goal-${crypto.randomUUID()}`,
            userId: userId,
            name: "Bench Press 185 lbs",
            description: "Reach 185 lbs on bench press",
            targetDate: pastDate1.toISOString(),
            achieved: true,
            progress: 100
        }
    ];

    // Add sample goals to storage
    goals.push(...sampleGoals);
    localStorage.setItem("goals", JSON.stringify(goals));
    console.log("Sample goals added");
} 