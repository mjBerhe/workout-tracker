import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateWorkoutButton } from "../_components/buttons/create-workout";
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
      <div>we home</div>
      <div>
        <CreateWorkoutButton workoutData={workoutData} />
      </div>
    </main>
  );
}
