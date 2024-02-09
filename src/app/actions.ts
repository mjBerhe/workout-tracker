"use server";

import { api } from "~/trpc/server";
import type { NewWorkout, NewSet } from "~/server/db/schema";

const createWorkout = api.workout.createWorkout;
const createSet = api.workout.createSet;

export const handleCreateWorkout = async (workoutData: NewWorkout) => {
  await createWorkout.mutate({ ...workoutData });
};

export const handleCreateSet = async (setData: NewSet) => {
  await createSet.mutate({ ...setData });
};
