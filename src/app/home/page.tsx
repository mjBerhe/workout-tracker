import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  const test = api.workout.getAllWorkouts.query({ userId: session.user.id });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-white">
      <div>we home</div>
    </main>
  );
}
