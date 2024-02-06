import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { signIn } from "next-auth/react";
import { SignIn } from "./_components/buttons/sign-in";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div>
        <h1 className="text-5xl font-bold">Workout Tracker</h1>
        <SignIn signedIn={!!session} />
      </div>
    </main>
  );
}
