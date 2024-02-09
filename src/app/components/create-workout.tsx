"use client";

import { useState } from "react";
import { handleCreateWorkout, handleCreateSet } from "~/app/actions";
import type { NewWorkout } from "~/server/db/schema";

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
  { name: "Morning" },
  { name: "Afternoon" },
  { name: "Evening" },
  { name: "Night" },
];

export const CreateWorkout: React.FC<{ workoutData: NewWorkout }> = (props) => {
  const { workoutData } = props;

  const [name, setName] = useState<string>("");
  const [selectedWorkout, setSelectedWorkout] = useState(workouts[0]);

  const [timeOfDay, setTimeOfDay] = useState<Option | undefined>(
    timeOfDayOptions[0],
  );

  const handleSetSelected = (string: string) => {
    setSelectedWorkout(string);
  };

  const handleSetTimeOfDay = (option: Option) => {
    setTimeOfDay(option);
  };

  return (
    <div className="flex flex-col">
      <Input
        placeholder="Workout Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        className="text-black"
      />

      <Select
        options={timeOfDayOptions}
        selected={timeOfDay}
        setSelected={handleSetTimeOfDay}
      />

      <div className="mt-4 flex flex-col gap-y-1">
        <span>Select an Exercise</span>
        <ComboBox
          options={workouts}
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
