"use client";

import { useState, useRef } from "react";
import { useHover } from "usehooks-ts";
import { api } from "~/trpc/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import clsx from "clsx";
import type { Exercise, Set, Workout } from "~/server/db/schema";

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
  const { data } = api.workout.getAllWorkouts.useQuery(
    { userId: userId },
    { refetchOnMount: true },
  );
  const currentWorkouts = data?.workouts ?? [];

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
    setShowEditWorkout(true);
  };

  const handleCloseWorkout = () => {
    setSelectedDay(null);
    setSelectedWorkout(null);
    setShowAddingWorkout(false);
    setShowEditWorkout(false);
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
          {selectedWorkout && (
            <EditWorkout
              userId={userId}
              closeWorkout={handleCloseWorkout}
              selectedDay={selectedDay}
              selectedWorkout={selectedWorkout}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const CalendarDay: React.FC<{
  day: dayjs.Dayjs;
  emptyDays: number;
  index: number;
  selectDay: (day: dayjs.Dayjs) => void;
  selectWorkout: (day: dayjs.Dayjs, workout: Workout) => void;
  isSelected: boolean;
  isCondensed: boolean;
  workouts: Workout[];
}> = ({
  day,
  emptyDays,
  index,
  selectDay,
  selectWorkout,
  isSelected,
  isCondensed,
  workouts,
}) => {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  return (
    <div
      className={clsx(
        "flex flex-col items-center border-b-[1px] border-r-[1px] p-3",
        borderColor,
        emptyDays + index === 6 ? "rounded-tr-lg" : "",
        isCondensed && "cursor-pointer text-sm",
        isCondensed && isSelected && "bg-primary-500/70",
        isCondensed && !isSelected && " hover:bg-dark-100/30",
      )}
      onClick={() => isCondensed && selectDay(day)}
    >
      <span className="font-semibold text-primary-600">
        {day.date() < 8 - emptyDays && DAYS_OF_WEEK_SHORT[day.day()]}
      </span>
      <div
        className="mt-1 cursor-pointer text-slate-300"
        onClick={() => selectDay(day)}
      >
        {day.date()}
      </div>
      <div className="flex h-full w-full flex-col">
        {workouts?.length > 0 && (
          <div className="flex h-1/2 w-full items-center justify-center">
            {workouts.map((x) => (
              <div
                key={x.id}
                className="h-3 w-3 cursor-pointer rounded-full bg-white"
                onClick={() => selectWorkout(day, x)}
              ></div>
            ))}
          </div>
        )}

        <div className="h-full w-full" ref={hoverRef}>
          {isHover && !isCondensed && (
            <div
              className={clsx(
                "flex h-full items-center justify-center",
                isHover ? "animate-fade-in" : "animate-fade-out",
              )}
            >
              <Button
                variant={"icon-secondary"}
                size={"icon"}
                onClick={() => selectDay(day)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
