

import Navbar from "./component/Navber"

import Hero from "./component/Hero"
import Library from "./component/Library";
export default function Home() {
  return (
    <>
      <Navbar />
<Hero />
<Library />
      <main className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to FitLog
        </h1>
        <p className="mt-2 text-gray-600">
          Track your workouts and manage your plans.
        </p>
      </main>
    </>
  );
}
