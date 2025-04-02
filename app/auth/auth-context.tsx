"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: string;
    username: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Get users from local storage
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const user = users.find((u: any) => u.username === username);

            if (!user || user.password !== password) {
                setIsLoading(false);
                return false;
            }

            // Create user object without password
            const loggedInUser = {
                id: user.id,
                username: user.username,
                name: user.name,
            };

            // Store user in local storage
            localStorage.setItem("user", JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            setIsLoading(false);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
            return false;
        }
    };

    const register = async (username: string, password: string, name: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Get users from local storage
            const users = JSON.parse(localStorage.getItem("users") || "[]");

            // Check if username already exists
            if (users.some((u: any) => u.username === username)) {
                setIsLoading(false);
                return false;
            }

            // Create new user
            const newUser = {
                id: crypto.randomUUID(),
                username,
                password,
                name,
            };

            // Add user to users array
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));

            // Log in the user
            const loggedInUser = {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name,
            };

            localStorage.setItem("user", JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            setIsLoading(false);
            return true;
        } catch (error) {
            console.error("Registration error:", error);
            setIsLoading(false);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
} 