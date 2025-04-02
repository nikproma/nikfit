"use client";

import { useAuth } from "@/app/auth/auth-context";
import { deleteWorkout, getExercises, getWorkouts, initializeStorage } from "@/app/lib/storage";
import { Exercise, Workout } from "@/app/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Dumbbell, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function WorkoutsPage() {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            initializeStorage();
        }
    }, []);

    useEffect(() => {
        if (user) {
            const userWorkouts = getWorkouts(user.id);
            setWorkouts(userWorkouts);
            setFilteredWorkouts(userWorkouts);
            setExercises(getExercises());
        }
    }, [user]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredWorkouts(workouts);
        } else {
            const filtered = workouts.filter(
                (workout) =>
                    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (workout.notes && workout.notes.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredWorkouts(filtered);
        }
    }, [searchTerm, workouts]);

    const handleDeleteWorkout = (id: string) => {
        if (confirm("Are you sure you want to delete this workout?")) {
            deleteWorkout(id);
            setWorkouts(workouts.filter((workout) => workout.id !== id));
            toast.success("Workout deleted successfully");
        }
    };

    const getExerciseName = (exerciseId: string) => {
        const exercise = exercises.find((ex) => ex.id === exerciseId);
        return exercise ? exercise.name : "Unknown Exercise";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Workouts</h1>
                    <p className="text-muted-foreground">
                        View and manage your workout history
                    </p>
                </div>
                <Link href="/workouts/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Workout
                    </Button>
                </Link>
            </div>

            <div className="relative mt-6">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search workouts..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredWorkouts.length > 0 ? (
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredWorkouts.map((workout) => (
                        <Card key={workout.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{workout.name}</CardTitle>
                                        <CardDescription className="flex items-center mt-1">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {formatDate(workout.date)}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={workout.completed ? "default" : "outline"}>
                                        {workout.completed ? "Completed" : "In Progress"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <Dumbbell className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {workout.sets.length} sets across{" "}
                                            {new Set(workout.sets.map((set) => set.exerciseId)).size} exercises
                                        </span>
                                    </div>
                                    {workout.duration && (
                                        <div className="flex items-center text-sm">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{workout.duration} minutes</span>
                                        </div>
                                    )}
                                    {workout.notes && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {workout.notes}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" asChild>
                                    <Link href={`/workouts/${workout.id}`}>View Details</Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteWorkout(workout.id)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Dumbbell className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No workouts found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {workouts.length === 0
                            ? "You haven't logged any workouts yet. Start by creating a new workout."
                            : "No workouts match your search criteria."}
                    </p>
                    {workouts.length === 0 && (
                        <Button className="mt-4" asChild>
                            <Link href="/workouts/new">Create Your First Workout</Link>
                        </Button>
                    )}
                </div>
            )}

            {filteredWorkouts.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Recent Workout Details</h2>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Exercise</TableHead>
                                        <TableHead>Sets</TableHead>
                                        <TableHead>Reps</TableHead>
                                        <TableHead>Weight</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredWorkouts[0].sets.map((set) => (
                                        <TableRow key={set.id}>
                                            <TableCell>{getExerciseName(set.exerciseId)}</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell>{set.reps}</TableCell>
                                            <TableCell>{set.weight} lbs</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
} 