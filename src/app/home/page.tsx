import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateWorkout } from "../components/create-workout";
import { NewWorkout } from "~/server/db/schema";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  const test = api.workout.getAllWorkouts.query({ userId: session.user.id });

  const workoutData = {
    userId: session.user.id,
    name: "Workout 1",
    time: "Morning",
    duration: "15 min",
    type: "Strength Training",
    specificName: "Leg day",
    notes: "some notes here",
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-white">
      <h1 className="text-4xl font-bold">Workout Tracker</h1>
      <div className="mt-12">
        <CreateWorkout workoutData={workoutData} />
      </div>
    </main>
  );
}
