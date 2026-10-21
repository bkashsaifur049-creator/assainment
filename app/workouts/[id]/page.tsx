

// import WorkoutDetailsContent from "./worKoutdetails";

// export default async function WorkoutDetailsPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   return <WorkoutDetailsContent id={id} />;
// }

       
import { Suspense } from "react";
import WorkoutDetailsContent from "./worKoutdetails";

export default function WorkoutDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#101010] p-10 text-center text-white">
          Loading workout...
        </div>
      }
    >
      <WorkoutDetailsContent />
    </Suspense>
  );
}
