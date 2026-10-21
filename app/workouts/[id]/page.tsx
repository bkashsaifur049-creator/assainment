

"use client";

import { useEffect, useState } from "react";
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

export default function WorkoutDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/fitlog"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data: Workout[] = await response.json();

        const selectedWorkout = data.find(
          (item) => item.id === Number(params.id)
        );

        setWorkout(selectedWorkout ?? null);
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Could not load workout details");
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.id]);

  function saveWorkout(key: string, message: string) {
    if (!workout) return;

    try {
      const stored = localStorage.getItem(key);

      const workouts: Workout[] = stored
        ? JSON.parse(stored)
        : [];

      // একই workout আবার যোগ করা বন্ধ
      const alreadyExists = workouts.some(
        (item) => item.id === workout.id
      );

      if (alreadyExists) {
        toast.info("Workout already added!");
        return;
      }

      // Today's Plan-এ সর্বোচ্চ ৫টি workout
      if (key === "todaysPlan" && workouts.length >= 5) {
        toast.warning(
          "You can add only 5 workouts to today's plan!"
        );
        return;
      }

      // Workout যোগ করা
      const updatedWorkouts = [...workouts, workout];

      localStorage.setItem(
        key,
        JSON.stringify(updatedWorkouts)
      );

      // My Plan পেজ আপডেট করা
      window.dispatchEvent(new Event("storageUpdate"));

      toast.success(message);
    } catch (error) {
      console.error("Save workout error:", error);
      toast.error("Could not save workout");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101010] p-10 text-center text-white">
        Loading workout details...
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-[#101010] p-10 text-center text-white">
        <h1 className="text-2xl font-bold">
          Workout not found
        </h1>

        <button
          onClick={() => router.push("/")}
          className="mt-5 rounded-lg bg-red-500 px-5 py-3 font-bold text-white"
        >
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101010] px-4 py-12 text-white md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 text-sm font-semibold text-gray-400 transition hover:text-red-500"
        >
          ← Back to Library
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Workout Image */}
          <div className="overflow-hidden rounded-2xl bg-[#191919]">
            <img
              src={workout.image}
              alt={workout.name}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              className="h-full min-h-72 max-h-[500px] w-full object-cover"
            />
          </div>

          {/* Workout Information */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {workout.muscleGroups?.map((group) => (
                <span
                  key={group}
                  className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500"
                >
                  {group}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-extrabold uppercase md:text-4xl">
              {workout.name}
            </h1>

            <p className="mt-4 leading-7 text-gray-400">
              {workout.description}
            </p>

            {/* Workout Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-[#191919] p-4">
                <p className="text-sm text-gray-400">
                  Duration
                </p>
                <p className="mt-1 text-xl font-bold">
                  {workout.duration} min
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#191919] p-4">
                <p className="text-sm text-gray-400">
                  Calories
                </p>
                <p className="mt-1 text-xl font-bold">
                  {workout.caloriesBurned} kcal
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#191919] p-4">
                <p className="text-sm text-gray-400">
                  Sets × Reps
                </p>
                <p className="mt-1 text-xl font-bold">
                  {workout.sets} × {workout.reps}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#191919] p-4">
                <p className="text-sm text-gray-400">
                  Difficulty
                </p>
                <p className="mt-1 text-xl font-bold">
                  {workout.difficulty}
                </p>
              </div>
            </div>

            <p className="mt-5 text-gray-300">
              Equipment: {workout.equipment}
            </p>

            <p className="mt-2 text-yellow-400">
              ★ {workout.rating}
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  saveWorkout(
                    "todaysPlan",
                    "Added to today's plan"
                  )
                }
                className="rounded-lg bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600"
              >
                Add to today's plan
              </button>

              <button
                onClick={() =>
                  saveWorkout(
                    "savedWorkouts",
                    "Workout saved for later"
                  )
                }
                className="rounded-lg border border-white/20 px-5 py-3 font-bold transition hover:bg-white/10"
              >
                Save for later
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-[#191919] p-6">
          <h2 className="text-2xl font-bold">
            Instructions
          </h2>

          <ol className="mt-5 list-inside list-decimal space-y-3 text-gray-300">
            {workout.instructions?.map(
              (instruction, index) => (
                <li key={index}>{instruction}</li>
              )
            )}
          </ol>
        </section>
      </div>
    </main>
  );
}


  