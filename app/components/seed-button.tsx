"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { seedTestUser } from "../lib/seed-data";

export function SeedButton() {
    const router = useRouter();

    const handleSeedData = () => {
        try {
            seedTestUser();
            toast.success("Test data seeded successfully! You can now login with username: test, password: test");

            // Refresh the page after a short delay to show the toast
            setTimeout(() => {
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error("Error seeding data:", error);
            toast.error("Failed to seed test data");
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleSeedData}
            className="mt-4"
        >
            Seed Test Account
        </Button>
    );
} 