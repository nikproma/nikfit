import { SeedButton } from "@/app/components/seed-button";
import { LoginForm } from "../login-form";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
            <LoginForm />
            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                    Need test data? Click below to create a test account with sample data.
                </p>
                <SeedButton />
            </div>
        </div>
    );
} 