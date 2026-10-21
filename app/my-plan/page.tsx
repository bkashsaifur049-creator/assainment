

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  X,
  Clock,
  Flame,
  Star,
  CheckCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export default function MyPlanPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    function loadWorkouts() {
      try {
        const planData = localStorage.getItem("todaysPlan");
        const savedData = localStorage.getItem("savedWorkouts");
        const completedData = localStorage.getItem("completedWorkouts");

        setWorkouts(planData ? JSON.parse(planData) : []);
        setSaved(savedData ? JSON.parse(savedData) : []);
        setCompleted(completedData ? JSON.parse(completedData) : []);
      } catch (error) {
        console.error("Failed to load workouts:", error);
        toast.error("Failed to load workouts.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();

    window.addEventListener("storageUpdate", loadWorkouts);
    window.addEventListener("storage", loadWorkouts);
    window.addEventListener("focus", loadWorkouts);

    return () => {
      window.removeEventListener("storageUpdate", loadWorkouts);
      window.removeEventListener("storage", loadWorkouts);
      window.removeEventListener("focus", loadWorkouts);
    };
  }, []);

  const currentList = activeTab === "plan" ? workouts : saved;

  function removeWorkout(id: number) {
    if (activeTab === "plan") {
      const updated = workouts.filter((item) => item.id !== id);

      setWorkouts(updated);
      localStorage.setItem("todaysPlan", JSON.stringify(updated));

      const updatedCompleted = completed.filter((item) => item !== id);

      setCompleted(updatedCompleted);
      localStorage.setItem(
        "completedWorkouts",
        JSON.stringify(updatedCompleted)
      );

      toast.success("Workout removed from your plan!");
    } else {
      const updated = saved.filter((item) => item.id !== id);

      setSaved(updated);
      localStorage.setItem("savedWorkouts", JSON.stringify(updated));

      toast.success("Workout removed from saved!");
    }

    window.dispatchEvent(new Event("storageUpdate"));
  }

  function markDone(id: number) {
    if (completed.includes(id)) {
      toast.info("Workout is already completed!");
      return;
    }

    const updatedCompleted = [...completed, id];

    setCompleted(updatedCompleted);

    localStorage.setItem(
      "completedWorkouts",
      JSON.stringify(updatedCompleted)
    );

    toast.success("Workout marked as done!");
  }

  const totalMinutes = workouts.reduce(
    (sum, item) => sum + item.duration,
    0
  );

  const totalCalories = workouts.reduce(
    (sum, item) => sum + item.caloriesBurned,
    0
  );

  return (
    <main className="min-h-screen bg-[#101010] px-4 py-10 text-white md:px-8">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
      />

      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold tracking-[0.3em] text-lime-400">
            WORKOUT LIBRARY
          </p>

          <h1 className="text-4xl font-extrabold md:text-6xl">
            MY <span className="text-lime-400">PLAN</span>
          </h1>

          <p className="mt-4 text-gray-400">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </header>

        {/* Metrics */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              title: "Exercises",
              value: workouts.length,
              icon: <CheckCircle />,
            },
            {
              title: "Minutes",
              value: totalMinutes,
              icon: <Clock />,
            },
            {
              title: "Calories",
              value: totalCalories,
              icon: <Flame />,
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-white/10 bg-[#191919] p-6"
            >
              <div className="mb-4 flex items-center justify-between text-gray-400">
                <span>{stat.title}</span>
                {stat.icon}
              </div>

              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Tabs */}
        <div className="mb-8 flex gap-3 border-b border-white/10">
          <button
            onClick={() => setActiveTab("plan")}
            className={`border-b-2 px-5 py-3 font-semibold ${
              activeTab === "plan"
                ? "border-lime-400 text-lime-400"
                : "border-transparent text-gray-400"
            }`}
          >
            Today's Plan ({workouts.length})
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`border-b-2 px-5 py-3 font-semibold ${
              activeTab === "saved"
                ? "border-lime-400 text-lime-400"
                : "border-transparent text-gray-400"
            }`}
          >
            Saved ({saved.length})
          </button>
        </div>

        {/* Loading and Empty State */}
        {loading ? (
          <p className="py-16 text-center text-gray-400">
            Loading workouts…
          </p>
        ) : currentList.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-white/20 px-5 py-20 text-center">
            <h2 className="text-2xl font-extrabold">
              NOTHING HERE YET
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-400">
              Browse the library and add a lift to get today moving.
            </p>

            <Link
              href="/"
              className="mt-7 inline-block rounded-full bg-lime-400 px-7 py-3 font-bold text-black transition hover:bg-lime-300"
            >
              Go to workouts
            </Link>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {currentList.map((workout) => {
              const isDone = completed.includes(workout.id);

              return (
                <article
                  key={workout.id}
                  className={`overflow-hidden rounded-2xl border border-white/10 bg-[#191919] ${
                    activeTab === "plan" && isDone
                      ? "border-lime-400/40 opacity-75"
                      : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row">
                    <img
                      src={workout.image}
                      alt={workout.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="h-52 w-full object-cover sm:h-auto sm:w-44"
                    />

                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-extrabold uppercase">
                            {workout.name}
                          </h3>

                          <p className="mt-2 text-sm text-gray-400">
                            {workout.equipment}
                          </p>

                          {activeTab === "plan" && isDone && (
                            <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-lime-400">
                              <CheckCircle size={16} />
                              Workout Completed
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeWorkout(workout.id)}
                          aria-label={`Remove ${workout.name}`}
                          className="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-red-400"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Workout Details */}
                      <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {workout.duration} min
                        </span>

                        <span className="flex items-center gap-1">
                          <Flame size={16} />
                          {workout.caloriesBurned} kcal
                        </span>

                        <span className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {workout.rating}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        <Link
                          href={`/workouts/${workout.id}`}
                          className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
                        >
                          View Details
                        </Link>

                        {activeTab === "plan" && (
                          <button
                            onClick={() => markDone(workout.id)}
                            disabled={isDone}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                              isDone
                                ? "cursor-not-allowed bg-gray-700 text-white"
                                : "bg-lime-400 text-black hover:bg-lime-300"
                            }`}
                          >
                            <CheckCircle size={16} />
                            {isDone ? "Done" : "Mark as Done"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

