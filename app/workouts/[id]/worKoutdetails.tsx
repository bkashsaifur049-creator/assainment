
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

type Props = {
  id: string;
};


export default function WorkoutDetailsContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const router = useRouter();


  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchWorkout() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          "https://api.abcz.workers.dev/api/fitlog",
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data: unknown = await res.json();

        let workouts: Workout[] = [];

        if (Array.isArray(data)) {
          workouts = data as Workout[];
        } else if (
          data &&
          typeof data === "object" &&
          "workouts" in data &&
          Array.isArray(data.workouts)
        ) {
          workouts = data.workouts as Workout[];
        } else if (
          data &&
          typeof data === "object" &&
          "data" in data &&
          Array.isArray(data.data)
        ) {
          workouts = data.data as Workout[];
        }

        console.log("Route ID:", id);
        console.log("Available IDs:", workouts.map((w) => w.id));

        const selectedWorkout = workouts.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedWorkout) {
          console.error("Workout not found. Requested ID:", id);
          throw new Error("No workout matches this ID.");
        }

        if (!cancelled) {
          setWorkout(selectedWorkout);
        }
      } catch (err) {
        console.error("Workout fetch error:", err);

        if (!cancelled) {
          setWorkout(null);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load workout."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchWorkout();
    } else {
      setError("Workout ID is missing.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  function saveWorkout(key: string, message: string) {
    if (!workout) return;

    try {
      const stored = localStorage.getItem(key);
      const saved: Workout[] = stored ? JSON.parse(stored) : [];

      if (saved.some((item) => item.id === workout.id)) {
        toast.info("Workout already added!");
        return;
      }

      saved.push(workout);
      localStorage.setItem(key, JSON.stringify(saved));

      window.dispatchEvent(new Event("storageUpdate"));
      toast.success(message);
    } catch (err) {
      console.error("Save workout error:", err);
      toast.error("Could not save workout.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="animate-pulse text-xl">Loading workout...</p>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <h1 className="text-3xl font-bold">Workout not found</h1>

        <p className="max-w-lg text-gray-400">
          {error || "We could not find this workout."}
        </p>

        <Link
          href="/"
          className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400"
        >
          Back to Library
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-8 rounded-lg border border-gray-700 px-4 py-2 text-sm hover:border-orange-500"
        >
          ← Back
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <img
              src={workout.image}
              alt={workout.name}
              className="h-72 w-full rounded-2xl object-cover sm:h-96"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="space-y-5">
            <p className="font-semibold uppercase tracking-[0.2em] text-orange-500">
              Workout Details
            </p>

            <h1 className="text-4xl font-bold sm:text-5xl">
              {workout.name}
            </h1>

            <p className="leading-7 text-gray-400">
              {workout.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-800 p-4">
                <p className="text-sm text-gray-400">Difficulty</p>
                <p className="mt-1 font-semibold">
                  {workout.difficulty}
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 p-4">
                <p className="text-sm text-gray-400">Duration</p>
                <p className="mt-1 font-semibold">
                  {workout.duration} minutes
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 p-4">
                <p className="text-sm text-gray-400">Calories</p>
                <p className="mt-1 font-semibold">
                  {workout.caloriesBurned}
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 p-4">
                <p className="text-sm text-gray-400">Rating</p>
                <p className="mt-1 font-semibold">
                  ⭐ {workout.rating}
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 p-4">
                <p className="text-sm text-gray-400">Sets</p>
                <p className="mt-1 font-semibold">{workout.sets}</p>
              </div>

              <div className="rounded-xl border border-gray-800 p-4">
                <p className="text-sm text-gray-400">Reps</p>
                <p className="mt-1 font-semibold">{workout.reps}</p>
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">
                Equipment
              </h2>
              <p className="text-gray-400">{workout.equipment}</p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold">
                Muscle Groups
              </h2>

              <div className="flex flex-wrap gap-2">
                {workout.muscleGroups?.map((muscle) => (
                  <span
                    key={muscle}
                    className="rounded-full bg-orange-500/10 px-3 py-2 text-sm text-orange-400"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

<div className="flex flex-wrap gap-3 pt-3">
  <button
    onClick={() =>
      saveWorkout("todaysPlan", "Added to your plan!")
    }
    className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-black hover:bg-orange-400"
  >
    + Add to Plan
  </button>

  <button
    onClick={() =>
      saveWorkout("savedWorkouts", "Workout saved!")
    }
    className="rounded-xl border border-gray-600 px-5 py-3 font-semibold hover:border-orange-500"
  >
    ♡ Save Workout
  </button>
</div>

          </div>
        </div>
      </div>
    </main>
  );
}