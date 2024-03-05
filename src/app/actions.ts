"use server";

import { api } from "~/trpc/react";
import type { NewWorkout, NewExercise, NewSet } from "~/server/db/schema";
import { create } from "domain";

// const createWorkout = api.workout.createWorkout;
const createWorkout = api.workout.createWorkout.useMutation();

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
  const mutation = createWorkout.mutate({
    ...workoutData,
    exercises: [...exercises],
  });
  return createWorkout.data;
};
