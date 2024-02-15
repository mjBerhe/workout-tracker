"use server";

import { api } from "~/trpc/server";
import type { NewWorkout, NewExercise, NewSet } from "~/server/db/schema";

const createWorkout = api.workout.createWorkout;
// const createSet = api.workout.createSet;

export const handleCreateWorkout = async (
  // workoutData: NewWorkout & { exercises: NewExercise & { sets: NewSet } },
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
      setNumber: string;
      weightAmount: string;
      weightUnit: string;
      repAmount: string;
    }[];
  }[],
) => {
  await createWorkout.mutate({ ...workoutData, exercises: [...exercises] });
};

// export const handleCreateSet = async (setData: NewSet) => {
//   await createSet.mutate({ ...setData });
// };
