

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty?: string;
  duration: number;
  caloriesBurned: number;
  sets?: number;
  reps?: string;
  rating: number;
  description?: string;
  instructions?: string[];
};

export default function Library() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Duration");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function fetchWorkouts() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "https://api.abcz.workers.dev/api/fitlog"
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data: unknown = await res.json();

        let workoutList: Workout[] = [];

        if (Array.isArray(data)) {
          workoutList = data as Workout[];
        } else if (
          data &&
          typeof data === "object" &&
          "workouts" in data &&
          Array.isArray(data.workouts)
        ) {
          workoutList = data.workouts as Workout[];
        } else if (
          data &&
          typeof data === "object" &&
          "data" in data &&
          Array.isArray(data.data)
        ) {
          workoutList = data.data as Workout[];
        } else {
          throw new Error("Invalid workout data format");
        }

        if (!cancelled) {
          setWorkouts(workoutList);
        }
      } catch (err) {
        console.error("API Error:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load workouts."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchWorkouts();

    return () => {
      cancelled = true;
    };
  }, []);

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
    <section className="min-h-screen bg-[#101010] px-4 py-16 text-white md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <p className="mb-3 text-sm font-bold tracking-[0.3em] text-red-500">
          WORKOUT COLLECTION
        </p>

        <h2 className="text-4xl font-extrabold md:text-5xl">
          THE LIBRARY
        </h2>

        <p className="mb-10 mt-3 text-gray-400">
          Twelve lifts covering every major muscle group.
        </p>

        {/* Sort Dropdown */}
        <div className="mb-6 flex items-center justify-end gap-3">
          <label
            htmlFor="sortBy"
            className="text-sm text-gray-400"
          >
            Sort By
          </label>

          <div className="relative">
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-lg border border-white/10 bg-[#191919] py-3 pl-4 pr-10 text-sm font-semibold text-white outline-none focus:border-red-500"
            >
              <option value="Duration">Duration</option>
              <option value="Calories">Calories</option>
              <option value="Rating">Rating</option>
            </select>

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              ⌄
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="py-10 text-center text-gray-400">
            Loading workouts...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-10 text-center">
            <p className="text-red-400">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Workout Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedWorkouts.map((workout) => (
              <article
                key={workout.id}
                onClick={() =>
                  router.push(`/workouts/${workout.id}`)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/workouts/${workout.id}`);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#191919] transition hover:-translate-y-1 hover:border-red-500/60"
              >
                {/* Image */}
                <div className="h-52 overflow-hidden bg-[#242424]">
                  <img
                    src={workout.image || "/images/fallback.png"}
                    alt={workout.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/fallback.png";
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  {/* Categories */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {workout.muscleGroups?.map((group) => (
                      <span
                        key={group}
                        className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500"
                      >
                        {group.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Workout Name */}
                  <h3 className="text-lg font-extrabold uppercase tracking-wide">
                    {workout.name}
                  </h3>

                  {/* Equipment */}
                  <p className="mt-3 text-sm text-gray-400">
                    Equipment: {workout.equipment}
                  </p>

                  {/* Stats */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-gray-300">
                    <span>◷ {workout.duration} min</span>
                    <span>🔥 {workout.caloriesBurned} kcal</span>
                    <span>★ {workout.rating}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && workouts.length === 0 && (
          <p className="py-10 text-center text-gray-400">
            No workouts available.
          </p>
        )}
      </div>
    </section>
  );
}
