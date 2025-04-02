"use client";

import { useAuth } from "@/app/auth/auth-context";
import { addWorkoutPlan, initializeStorage } from "@/app/lib/storage";
import { WorkoutPlan } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewPlanPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [planName, setPlanName] = useState("");
    const [planDescription, setPlanDescription] = useState("");
    const [planGoal, setPlanGoal] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            initializeStorage();
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to create a workout plan");
            return;
        }

        if (!planName) {
            toast.error("Please enter a plan name");
            return;
        }

        // Validate dates if provided
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            toast.error("Start date cannot be after end date");
            return;
        }

        // Create workout plan object
        const plan: WorkoutPlan = {
            id: crypto.randomUUID(),
            userId: user.id,
            name: planName,
            description: planDescription || undefined,
            workouts: [],
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            goal: planGoal || undefined,
        };

        // Save workout plan
        addWorkoutPlan(plan);
        toast.success("Workout plan created successfully");
        router.push("/plans");
    };

    return (
        <div className="container py-6">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                    <Link href="/plans">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">New Workout Plan</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Plan Details</CardTitle>
                        <CardDescription>
                            Create a new workout plan to organize your fitness routine
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Plan Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., 12-Week Strength Program, Summer Shred"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your workout plan"
                                value={planDescription}
                                onChange={(e) => setPlanDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="goal">Goal</Label>
                            <Input
                                id="goal"
                                placeholder="e.g., Build muscle, Lose weight, Improve endurance"
                                value={planGoal}
                                onChange={(e) => setPlanGoal(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <p className="text-sm text-muted-foreground">
                            You can add workouts to your plan after creating it.
                        </p>
                    </CardFooter>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/plans">Cancel</Link>
                    </Button>
                    <Button type="submit">Create Plan</Button>
                </div>
            </form>

            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Tips for Creating an Effective Workout Plan</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Set Clear Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Define specific, measurable goals for your workout plan to stay motivated and track progress effectively.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Balance Your Training</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Include a mix of strength, cardio, and flexibility exercises to ensure well-rounded fitness development.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Progressive Overload</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Gradually increase intensity over time to continue challenging your body and making progress.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 