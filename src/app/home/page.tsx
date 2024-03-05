import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { CreateWorkout } from "../components/create-workout";
import { Exercise, NewWorkout, Workout } from "~/server/db/schema";
import { Calender } from "../components/calendar";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-dark-100 pb-36 text-white">
      <div className="mx-auto w-full max-w-7xl">
        {/* <h1 className="text-4xl font-bold">Workout Tracker</h1> */}
        {/* <div className="mt-12">
        <CreateWorkout userId={session.user.id} />
      </div> */}
        <div className="mt-[72px]">
          <span className="text-4xl font-semibold">Workout Tracker</span>
        </div>
        <div className="mt-[48px]">
          <Calender userId={session.user.id} />
        </div>
      </div>
    </main>
  );
}
