"use client";

import { useState, useRef } from "react";
import { useHover } from "usehooks-ts";
import { api } from "~/trpc/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import clsx from "clsx";
import type { Exercise, Set, Workout } from "~/server/db/schema";

import { CalendarDay } from "./calendar-day";
import { CreateWorkout } from "~/app/components/create-workout";
import { EditWorkout } from "./edit-workout";
import { Button } from "~/app/components/basic/button";
import { ChevronRight, ChevronLeft, Plus } from "lucide-react";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_TO_NAME = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const borderColor = "border-card";

dayjs.extend(utc);

export type NewExercise = {
  id: number;
  name: string;
  sets: NewSet[];
};

export type NewSet = {
  id: number;
  setNumber: number;
  weightAmount: string | number;
  weightUnit: string;
  repAmount: string | number;
};

const isSameDay = (day1: dayjs.Dayjs, day2: dayjs.Dayjs) => {
  if (day1.utc().format("MM/DD/YYYY") === day2.utc().format("MM/DD/YYYY")) {
    return true;
  }
  return false;
};

const getDaysOfMonth = (currentDay: dayjs.Dayjs) => {
  const firstDOM = currentDay.startOf("month");
  const daysAmount = currentDay.daysInMonth();

  const days = Array(daysAmount)
    .fill(null)
    .map((_, i) => (i == 0 ? firstDOM : firstDOM.add(i, "day")));
  return days;
};

export const Calender: React.FC<{
  userId: string;
}> = ({ userId }) => {
  const getWorkoutsQuery = api.workout.getAllWorkouts.useQuery({
    userId: userId,
  });
  const currentWorkouts = getWorkoutsQuery.data?.workouts ?? [];

  const refetch = async () => {
    await getWorkoutsQuery.refetch();
  };

  const month = dayjs().month();
  const year = dayjs().year();

  const [currentMonth, setCurrentMonth] = useState<number>(month);
  const [currentYear, setCurrentYear] = useState<number>(year);
  const currentMonthName = MONTH_TO_NAME[currentMonth];

  const currentDay = dayjs()
    .set("month", currentMonth)
    .set("year", currentYear);

  const currentDaysOfMonth = getDaysOfMonth(currentDay);
  const emptyDays = currentDay.startOf("month").day();
  const fillerDays = 6 - currentDay.endOf("month").day();

  const rowAmount = emptyDays + currentDaysOfMonth.length > 35 ? 6 : 5;

  const handlePrevMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth((prev) => prev - 1);
    }
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth((prev) => prev + 1);
    }
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    }
  };

  const [showAddWorkout, setShowAddingWorkout] = useState<boolean>(false);
  const [showEditWorkout, setShowEditWorkout] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<NewExercise[]>([]);

  const handleSelectDay = (day: dayjs.Dayjs) => {
    if (!showEditWorkout) {
      if (!showAddWorkout) {
        setShowAddingWorkout(true);
      }
      setSelectedDay(day);
      setSelectedWorkout(null);
    }
  };

  const handleOpenWorkout = (day: dayjs.Dayjs, workout: Workout) => {
    setSelectedDay(day);
    setSelectedWorkout(workout);
    setExercises(workout.exercises);

    setShowAddingWorkout(false);
    setShowEditWorkout(true);
  };

  const handleCloseWorkout = () => {
    setSelectedDay(null);
    setSelectedWorkout(null);
    setExercises([]);

    setShowAddingWorkout(false);
    setShowEditWorkout(false);
  };

  const handleEditWorkout = (key: keyof Workout, value: string) => {
    setShowAddingWorkout(false);

    if (selectedWorkout) {
      const workout = selectedWorkout;
      setSelectedWorkout({ ...workout, [key]: value });
    }
  };

  const handleEditExercises = (exercises: NewExercise[]) => {
    setExercises(exercises);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="flex items-center gap-x-4">
          <div className="flex gap-x-2">
            <Button onClick={handlePrevMonth} variant={"icon"} size={"icon"}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button onClick={handleNextMonth} variant={"icon"} size={"icon"}>
              <ChevronRight className="ml-1" />
            </Button>
          </div>
          <div className="text-2xl font-semibold text-slate-200">
            <span>{currentMonthName}</span>
            <span> {currentYear}</span>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "mt-8 w-full",
          showAddWorkout || showEditWorkout ? "animate-flex-delay gap-x-8" : "",
        )}
      >
        <div
          className={clsx(
            "grid grid-cols-7 rounded-t-lg border-l-[1px] border-t-[1px] bg-dark-200/80 shadow-lg transition-all duration-1000",
            rowAmount === 5
              ? "grid-rows-[repeat(5,_1fr)]"
              : "grid-rows-[repeat(6,_1fr)]",
            borderColor,
            showAddWorkout || showEditWorkout
              ? "h-[400px] w-1/2"
              : "h-[750px] w-full",
          )}
        >
          {Array(emptyDays)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "flex flex-col items-center border-b-[1px] border-r-[1px] p-3",
                  borderColor,
                  showAddWorkout && "text-sm",
                )}
              >
                <span className="font-semibold text-primary-600">
                  {DAYS_OF_WEEK_SHORT[i]}
                </span>
              </div>
            ))}
          {currentDaysOfMonth.map((day, i) => (
            <CalendarDay
              key={day.date()}
              day={day}
              index={i}
              emptyDays={emptyDays}
              selectDay={handleSelectDay}
              selectWorkout={handleOpenWorkout}
              isSelected={selectedDay ? isSameDay(selectedDay, day) : false}
              isCondensed={showAddWorkout || showEditWorkout}
              selectedWorkout={selectedWorkout}
              workouts={currentWorkouts?.filter((x) =>
                isSameDay(dayjs(x.date), day),
              )}
            />
          ))}
          {Array(fillerDays)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "flex flex-col items-center border-b-[1px] border-r-[1px]",
                  borderColor,
                )}
              ></div>
            ))}
        </div>

        <div
          className={clsx(
            "flex rounded-lg border border-card bg-dark-200/80 px-7 py-5 shadow-lg",
            showAddWorkout ? "animate-fade-in-delay" : "hidden opacity-0",
          )}
        >
          <CreateWorkout
            userId={userId}
            closeWorkout={handleCloseWorkout}
            selectedDay={selectedDay}
            refetch={refetch}
          />
        </div>

        <div
          className={clsx(
            "flex rounded-lg border border-card bg-dark-200/80 px-7 py-5 shadow-lg",
            showEditWorkout && selectedWorkout
              ? "animate-fade-in-delay"
              : "hidden opacity-0",
          )}
        >
          {selectedWorkout && selectedDay && (
            <EditWorkout
              userId={userId}
              closeWorkout={handleCloseWorkout}
              selectedDay={selectedDay}
              selectedWorkout={selectedWorkout}
              handleEditWorkout={handleEditWorkout}
              selectedExercises={exercises}
              handleEditExercises={handleEditExercises}
              refetch={refetch}
            />
          )}
        </div>
      </div>
    </div>
  );
};
