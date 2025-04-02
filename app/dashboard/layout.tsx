"use client";

import { Navbar } from "@/app/components/navbar";
import { ProtectedRoute } from "@/app/components/protected-route";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
                <Toaster />
            </div>
        </ProtectedRoute>
    );
} 