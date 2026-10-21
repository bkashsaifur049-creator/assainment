
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    function updateCounts() {
      try {
        const planData = JSON.parse(
          localStorage.getItem("todaysPlan") || "[]"
        );

        const savedData = JSON.parse(
          localStorage.getItem("savedWorkouts") || "[]"
        );

        setPlanCount(
          Array.isArray(planData) ? planData.length : 0
        );

        setSavedCount(
          Array.isArray(savedData) ? savedData.length : 0
        );
      } catch (error) {
        console.error("Navbar count error:", error);
        setPlanCount(0);
        setSavedCount(0);
      }
    }

    // পেজ খোলার সময় সংখ্যা আপডেট
    updateCounts();

    // একই পেজে Workout save করলে আপডেট
    window.addEventListener("storageUpdate", updateCounts);

    // অন্য ট্যাব থেকে পরিবর্তন হলে আপডেট
    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("storageUpdate", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#101010] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold">
          <span className="text-red-500">FIT</span>LOG
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold transition hover:text-red-500"
          >
            Workout
          </Link>

          <Link
            href="/my-plan"
            className="text-sm font-semibold transition hover:text-red-500"
          >
            My Plan
          </Link>
        </div>

        {/* Plan & Saved Badges */}
        <div className="flex items-center gap-3">
          <Link
            href="/my-plan"
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
          >
            Plan {planCount}
          </Link>

          <Link
            href="/my-plan"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold transition hover:border-red-500"
          >
            Saved {savedCount}
          </Link>
        </div>
      </div>
    </nav>
  );
}
