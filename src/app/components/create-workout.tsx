"use client";

import { useMemo, useState } from "react";
import { handleCreateWorkout, handleCreateSet } from "~/app/actions";
import type { NewWorkout } from "~/server/db/schema";
import { exercises } from "~/const/exercises";

import { Input } from "~/app/components/input";
import { Select, type Option } from "~/app/components/basic/select";
import { ComboBox } from "./basic/combobox";

const workouts = [
  "Bench Press",
  "Deadlift",
  "Squat",
  "Lateral Raises",
  "Hamstring Curls",
];

const timeOfDayOptions: Option[] = [
  { name: "Morning", id: 0 },
  { name: "Afternoon", id: 1 },
  { name: "Evening", id: 2 },
  { name: "Night", id: 3 },
];

const workoutTypeOptions: Option[] = [
  { name: "Strength Training", id: 0 },
  { name: "Cardio", id: 1 },
];

const durationOptions: Option[] = [
  { name: "15 min" },
  { name: "30 min" },
  { name: "45 min" },
  { name: "60 min" },
  { name: "75 min" },
  { name: "90 min" },
  { name: ">90 min" },
];

export const CreateWorkout: React.FC<{ workoutData: NewWorkout }> = (props) => {
  const { workoutData } = props;

  const exercisesOptions = useMemo(
    () => exercises.filter((x) => x.category === "strength").map((x) => x.name),
    [exercises],
  );
  console.log(exercisesOptions.length);

  const [name, setName] = useState<string>("");
  const [selectedWorkout, setSelectedWorkout] = useState(workouts[0]);

  const [timeOfDay, setTimeOfDay] = useState<Option | undefined>(
    timeOfDayOptions[0],
  );

  const [workoutType, setWorkoutType] = useState<Option | undefined>(
    workoutTypeOptions[0],
  );

  const [duration, setDuration] = useState<Option | undefined>(
    durationOptions[0],
  );

  const handleSetSelected = (string: string) => {
    setSelectedWorkout(string);
  };

  const handleSetTimeOfDay = (option: Option) => {
    setTimeOfDay(option);
  };

  const handleSetWorkoutType = (option: Option) => {
    setWorkoutType(option);
  };

  const handleSetDuration = (option: Option) => {
    setDuration(option);
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm">Workout Name</span>
        <Input
          placeholder="Workout Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          className="text-black"
        />
      </div>

      <div className="flex gap-x-4">
        <div className="flex min-w-[200px] flex-col gap-1">
          <span className="text-sm">Type of Workout</span>
          <Select
            options={workoutTypeOptions}
            selected={workoutType}
            setSelected={handleSetWorkoutType}
          />
        </div>

        <div className="flex min-w-[150px] flex-col gap-1">
          <span className="text-sm">Time of Day</span>
          <Select
            options={timeOfDayOptions}
            selected={timeOfDay}
            setSelected={handleSetTimeOfDay}
          />
        </div>

        <div className="flex min-w-[130px] flex-col gap-1">
          <span className="text-sm">Duration</span>
          <Select
            options={durationOptions}
            selected={duration}
            setSelected={handleSetDuration}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm">Select an Exercise</span>
        <ComboBox
          options={exercisesOptions}
          selected={selectedWorkout}
          setSelected={handleSetSelected}
        />
      </div>

      {/* <button onClick={() => handleCreateWorkout(workoutData)}>
        Create Workout
      </button> */}

      {/* <button>Create Set</button> */}
    </div>
  );
};
