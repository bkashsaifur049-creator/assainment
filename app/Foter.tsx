

import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-400 border-t border-white/10">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Dumbbell className="text-orange-500" size={24} />

          <span className="text-white font-bold text-xl tracking-wider">
            FITLOG
          </span>
        </div>

        {/* Right: Copyright */}
        <p className="text-sm text-center">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>

      </div>
    </footer>
  );
}
