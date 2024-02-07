"use client";

import { handleCreateWorkout } from "~/app/actions";
import type { NewWorkout } from "~/server/db/schema";

export const CreateWorkoutButton: React.FC<{ workoutData: NewWorkout }> = (
  props,
) => {
  const { workoutData } = props;
  return (
    <button onClick={() => handleCreateWorkout(workoutData)}>
      Create Workout
    </button>
  );
};
