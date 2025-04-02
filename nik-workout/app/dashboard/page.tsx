"use client";

import { useAuth } from "@/app/auth/auth-context";
import { SeedButton } from "@/app/components/seed-button";
import { getGoals, getWorkoutPlans, getWorkouts, initializeStorage } from "@/app/lib/storage";
import { UserGoal, Workout, WorkoutPlan } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Dumbbell, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartDataPoint = {
    date: string;
    weight?: number;
    reps?: number;
    count?: number;
};

export default function DashboardPage() {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [plans, setPlans] = useState<WorkoutPlan[]>([]);
    const [goals, setGoals] = useState<UserGoal[]>([]);
    const [weightData, setWeightData] = useState<ChartDataPoint[]>([]);
    const [repsData, setRepsData] = useState<ChartDataPoint[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            initializeStorage();
        }
    }, []);

    useEffect(() => {
        if (user) {
            const userWorkouts = getWorkouts(user.id);
            const userPlans = getWorkoutPlans(user.id);
            const userGoals = getGoals(user.id);

            setWorkouts(userWorkouts);
            setPlans(userPlans);
            setGoals(userGoals);

            // Prepare data for charts
            prepareChartData(userWorkouts);
        }
    }, [user]);

    const prepareChartData = (workouts: Workout[]) => {
        // Group workouts by date for weight progression
        const weightProgressionMap = new Map<string, ChartDataPoint>();
        const repsProgressionMap = new Map<string, ChartDataPoint>();

        workouts.forEach(workout => {
            const date = new Date(workout.date).toLocaleDateString();

            workout.sets.forEach(set => {
                // Weight progression
                if (!weightProgressionMap.has(date)) {
                    weightProgressionMap.set(date, { date, weight: 0, count: 0 });
                }
                const weightEntry = weightProgressionMap.get(date)!;
                weightEntry.weight = (weightEntry.weight || 0) + set.weight;
                weightEntry.count = (weightEntry.count || 0) + 1;

                // Reps progression
                if (!repsProgressionMap.has(date)) {
                    repsProgressionMap.set(date, { date, reps: 0, count: 0 });
                }
                const repsEntry = repsProgressionMap.get(date)!;
                repsEntry.reps = (repsEntry.reps || 0) + set.reps;
                repsEntry.count = (repsEntry.count || 0) + 1;
            });
        });

        // Calculate averages and prepare chart data
        const weightData = Array.from(weightProgressionMap.values())
            .map(entry => ({
                date: entry.date,
                weight: entry.count && entry.count > 0 ? Math.round((entry.weight || 0) / entry.count) : 0
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const repsData = Array.from(repsProgressionMap.values())
            .map(entry => ({
                date: entry.date,
                reps: entry.count && entry.count > 0 ? Math.round((entry.reps || 0) / entry.count) : 0
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setWeightData(weightData);
        setRepsData(repsData);
    };

    return (
        <div className="py-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.name}! Here&apos;s an overview of your fitness journey.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{workouts.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {workouts.length > 0
                                ? `Last workout: ${new Date(workouts[workouts.length - 1]?.date || "").toLocaleDateString()}`
                                : "No workouts yet"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{plans.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {plans.length > 0
                                ? `${plans.length} active workout plans`
                                : "No active plans"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Goals</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{goals.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {goals.filter(g => g.achieved).length} achieved, {goals.filter(g => !g.achieved).length} in progress
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Progress</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {workouts.length > 0 ? `${workouts.reduce((total, workout) => total + (workout.sets.length || 0), 0)} sets` : "0 sets"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all workouts
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="weight" className="mt-8">
                <TabsList>
                    <TabsTrigger value="weight">Weight Progression</TabsTrigger>
                    <TabsTrigger value="reps">Reps Progression</TabsTrigger>
                </TabsList>
                <TabsContent value="weight" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Weight Progression</CardTitle>
                            <CardDescription>
                                Average weight lifted per workout over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {weightData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={weightData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="weight"
                                            stroke="#8884d8"
                                            name="Avg. Weight (lbs)"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <p className="text-muted-foreground">No workout data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reps" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reps Progression</CardTitle>
                            <CardDescription>
                                Average reps per exercise over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {repsData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={repsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar
                                            dataKey="reps"
                                            fill="#82ca9d"
                                            name="Avg. Reps"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <p className="text-muted-foreground">No workout data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-8 flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/workouts/new">
                        <Button className="w-full">Log New Workout</Button>
                    </Link>
                    <Link href="/plans/new">
                        <Button variant="outline" className="w-full">Create Workout Plan</Button>
                    </Link>
                    <Link href="/profile">
                        <Button variant="outline" className="w-full">Update Profile</Button>
                    </Link>
                </div>

                {/* Seed Data Section */}
                <div className="mt-6 border-t pt-6">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <h3 className="text-lg font-medium">Development Tools</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Need to reset or populate your account with sample data? Use the button below to seed test data.
                        </p>
                        <SeedButton />
                    </div>
                </div>
            </div>
        </div>
    );
} 