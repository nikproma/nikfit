"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";
import { useState } from "react";

export type WorkoutFilters = {
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
    workoutType: string | undefined;
    exerciseType: string | undefined;
    weightRange: [number, number];
};

interface WorkoutFiltersProps {
    onFiltersChange: (filters: WorkoutFilters) => void;
}

export function WorkoutFilters({ onFiltersChange }: WorkoutFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<WorkoutFilters>({
        dateRange: {
            from: undefined,
            to: undefined,
        },
        workoutType: undefined,
        exerciseType: undefined,
        weightRange: [0, 500],
    });

    // Date presets
    const datePresets = [
        { label: "Last 7 days", days: 7 },
        { label: "Last 30 days", days: 30 },
        { label: "Last 90 days", days: 90 },
        { label: "Last 6 months", days: 180 },
        { label: "Last year", days: 365 },
        { label: "All time", days: 0 },
    ];

    const handleDatePresetChange = (days: number) => {
        if (days === 0) {
            // All time
            setFilters({
                ...filters,
                dateRange: {
                    from: undefined,
                    to: undefined,
                },
            });
        } else {
            const to = new Date();
            const from = new Date();
            from.setDate(from.getDate() - days);

            setFilters({
                ...filters,
                dateRange: {
                    from,
                    to,
                },
            });
        }
    };

    const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
        setFilters({
            ...filters,
            dateRange: range,
        });
    };

    const handleWorkoutTypeChange = (value: string) => {
        setFilters({
            ...filters,
            workoutType: value === "all" ? undefined : value,
        });
    };

    const handleExerciseTypeChange = (value: string) => {
        setFilters({
            ...filters,
            exerciseType: value === "all" ? undefined : value,
        });
    };

    const handleWeightRangeChange = (value: number[]) => {
        setFilters({
            ...filters,
            weightRange: [value[0], value[1]],
        });
    };

    const handleApplyFilters = () => {
        onFiltersChange(filters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            dateRange: {
                from: undefined,
                to: undefined,
            },
            workoutType: undefined,
            exerciseType: undefined,
            weightRange: [0, 500],
        };
        setFilters(resetFilters);
        onFiltersChange(resetFilters);
    };

    return (
        <div className="mb-6">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter Workouts</span>
                        {(filters.dateRange.from || filters.workoutType || filters.exerciseType) && (
                            <span className="ml-2 rounded-full bg-primary w-2 h-2" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0" align="start">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Date Range</h3>
                                <div className="flex flex-wrap gap-2">
                                    {datePresets.map((preset) => (
                                        <Button
                                            key={preset.days}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDatePresetChange(preset.days)}
                                            className="text-xs"
                                        >
                                            {preset.label}
                                        </Button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="grid gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-[130px] justify-start text-left font-normal"
                                                    size="sm"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {filters.dateRange.from ? (
                                                        format(filters.dateRange.from, "PPP")
                                                    ) : (
                                                        <span>From date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={filters.dateRange.from}
                                                    onSelect={(date) =>
                                                        handleDateRangeChange({
                                                            ...filters.dateRange,
                                                            from: date,
                                                        })
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="grid gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-[130px] justify-start text-left font-normal"
                                                    size="sm"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {filters.dateRange.to ? (
                                                        format(filters.dateRange.to, "PPP")
                                                    ) : (
                                                        <span>To date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={filters.dateRange.to}
                                                    onSelect={(date) =>
                                                        handleDateRangeChange({
                                                            ...filters.dateRange,
                                                            to: date,
                                                        })
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Workout Type</h3>
                                <Select
                                    value={filters.workoutType || "all"}
                                    onValueChange={handleWorkoutTypeChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All workout types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All workout types</SelectItem>
                                        <SelectItem value="Push">Push</SelectItem>
                                        <SelectItem value="Pull">Pull</SelectItem>
                                        <SelectItem value="Legs">Legs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Exercise Type</h3>
                                <Select
                                    value={filters.exerciseType || "all"}
                                    onValueChange={handleExerciseTypeChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All exercises" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All exercises</SelectItem>
                                        <SelectItem value="Chest">Chest</SelectItem>
                                        <SelectItem value="Back">Back</SelectItem>
                                        <SelectItem value="Shoulders">Shoulders</SelectItem>
                                        <SelectItem value="Biceps">Biceps</SelectItem>
                                        <SelectItem value="Triceps">Triceps</SelectItem>
                                        <SelectItem value="Legs">Legs</SelectItem>
                                        <SelectItem value="Abs">Abs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-medium">Weight Range (lbs)</h3>
                                    <span className="text-xs text-muted-foreground">
                                        {filters.weightRange[0]} - {filters.weightRange[1]}
                                    </span>
                                </div>
                                <Slider
                                    defaultValue={[0, 500]}
                                    min={0}
                                    max={500}
                                    step={5}
                                    value={filters.weightRange}
                                    onValueChange={handleWeightRangeChange}
                                />
                            </div>

                            <div className="flex justify-between pt-2">
                                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                                    Reset
                                </Button>
                                <Button size="sm" onClick={handleApplyFilters}>
                                    Apply Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </PopoverContent>
            </Popover>
        </div>
    );
} 