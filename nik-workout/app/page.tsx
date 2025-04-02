"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Calendar, Dumbbell, LineChart, Target, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./auth/auth-context";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            <span className="font-bold text-xl">NikFit</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 flex-1 flex items-center">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Track Your Fitness Journey with NikFit
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Log workouts, track progress, and achieve your fitness goals with our easy-to-use workout tracker.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/auth/register">
                <Button className="px-8">Get Started</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Features
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Everything you need to track and improve your fitness journey.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-12">
            <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
              <Dumbbell className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Workout Logging</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Log your workouts with details on exercises, sets, reps, and weights.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
              <LineChart className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Visualize your progress with detailed graphs and statistics.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
              <Calendar className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Workout Plans</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Create and follow custom workout plans to reach your goals.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
              <Target className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Goal Setting</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Set and track fitness goals to stay motivated and focused.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
              <BarChart3 className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Data Analysis</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Analyze your workout data to optimize your training routine.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">User Profiles</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Create your personal profile to customize your fitness experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-3xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Start Your Fitness Journey?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Join NikFit today and take control of your workouts and progress.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/auth/register">
                <Button className="px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8 mt-auto">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024 NikFit. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
