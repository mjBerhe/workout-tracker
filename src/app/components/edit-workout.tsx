"use client";

import { useState, useRef, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import dayjs from "dayjs";
import { X, Redo, ChevronRight } from "lucide-react";
import { Disclosure, Transition } from "@headlessui/react";

import { Workout } from "~/server/db/schema";
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
  { name: "> 90 min" },
];

type NewExercise = {
  id: number;
  name: string;
  sets: NewSet[];
};

type NewSet = {
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

const exerciseOptions = exercises
  .filter((x) => x.category === "strength")
  .map((x) => x.name);

export const EditWorkout: React.FC<{
  userId: string;
  closeWorkout: () => void;
  selectedDay?: dayjs.Dayjs | null;
  selectedWorkout: Workout;
}> = ({ userId, closeWorkout, selectedDay, selectedWorkout }) => {
  console.log(selectedWorkout);
  const [workoutName, setWorkoutName] = useState<string>(
    selectedWorkout?.name ?? "",
  );

  const [workoutType, setWorkoutType] = useState<Option | undefined>(
    selectedWorkout?.type
      ? workoutTypeOptions.find((x) => x.name === selectedWorkout.type)
      : workoutTypeOptions[0],
  );

  const [timeOfDay, setTimeOfDay] = useState<Option | undefined>(
    selectedWorkout?.time
      ? timeOfDayOptions.find((x) => x.name === selectedWorkout.time)
      : timeOfDayOptions[0],
  );

  const [duration, setDuration] = useState<Option | undefined>(
    selectedWorkout?.duration
      ? durationOptions.find((x) => x.name === selectedWorkout.duration)
      : durationOptions[3],
  );

  const [exercises, setExercises] = useState<NewExercise[]>([
    ...selectedWorkout.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      sets: [
        ...ex.sets.map((set) => ({
          id: set.id,
          setNumber: set.setNumber,
          weightAmount: set.weightAmount.toString(),
          weightUnit: set.weightUnit,
          repAmount: set.repAmount.toString(),
        })),
      ],
    })),
  ]);

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
    if (
      key === "sets" &&
      typeof setId === "number" &&
      setKey &&
      setValue !== undefined
    ) {
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

  // TODO: need to deal with exercise type diffential
  const addOrRemoveSet = (
    exerciseId: number,
    type: "add" | "remove",
    setId?: number,
  ) => {
    const exercise = exercises.find((x) => x.id === exerciseId);
    let newSetInfo: NewSet[] = [];
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

  // when submitting edit workout
  const editWorkout = async () => {
    console.log("editing");
  };

  // const createWorkout = async () => {
  //   const response = await handleCreateWorkout(
  //     {
  //       userId: userId,
  //       name: workoutName,
  //       time: timeOfDay?.name,
  //       type: workoutType?.name,
  //       duration: duration?.name,
  //       date: new Date(),
  //     },
  //     [
  //       ...exercises.map((ex) => ({
  //         ...ex,
  //         sets: [...ex.sets.map((set, i) => ({ ...set, setNumber: i }))],
  //       })),
  //     ],
  //   );
  //   if (response.status === "success") {
  //     closeWorkout();
  //   }
  //   console.log(response.status);
  // };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-slate-100">
            {selectedWorkout ? "Edit Workout" : "Add Workout"}
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

      <div
        className="mt-6 divide-y divide-card border-b border-card"
        ref={parent}
      >
        {exercises.map((exercise) => (
          <div key={exercise.id} className="">
            <EditExercise
              exercise={exercise}
              exerciseOptions={exerciseOptions}
              removeExercise={removeExercise}
              updateExercise={updateExercise}
              addOrRemoveSet={addOrRemoveSet}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex w-full justify-evenly">
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
          onClick={editWorkout}
        >
          Save Workout
        </Button>
      </div>
    </div>
  );
};

export const EditExercise: React.FC<{
  exercise: NewExercise;
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

  const [parent] = useAutoAnimate(/* optional config */);
  const [parent2] = useAutoAnimate(/* optional config */);
  const [isSelectingExericse, setIsSelectingExercise] =
    useState<boolean>(false);

  const handleUpdateExercise = (exerciseName: string) => {
    if (isSelectingExericse === true) {
      setIsSelectingExercise(false);
    }
    typeof id === "number" && updateExercise(id, "name", exerciseName);
  };

  const handleResetExercise = () => {
    setIsSelectingExercise(true);
  };

  return (
    <div className="">
      {isSelectingExericse ? (
        <div className="my-2">
          <ComboBox
            options={exerciseOptions}
            selected={name ? name : ""}
            setSelected={handleUpdateExercise}
            placeholder="Search Exercise"
          />
        </div>
      ) : (
        <Disclosure defaultOpen={false}>
          {({ open }) => (
            <div className="flex flex-col overflow-hidden" ref={parent2}>
              <div className="flex w-full items-center gap-x-2 bg-dark-100/50 px-3 py-2">
                <Disclosure.Button className="flex gap-x-2">
                  <ChevronRight
                    className={`${open && "rotate-[90deg]"} h-5 w-5 transform text-slate-200 transition-all duration-75`}
                  />
                  <span className="text-sm">{name ? name : "Exercise"}</span>
                </Disclosure.Button>

                <div className="ml-auto">
                  <Button
                    onClick={() => handleResetExercise()}
                    variant={"icon"}
                    size={"icon-sm"}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => removeExercise(id)}
                    variant={"icon"}
                    size={"icon-sm"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Disclosure.Panel className="flex flex-col border-l border-r border-card py-4">
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
                          className="h-[30px] w-[80px]"
                          value={set.weightAmount ?? 0}
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
                          className="h-[30px] w-[80px]"
                          value={set.repAmount ?? 0}
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
            </div>
          )}
        </Disclosure>
      )}
    </div>
  );
};
