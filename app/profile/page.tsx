"use client";

import { useAuth } from "@/app/auth/auth-context";
import { getGoals, getWorkoutPlans, getWorkouts } from "@/app/lib/storage";
import { UserGoal } from "@/app/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [isEditing, setIsEditing] = useState(false);

    const workouts = user ? getWorkouts(user.id) : [];
    const plans = user ? getWorkoutPlans(user.id) : [];
    const goals = user ? getGoals(user.id) : [];

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const handleSaveProfile = () => {
        // In a real app, we would update the user's profile in the database
        // For this demo, we'll just show a toast
        toast.success("Profile updated successfully");
        setIsEditing(false);
    };

    const totalWorkouts = workouts.length;
    const completedWorkouts = workouts.filter(w => w.completed).length;
    const totalSets = workouts.reduce((acc, workout) => acc + workout.sets.length, 0);
    const completedSets = workouts.reduce((acc, workout) =>
        acc + workout.sets.filter(set => set.completed).length, 0);

    return (
        <div className="py-6">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>

            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>Your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarFallback className="text-2xl">
                                {user ? getInitials(user.name) : ""}
                            </AvatarFallback>
                        </Avatar>
                        {isEditing ? (
                            <div className="w-full space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={user?.username || ""}
                                        disabled
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h2 className="text-xl font-bold">{user?.name}</h2>
                                <p className="text-muted-foreground">@{user?.username}</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveProfile}>Save</Button>
                            </div>
                        ) : (
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workout Statistics</CardTitle>
                            <CardDescription>Your workout progress and achievements</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Workouts Completed</span>
                                    <span className="text-sm text-muted-foreground">{completedWorkouts} / {totalWorkouts}</span>
                                </div>
                                <Progress value={totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Sets Completed</span>
                                    <span className="text-sm text-muted-foreground">{completedSets} / {totalSets}</span>
                                </div>
                                <Progress value={totalSets > 0 ? (completedSets / totalSets) * 100 : 0} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg border p-3">
                                    <div className="text-sm font-medium text-muted-foreground">Total Workouts</div>
                                    <div className="text-2xl font-bold">{totalWorkouts}</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="text-sm font-medium text-muted-foreground">Active Plans</div>
                                    <div className="text-2xl font-bold">{plans.length}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Goals</CardTitle>
                            <CardDescription>Track your fitness goals</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="active">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="active">Active</TabsTrigger>
                                    <TabsTrigger value="completed">Completed</TabsTrigger>
                                </TabsList>
                                <TabsContent value="active" className="space-y-4">
                                    {goals.filter(g => !g.achieved).length > 0 ? (
                                        goals.filter(g => !g.achieved).map((goal: UserGoal) => (
                                            <div key={goal.id} className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{goal.name}</span>
                                                    <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                                                </div>
                                                <Progress value={goal.progress} />
                                                {goal.description && (
                                                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                                                )}
                                                {goal.targetDate && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground">No active goals. Create a goal to track your progress.</p>
                                    )}
                                </TabsContent>
                                <TabsContent value="completed" className="space-y-4">
                                    {goals.filter(g => g.achieved).length > 0 ? (
                                        goals.filter(g => g.achieved).map((goal: UserGoal) => (
                                            <div key={goal.id} className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{goal.name}</span>
                                                    <span className="text-sm text-green-500">Completed</span>
                                                </div>
                                                <Progress value={100} className="bg-green-100" />
                                                {goal.description && (
                                                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground">No completed goals yet.</p>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                Add New Goal
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
} 