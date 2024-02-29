"use client";

import { useState, useRef, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import dayjs from "dayjs";
import { X, ChevronDown } from "lucide-react";
import { Disclosure, Transition } from "@headlessui/react";

import { type NewWorkout, type NewSet, exercise } from "~/server/db/schema";
import { handleCreateWorkout } from "~/app/actions";
import { exercises } from "~/const/exercises";

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
  id: number;
  name: string;
  sets: Set[];
};

type Set = {
  id: number;
  setNumber: number;
  weightAmount: string;
  weightUnit: string;
  repAmount: string;
};

const newSetTemplate = {
  setNumber: 0,
  weightAmount: "",
  repAmount: "",
  weightUnit: "lbs",
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

  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const addNewExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: dayjs().valueOf(),
        name: "",
        sets: [
          {
            id: dayjs().valueOf(),
            ...newSetTemplate,
          },
        ],
      },
    ]);
  };

  const removeExercise = (exerciseId: number) => {
    if (exercises.length > 1) {
      setExercises((prev) => [...prev.filter((x) => x.id !== exerciseId)]);
    }
  };

  const updateExercise = (
    exerciseId: number,
    key: string,
    value: string,
    setId?: number,
    setKey?: string,
    setValue?: string,
  ) => {
    if (key === "name") {
      const newExercises = exercises.map((x) =>
        x.id === exerciseId ? { ...x, [key]: value } : { ...x },
      );
      setExercises(newExercises);
    }
    if (key === "sets" && typeof setId === "number" && setKey && setValue) {
      const exercise = exercises.find((x) => x.id === exerciseId);
      if (exercise) {
        const newSetInfo = exercise?.sets.map((y) =>
          y.id === setId ? { ...y, [setKey]: setValue } : y,
        );
        const newExercise = { ...exercise, sets: newSetInfo };
        const newExercises = exercises.map((z) =>
          z.id === exerciseId ? { ...newExercise } : z,
        );
        setExercises(newExercises);
      }
    }
  };

  // need to fix issue with set ids being the same, need a running count
  const addOrRemoveSet = (
    exerciseId: number,
    type: "add" | "remove",
    setId?: number,
  ) => {
    const exercise = exercises.find((x) => x.id === exerciseId);
    let newSetInfo: Set[] = [];
    if (exercise) {
      if (type === "add") {
        newSetInfo = [
          ...exercise.sets,
          { id: dayjs().valueOf(), ...newSetTemplate },
        ];
      }
      if (type === "remove" && typeof setId === "number") {
        if (exercise.sets.length > 1) {
          newSetInfo = [...exercise.sets.filter((x) => x.id !== setId)];
        } else {
          newSetInfo = [...exercise.sets];
        }
      }
      const newExercise = { ...exercise, sets: [...newSetInfo] };
      const newExercises = exercises.map((z) =>
        z.id === exerciseId ? { ...newExercise } : z,
      );
      setExercises(newExercises);
    }
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
      [
        ...exercises.map((ex) => ({
          ...ex,
          sets: [...ex.sets.map((set, i) => ({ ...set, setNumber: i }))],
        })),
      ],
    );
    if (response.status === "success") {
      closeWorkout();
    }
    console.log(response.status);
  };

  return (
    <div className="flex flex-col" ref={parent}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-slate-100">
            Add Workout
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

      <div className="mt-4 grid grid-cols-4 grid-rows-4 items-center gap-x-10 gap-y-6">
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
            setSelected={(e) => setWorkoutType(e)}
          />
        </div>

        <div className="col-span-1">
          <span className="text-sm text-slate-200">Time of Day</span>
        </div>
        <div className="col-span-3">
          <Select
            options={timeOfDayOptions}
            selected={timeOfDay}
            setSelected={(e) => setTimeOfDay(e)}
          />
        </div>

        <div className="col-span-1">
          <span className="text-sm text-slate-200">Duration</span>
        </div>
        <div className="col-span-3">
          <Select
            options={durationOptions}
            selected={duration}
            setSelected={(e) => setDuration(e)}
          />
        </div>
      </div>

      {exercises.map((exercise) => (
        <div key={exercise.id} className="mt-4">
          <NewExercise
            exercise={exercise}
            exerciseOptions={exerciseOptions}
            removeExercise={removeExercise}
            updateExercise={updateExercise}
            addOrRemoveSet={addOrRemoveSet}
          />
        </div>
      ))}

      <hr className="mt-4 border-t border-dark-500" />

      <div className="mt-3 flex w-full justify-evenly">
        <Button
          variant={"ghost"}
          size="sm"
          className="h-auto"
          onClick={addNewExercise}
        >
          Add Exercise
        </Button>
        <Button
          variant={"ghost"}
          size="sm"
          className="h-auto"
          onClick={createWorkout}
        >
          Save Workout
        </Button>
      </div>
    </div>
  );
};

