"use client";

import { useAuth } from "@/app/auth/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const navItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Workouts", path: "/workouts" },
        { name: "Plans", path: "/plans" },
        { name: "Profile", path: "/profile" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold text-xl">NikFit</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {user && navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`transition-colors hover:text-foreground/80 ${isActive(item.path)
                                    ? "text-foreground font-semibold"
                                    : "text-foreground/60"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="mr-2 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                        <SheetHeader>
                            <SheetTitle className="text-left">NikFit</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-4 mt-6">
                            {user && navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`px-2 py-1 rounded-md transition-colors hover:bg-muted ${isActive(item.path) ? "bg-muted font-semibold" : ""
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {user && (
                                <Button
                                    variant="ghost"
                                    className="justify-start px-2"
                                    onClick={logout}
                                >
                                    Logout
                                </Button>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
                            <span className="font-bold text-xl">NikFit</span>
                        </Link>
                    </div>
                    <nav className="flex items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden md:block">
                                    <Button variant="ghost" onClick={logout}>
                                        Logout
                                    </Button>
                                </div>
                                <Link href="/profile">
                                    <Avatar>
                                        <AvatarFallback>
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button>Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
} 