"use client";

import { useAuth } from "@/app/auth/auth-context";
import { deleteWorkoutPlan, getWorkoutPlans, initializeStorage } from "@/app/lib/storage";
import { WorkoutPlan } from "@/app/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, CalendarDays, CalendarRange, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PlansPage() {
    const { user } = useAuth();
    const [plans, setPlans] = useState<WorkoutPlan[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPlans, setFilteredPlans] = useState<WorkoutPlan[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            initializeStorage();
        }
    }, []);

    useEffect(() => {
        if (user) {
            const userPlans = getWorkoutPlans(user.id);
            setPlans(userPlans);
            setFilteredPlans(userPlans);
        }
    }, [user]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPlans(plans);
        } else {
            const filtered = plans.filter(
                (plan) =>
                    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredPlans(filtered);
        }
    }, [searchTerm, plans]);

    const handleDeletePlan = (id: string) => {
        if (confirm("Are you sure you want to delete this workout plan?")) {
            deleteWorkoutPlan(id);
            setPlans(plans.filter((plan) => plan.id !== id));
            toast.success("Workout plan deleted successfully");
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not set";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getDateRange = (plan: WorkoutPlan) => {
        if (plan.startDate && plan.endDate) {
            return `${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}`;
        } else if (plan.startDate) {
            return `From ${formatDate(plan.startDate)}`;
        } else if (plan.endDate) {
            return `Until ${formatDate(plan.endDate)}`;
        }
        return "No date range set";
    };

    return (
        <div className="py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Workout Plans</h1>
                    <p className="text-muted-foreground">
                        Create and manage your workout plans
                    </p>
                </div>
                <Link href="/plans/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Plan
                    </Button>
                </Link>
            </div>

            <div className="relative mt-6">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search plans..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredPlans.length > 0 ? (
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPlans.map((plan) => (
                        <Card key={plan.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{plan.name}</CardTitle>
                                        <CardDescription className="flex items-center mt-1">
                                            <CalendarRange className="mr-1 h-3 w-3" />
                                            {getDateRange(plan)}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline">
                                        {plan.workouts.length} workouts
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {plan.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {plan.description}
                                        </p>
                                    )}
                                    {plan.goal && (
                                        <div className="flex items-center text-sm mt-2">
                                            <span className="font-medium mr-2">Goal:</span>
                                            <span>{plan.goal}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center text-sm mt-2">
                                        <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {plan.workouts.length === 0
                                                ? "No workouts added yet"
                                                : `${plan.workouts.length} ${plan.workouts.length === 1 ? "workout" : "workouts"
                                                } in this plan`}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" asChild>
                                    <Link href={`/plans/${plan.id}`}>View Details</Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeletePlan(plan.id)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No workout plans found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {plans.length === 0
                            ? "You haven't created any workout plans yet. Start by creating a new plan."
                            : "No plans match your search criteria."}
                    </p>
                    {plans.length === 0 && (
                        <Button className="mt-4" asChild>
                            <Link href="/plans/new">Create Your First Plan</Link>
                        </Button>
                    )}
                </div>
            )}

            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Why Create a Workout Plan?</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Structure</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                A well-designed workout plan provides structure and ensures you target all muscle groups appropriately.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Consistency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Following a plan helps maintain consistency, which is key to seeing results in your fitness journey.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Track your progress over time and make adjustments to continue challenging yourself and improving.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 