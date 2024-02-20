"use client";

import { useState, useEffect, useRef, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useHover } from "usehooks-ts";
import type dayjs from "dayjs";
import clsx from "clsx";
import { exercises } from "~/const/exercises";

import { Input } from "~/app/components/input";
import { Select, type Option } from "~/app/components/basic/select";
import { ComboBox } from "~/app/components/basic/combobox";
import { Button } from "~/app/components/basic/button";
import { ChevronRight, ChevronLeft, Plus } from "lucide-react";

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

export const CreateWorkoutModal: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  selectedDay?: dayjs.Dayjs;
  userId: string;
}> = ({ isOpen, closeModal, selectedDay, userId }) => {
  console.log(userId);

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

  if (!selectedDay) {
    return <div></div>;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/35" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-300 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-100"
                >
                  Add a Workout
                </Dialog.Title>
                <div className="mt-4 flex flex-col gap-1">
                  <span className="text-sm text-gray-100">Workout Name</span>
                  <Input
                    placeholder="Workout Name"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.currentTarget.value)}
                    className="text-black"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
