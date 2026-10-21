

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#0b0f12] py-15 text-white px-15 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">

        {/* Left Content */}
        <div>
          <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#ccff00]">
            WORKOUT LIBRARY
          </p>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            TRAIN WITH INTENT.
            <span className="mt-1 block text-[#ccff00]">
              LOG EVERY SET.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 md:text-lg">
            FitLog is a dark, no-nonsense gym companion: pick a lift,
            lock it into today&apos;s plan, and watch the week&apos;s
            work add up.
          </p>

          {/* CTA Button */}
          <Link
            href="#library"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-6 py-4 font-bold text-black transition hover:bg-lime-300"
          >
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6.5 6.5 11 11" />
              <path d="m21 21-1-1" />
              <path d="m3 3 1 1" />
              <path d="m7 3 2 2" />
              <path d="m19 17 2 2" />
              <path d="m3 7 4-4" />
              <path d="m17 21 4-4" />
            </svg> */}

            BROWSE WORKOUTS

            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Right Hero Image */}
        <div className="relative min-h-420-px] overflow-hidden rounded-2xl border border-white/10 bg-[#171c20] sm:min-h-[700px]">
          <Image
            src="/images/banner.png"
            alt="Athlete training in a gym"
              fill
  priority
  sizes="(max-width: 600px) 100vw, 50vw"
            className="object-cover"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute right-5 top-5 text-5xl font-black text-[#ccff00]">
            
          </div>
        </div>

      </div>
    </section>
  );
}
