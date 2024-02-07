"use server";

import { api } from "~/trpc/server";
import type { NewWorkout } from "~/server/db/schema";

const createWorkout = api.workout.create;

export const handleCreateWorkout = async (workoutData: NewWorkout) => {
  await createWorkout.mutate({ ...workoutData });
};
