"use server";

import { api } from "~/trpc/server";
import type { NewWorkout, NewExercise, NewSet } from "~/server/db/schema";

const createWorkout = api.workout.createWorkout;

export const handleCreateWorkout = async (
  workoutData: {
    userId: string;
    name: string;
    time?: string;
    type?: string;
    duration?: string;
    specificName?: string;
    notes?: string;
    date: Date;
  },
  exercises: {
    name: string;
    sets: {
      setNumber: number;
      weightAmount: string;
      weightUnit: string;
      repAmount: string;
    }[];
  }[],
) => {
  return await createWorkout.mutate({
    ...workoutData,
    exercises: [...exercises],
  });
};
