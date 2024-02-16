"use client";

import { useMemo, useState } from "react";
import { handleCreateWorkout } from "~/app/actions";
import type { NewWorkout, NewSet } from "~/server/db/schema";
import { exercises } from "~/const/exercises";

import { Input } from "~/app/components/input";
import { Select, type Option } from "~/app/components/basic/select";
import { ComboBox } from "./basic/combobox";
import { Button } from "./basic/button";

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

type Exercise = {
  name: string;
  // force: string;
  // level: string;
  // mechanic: string;
  // equipment: string;
  // primaryMuscles: string[];
  // secondaryMuscles: string[];
  // instructions: string;
  // category: string;
  // images: string[];
  // id: string | number;
  sets: Set[];
};

type Set = {
  id: number;
  setNumber: string;
  weightAmount: string;
  weightUnit: string;
  repAmount: string;
};

export const CreateWorkout: React.FC<{ userId: string }> = (props) => {
  const exerciseOptions = useMemo(
    () => exercises.filter((x) => x.category === "strength").map((x) => x.name),
    [exercises],
  );

  const [workoutName, setWorkoutName] = useState<string>("");

  const [timeOfDay, setTimeOfDay] = useState<Option | undefined>(
    timeOfDayOptions[0],
  );

  const [workoutType, setWorkoutType] = useState<Option | undefined>(
    workoutTypeOptions[0],
  );

  const [duration, setDuration] = useState<Option | undefined>(
    durationOptions[0],
  );

  const [currentExercise, setCurrentExercise] = useState<boolean>(false);

  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  const handleSetTimeOfDay = (option: Option) => {
    setTimeOfDay(option);
  };

  const handleSetWorkoutType = (option: Option) => {
    setWorkoutType(option);
  };

  const handleSetDuration = (option: Option) => {
    setDuration(option);
  };

  const saveExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => [...prev, exercise]);
  };

  const createWorkout = async () => {
    const response = await handleCreateWorkout(
      {
        userId: props.userId,
        name: workoutName,
        time: timeOfDay?.name,
        type: workoutType?.name,
        duration: duration?.name,
        date: new Date(),
      },
      [...selectedExercises],
    );
    console.log(response.status);
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm">Workout Name</span>
        <Input
          placeholder="Workout Name"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.currentTarget.value)}
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

      <div className="mt-4">
        <Button
          disabled={currentExercise}
          variant={"secondary"}
          className="w-full"
          onClick={() => setCurrentExercise((prev) => !prev)}
        >
          Add Exercise
        </Button>

        <div className="mt-6">
          {currentExercise && (
            <AddExercise
              exerciseOptions={exerciseOptions}
              saveExercise={saveExercise}
            />
          )}
        </div>
      </div>

      <button onClick={createWorkout}>Create Workout</button>

      {/* <button>Create Set</button> */}
    </div>
  );
};

export const AddExercise: React.FC<{
  exerciseOptions: string[];
  saveExercise: (exercise: Exercise) => void;
}> = (props) => {
  const { exerciseOptions, saveExercise } = props;

  const [selectedExercise, setSelectedExercise] =
    useState<string>("Select an Exercise");
  const [currentSetId, setCurrentSetId] = useState(0);
  const [setInfo, setSetInfo] = useState<Set[]>([
    {
      id: 0,
      setNumber: "",
      weightAmount: "",
      repAmount: "",
      weightUnit: "lbs",
    },
  ]);

  const handleSetExercise = (exercise: string) => {
    setSelectedExercise(exercise);
  };

  const handleChangeSet = (id: number, key: string, value: string) => {
    const newSetInfo = setInfo.map((x) =>
      x.id === id ? { ...x, [key]: value } : x,
    );
    setSetInfo(newSetInfo);
  };

  const handleAddSet = () => {
    const newSetId = currentSetId + 1;
    setSetInfo((prev) => [
      ...prev,
      {
        id: newSetId,
        setNumber: "",
        weightAmount: "",
        repAmount: "",
        weightUnit: "lbs",
      },
    ]);
    setCurrentSetId(newSetId);
  };

  const handleSaveExercise = () => {
    const exercise = {
      name: selectedExercise,
      sets: [...setInfo.map((set, i) => ({ ...set, setNumber: i.toString() }))],
    };
    saveExercise(exercise);
  };

  return (
    <div className="flex flex-col">
      <ComboBox
        options={exerciseOptions}
        selected={selectedExercise}
        setSelected={handleSetExercise}
      />

      <div className="mt-2 flex flex-col gap-y-4">
        <div className="grid grid-cols-4 justify-items-center">
          <div className="">Set</div>
          <div>lbs </div>
          <div>Reps</div>
          <div></div>
        </div>
        {setInfo.map((set, i) => (
          <div
            key={set.id}
            className="grid grid-cols-4 items-center justify-items-center"
          >
            <div>{i + 1}</div>
            <div className="">
              <Input
                type="number"
                className="h-[30px] w-[100px] text-black"
                value={setInfo.find((x) => x.id === set.id)?.weightAmount}
                onChange={(val) =>
                  handleChangeSet(
                    set.id,
                    "weightAmount",
                    val.currentTarget.value,
                  )
                }
              />
            </div>
            <div>
              <Input
                type="number"
                className="h-[30px] w-[100px] text-black"
                onChange={(val) =>
                  handleChangeSet(set.id, "repAmount", val.currentTarget.value)
                }
              />
            </div>
            <div>
              <Button
                onClick={() =>
                  setSetInfo((prev) =>
                    prev.length > 1
                      ? [...prev.filter((x) => x.id !== set.id)]
                      : prev,
                  )
                }
                // className="flex h-full p-2 text-sm"
                size={"icon"}
              >
                X
              </Button>
            </div>
          </div>
        ))}
        <div className="mt-2 flex w-full gap-x-8">
          <Button
            variant={"secondary"}
            className="w-1/2"
            onClick={() => handleAddSet()}
          >
            Add Set
          </Button>
          <Button className="w-1/2" onClick={handleSaveExercise}>
            Complete Exercise
          </Button>
        </div>
      </div>
    </div>
  );
};
