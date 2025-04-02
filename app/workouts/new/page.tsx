"use client";

import { useAuth } from "@/app/auth/auth-context";
import { addWorkout, getExercises, initializeStorage } from "@/app/lib/storage";
import { Exercise, Workout, WorkoutSet } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewWorkoutPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [workoutName, setWorkoutName] = useState("");
    const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split("T")[0]);
    const [workoutNotes, setWorkoutNotes] = useState("");
    const [workoutDuration, setWorkoutDuration] = useState("");
    const [sets, setSets] = useState<Array<{
        exerciseId: string;
        weight: string;
        reps: string;
        rpe?: string;
        notes?: string;
    }>>([{ exerciseId: "", weight: "", reps: "", rpe: "", notes: "" }]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            initializeStorage();
            setExercises(getExercises());
        }
    }, []);

    const handleAddSet = () => {
        setSets([...sets, { exerciseId: "", weight: "", reps: "", rpe: "", notes: "" }]);
    };

    const handleRemoveSet = (index: number) => {
        const newSets = [...sets];
        newSets.splice(index, 1);
        setSets(newSets);
    };

    const handleSetChange = (index: number, field: string, value: string) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to create a workout");
            return;
        }

        if (!workoutName) {
            toast.error("Please enter a workout name");
            return;
        }

        if (sets.some(set => !set.exerciseId || !set.weight || !set.reps)) {
            toast.error("Please fill in all required fields for each set");
            return;
        }

        // Create workout object
        const workoutSets: WorkoutSet[] = sets.map(set => ({
            id: crypto.randomUUID(),
            exerciseId: set.exerciseId,
            weight: parseFloat(set.weight),
            reps: parseInt(set.reps),
            rpe: set.rpe ? parseFloat(set.rpe) : undefined,
            notes: set.notes,
            completed: true,
        }));

        const workout: Workout = {
            id: crypto.randomUUID(),
            userId: user.id,
            name: workoutName,
            date: workoutDate,
            notes: workoutNotes || undefined,
            sets: workoutSets,
            duration: workoutDuration ? parseInt(workoutDuration) : undefined,
            completed: true,
        };

        // Save workout
        addWorkout(workout);
        toast.success("Workout added successfully");
        router.push("/workouts");
    };

    return (
        <div className="container py-6">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                    <Link href="/workouts">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">New Workout</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Workout Details</CardTitle>
                        <CardDescription>
                            Enter the basic information about your workout
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Workout Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Chest Day, Leg Workout"
                                    value={workoutName}
                                    onChange={(e) => setWorkoutName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={workoutDate}
                                    onChange={(e) => setWorkoutDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (minutes)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    placeholder="e.g., 60"
                                    value={workoutDuration}
                                    onChange={(e) => setWorkoutDuration(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Any additional notes about this workout"
                                value={workoutNotes}
                                onChange={(e) => setWorkoutNotes(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Exercises</CardTitle>
                                <CardDescription>
                                    Add the exercises you performed in this workout
                                </CardDescription>
                            </div>
                            <Button type="button" onClick={handleAddSet} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" /> Add Set
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {sets.map((set, index) => (
                            <div key={index} className="p-4 border rounded-lg relative">
                                <div className="absolute top-2 right-2">
                                    {sets.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveSet(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`exercise-${index}`}>Exercise</Label>
                                        <Select
                                            value={set.exerciseId}
                                            onValueChange={(value) => handleSetChange(index, "exerciseId", value)}
                                        >
                                            <SelectTrigger id={`exercise-${index}`}>
                                                <SelectValue placeholder="Select an exercise" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {exercises.map((exercise) => (
                                                    <SelectItem key={exercise.id} value={exercise.id}>
                                                        {exercise.name} ({exercise.muscleGroup})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`weight-${index}`}>Weight (lbs)</Label>
                                        <Input
                                            id={`weight-${index}`}
                                            type="number"
                                            placeholder="e.g., 135"
                                            value={set.weight}
                                            onChange={(e) => handleSetChange(index, "weight", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`reps-${index}`}>Reps</Label>
                                        <Input
                                            id={`reps-${index}`}
                                            type="number"
                                            placeholder="e.g., 10"
                                            value={set.reps}
                                            onChange={(e) => handleSetChange(index, "reps", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`rpe-${index}`}>RPE (1-10)</Label>
                                        <Input
                                            id={`rpe-${index}`}
                                            type="number"
                                            min="1"
                                            max="10"
                                            placeholder="e.g., 8"
                                            value={set.rpe}
                                            onChange={(e) => handleSetChange(index, "rpe", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <Label htmlFor={`notes-${index}`}>Set Notes</Label>
                                    <Textarea
                                        id={`notes-${index}`}
                                        placeholder="Any notes about this set"
                                        value={set.notes}
                                        onChange={(e) => handleSetChange(index, "notes", e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={handleAddSet}>
                            <Plus className="h-4 w-4 mr-1" /> Add Another Set
                        </Button>
                    </CardFooter>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/workouts">Cancel</Link>
                    </Button>
                    <Button type="submit">Save Workout</Button>
                </div>
            </form>
        </div>
    );
} 