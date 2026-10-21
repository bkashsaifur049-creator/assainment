"use client";

import { useState } from "react";

type Workout = {
  id: number;
  name: string;
  duration: number;
  caloriesBurned: number;
  rating: number;
};

type Props = {
  workouts: Workout[];
};

export default function SortDropdown({ workouts }: Props) {
  const [sortBy, setSortBy] = useState("Duration");

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === "Duration") {
      return a.duration - b.duration;
    }

    if (sortBy === "Calories") {
      return b.caloriesBurned - a.caloriesBurned;
    }

    if (sortBy === "Rating") {
      return b.rating - a.rating;
    }

    return 0;
  });

  return (
    <div>
      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-400">
          Sort By
        </label>

        <div className="relative">
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none rounded-lg border border-gray-700
              bg-gray-900 py-2 pl-3 pr-9 text-white outline-none
              focus:border-orange-500"
          >
            <option value="Duration">Duration</option>
            <option value="Calories">Calories</option>
            <option value="Rating">Rating</option>
          </select>

          {/* Chevron Icon */}
          <span className="pointer-events-none absolute right-3 top-1/2
            -translate-y-1/2 text-gray-400">
            ⌄
          </span>
        </div>
      </div>

      {/* Sorted Workout List */}
      <div className="mt-4 grid gap-4">
        {sortedWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-white"
          >
            <h3 className="font-bold">{workout.name}</h3>
            <p>Duration: {workout.duration} minutes</p>
            <p>Calories: {workout.caloriesBurned}</p>
            <p>Rating: {workout.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}