
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  duration: number;
  caloriesBurned: number;
  rating: number;
};

export default function Library() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetch("https://api.abcz.workers.dev/api/fitlog")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch workouts");
        }
        return res.json();
      })
      .then((data: Workout[]) => {
        setWorkouts(data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

        <p className="mt-3 mb-10 text-gray-400">
          Twelve lifts covering every major muscle group.
        </p>

        {/* Loading */}
        {loading && (
          <p className="py-10 text-center text-gray-400">
            Loading workouts...
          </p>
        )}

        {/* Workout Grid */}
        {!loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout) => (
              <article
                key={workout.id}
                onClick={() =>
                  router.push(`/workouts/${workout.id}`)
                }
                className="group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#191919] transition hover:-translate-y-1 hover:border-red-500/60"
              >
                {/* Image */}
                <div className="h-52 overflow-hidden bg-[#242424]">
  <img
    src={workout.image}
    alt={workout.name}
    onError={(e) => {
      e.currentTarget.src = "/images/fallback.png";
    }}
    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
  />
</div>

                <div className="p-5">

                  {/* Categories */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {workout.muscleGroups.map((group) => (
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
        {!loading && workouts.length === 0 && (
          <p className="py-10 text-center text-gray-400">
            No workouts available.
          </p>
        )}

      </div>
    </section>
  );
}