export const NewExercise: React.FC<{
  exercise: Exercise;
  exerciseOptions: string[];
  removeExercise: (exerciseId: number) => void;
  updateExercise: (
    exerciseId: number,
    key: string,
    value: string,
    setId?: number,
    setKey?: string,
    setValue?: string,
  ) => void;
  addOrRemoveSet: (
    exerciseId: number,
    type: "add" | "remove",
    setId?: number,
  ) => void;
}> = ({
  exercise,
  exerciseOptions,
  removeExercise,
  updateExercise,
  addOrRemoveSet,
}) => {
  const { id, name, sets } = exercise;

  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const [isSelectingExericse, setIsSelectingExercise] = useState<boolean>(true);

  const handleUpdateExercise = (exerciseName: string) => {
    if (isSelectingExericse === true) {
      setIsSelectingExercise(false);
    }
    typeof id === "number" && updateExercise(id, "name", exerciseName);
  };

  return (
    <div className="pt-2">
      {isSelectingExericse ? (
        <ComboBox
          options={exerciseOptions}
          selected={name ? name : "Search Exercise"}
          setSelected={handleUpdateExercise}
        />
      ) : (
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <div className="flex flex-col overflow-hidden rounded-lg">
              <div className="flex w-full items-center gap-x-2 bg-dark-400 px-3 py-2">
                <Disclosure.Button>
                  <ChevronDown
                    className={`${open && "rotate-180"} h-5 w-5 transform text-slate-200 transition-all duration-75`}
                  />
                </Disclosure.Button>
                <div>{name ? name : "Exercise"}</div>
                {/* <Disclosure.Button className="flex w-full items-center justify-between rounded-lg border border-primary-600 px-3 py-2 hover:bg-primary-600/5">
                  <span className="font-normal text-slate-200">
                    {name ? name : "Exercise"}
                  </span>
                  <ChevronDown
                    className={`${open && "rotate-180"} h-5 w-5 transform text-slate-200 transition-all duration-75`}
                  />
                </Disclosure.Button>
                <div className="ml-4">
                  <Button
                    onClick={() => removeExercise(id)}
                    variant={"icon"}
                    size={"icon"}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div> */}
              </div>

              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="mt-4 flex flex-col">
                  <div className="flex flex-col gap-y-2" ref={parent}>
                    {sets.map((set, i) => (
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
                            value={set.weightAmount}
                            onChange={(val) =>
                              updateExercise(
                                id,
                                "sets",
                                "",
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
                            value={set.repAmount}
                            onChange={(val) =>
                              updateExercise(
                                id,
                                "sets",
                                "",
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
                            onClick={() => addOrRemoveSet(id, "remove", set.id)}
                            variant={"icon"}
                            size={"icon"}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex w-full justify-center">
                    <Button
                      variant={"ghost"}
                      size="sm"
                      className="h-auto"
                      onClick={() => addOrRemoveSet(id, "add")}
                    >
                      Add Set
                    </Button>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
      )}
    </div>
  );
};
