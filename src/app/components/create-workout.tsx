"use client";

import { useMemo, useState } from "react";
import type dayjs from "dayjs";
import { handleCreateWorkout } from "~/app/actions";
import type { NewWorkout, NewSet } from "~/server/db/schema";
import { exercises } from "~/const/exercises";
import { X, ChevronDown } from "lucide-react";

import { Disclosure } from "@headlessui/react";
import { Input } from "~/app/components/input";
import { Select, type Option } from "~/app/components/basic/select";
import { ComboBox } from "~/app/components/basic/combobox";
import { Button } from "~/app/components/basic/button";

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
  sets: Set[];
};

type Set = {
  id: number;
  setNumber: string;
  weightAmount: string;
  weightUnit: string;
  repAmount: string;
};

const InputDarkClass = "bg-dark-400 text-slate-200";

const exerciseOptions = exercises
  .filter((x) => x.category === "strength")
  .map((x) => x.name);

export const CreateWorkout: React.FC<{
  userId: string;
  closeWorkout: () => void;
  selectedDay?: dayjs.Dayjs | null;
}> = ({ userId, closeWorkout, selectedDay }) => {
  const [workoutName, setWorkoutName] = useState<string>("");

  const [timeOfDay, setTimeOfDay] = useState<Option | undefined>(
    timeOfDayOptions[0],
  );

  const [workoutType, setWorkoutType] = useState<Option | undefined>(
    workoutTypeOptions[0],
  );

  const [duration, setDuration] = useState<Option | undefined>(
    durationOptions[3],
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
        userId: userId,
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
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-slate-100">
            New Workout
          </span>
          <span className="text-sm text-primary-600">
            {selectedDay?.format("MM/DD/YYYY")}
          </span>
        </div>

        <Button
          variant={"icon"}
          size={"icon"}
          onClick={closeWorkout}
          className="hover:bg-dark-300/80"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-4 grid-rows-4 items-center gap-x-10 gap-y-6">
        <div className="col-span-1">
          <span className="text-sm text-slate-200">Name</span>
        </div>
        <div className="col-span-3">
          <Input
            placeholder="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.currentTarget.value)}
            className={InputDarkClass}
          />
        </div>

        <div className="col-span-1">
          <span className="text-sm text-slate-200">Type</span>
        </div>
        <div className="col-span-3">
          <Select
            options={workoutTypeOptions}
            selected={workoutType}
            setSelected={handleSetWorkoutType}
          />
        </div>

        <div className="col-span-1">
          <span className="text-sm text-slate-200">Time of Day</span>
        </div>
        <div className="col-span-3">
          <Select
            options={timeOfDayOptions}
            selected={timeOfDay}
            setSelected={handleSetTimeOfDay}
          />
        </div>

        <div className="col-span-1">
          <span className="text-sm text-slate-200">Duration</span>
        </div>
        <div className="col-span-3">
          <Select
            options={durationOptions}
            selected={duration}
            setSelected={handleSetDuration}
          />
        </div>
      </div>

      {currentExercise && (
        <div className="mt-4">
          <NewExercise
            exerciseOptions={exerciseOptions}
            saveExercise={saveExercise}
          />
        </div>
      )}

      <hr className="mt-4 border-t border-dark-500" />

      <div className="mt-4 flex w-full justify-center">
        <Button
          disabled={currentExercise}
          variant={"ghost"}
          size="sm"
          className="h-auto"
          onClick={() => setCurrentExercise((prev) => !prev)}
        >
          Add Exercise
        </Button>
      </div>

      {/* <button onClick={createWorkout}>Create Workout</button> */}

      {/* <button>Create Set</button> */}
    </div>
  );
};

export const NewExercise: React.FC<{
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
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <div className="flex flex-col border-t border-dark-500 pt-4">
          <Disclosure.Button className="flex items-center justify-between">
            <span>Exercise</span>
            <ChevronDown
              className={`${open && "rotate-180 transform"}h-5 w-5`}
            />
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="mt-3 flex">
              <ComboBox
                options={exerciseOptions}
                selected={selectedExercise}
                setSelected={handleSetExercise}
              />
            </div>

            <div className="mt-3 flex flex-col gap-y-2">
              {setInfo.map((set, i) => (
                <div
                  key={set.id}
                  className="flex items-center justify-start px-8 text-slate-200"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-400/80 text-sm text-white">
                    {i + 1}
                  </div>
                  <div className="ml-4 flex items-center gap-x-2">
                    <Input
                      type="number"
                      className="h-[30px] w-[80px] bg-dark-400 text-slate-200"
                      value={setInfo.find((x) => x.id === set.id)?.weightAmount}
                      onChange={(val) =>
                        handleChangeSet(
                          set.id,
                          "weightAmount",
                          val.currentTarget.value,
                        )
                      }
                    />
                    <span className="text-sm">lbs</span>
                  </div>
                  <div className="ml-4 flex items-center gap-x-2">
                    <Input
                      type="number"
                      className="h-[30px] w-[80px] bg-dark-400 text-slate-200"
                      onChange={(val) =>
                        handleChangeSet(
                          set.id,
                          "repAmount",
                          val.currentTarget.value,
                        )
                      }
                    />
                    <span className="text-sm">reps</span>
                  </div>

                  <div className="ml-auto flex">
                    <Button
                      onClick={() =>
                        setSetInfo((prev) =>
                          prev.length > 1
                            ? [...prev.filter((x) => x.id !== set.id)]
                            : prev,
                        )
                      }
                      variant={"icon"}
                      size={"icon"}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="mt-1 flex w-full justify-center">
                <Button
                  variant={"ghost"}
                  size="sm"
                  className="h-auto"
                  onClick={handleAddSet}
                >
                  Add Set
                </Button>
              </div>

              {/* <div className="mt-2 flex w-full gap-x-8">
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
              </div> */}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};
