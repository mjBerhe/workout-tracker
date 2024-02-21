"use client";

import { useState, useRef, Fragment } from "react";
import { useHover } from "usehooks-ts";
import dayjs from "dayjs";
import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";

import { CreateWorkout } from "./create-workout";
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

const borderColor = "border-dark-400";

export const Calender: React.FC<{ userId: string }> = ({ userId }) => {
  const month = dayjs().month();
  const year = dayjs().year();

  const [currentMonth, setCurrentMonth] = useState<number>(month);
  const [currentYear, setCurrentYear] = useState<number>(year);
  const currentMonthName = MONTH_TO_NAME[currentMonth];

  const currentDay = dayjs()
    .set("month", currentMonth)
    .set("year", currentYear);

  const getDaysOfMonth = () => {
    const firstDOM = currentDay.startOf("month");
    const daysAmount = currentDay.daysInMonth();

    const days = Array(daysAmount)
      .fill(null)
      .map((_, i) => (i == 0 ? firstDOM : firstDOM.add(i, "day")));
    return days;
  };

  const currentDaysOfMonth = getDaysOfMonth();
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
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs | null>(null);

  const handleSelectDay = (day: dayjs.Dayjs) => {
    if (!showAddWorkout) {
      setShowAddingWorkout(true);
    }
    setSelectedDay(day);
  };

  const handleCloseWorkout = () => {
    setSelectedDay(null);
    setShowAddingWorkout(false);
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="flex gap-x-2">
          <Button onClick={handlePrevMonth} variant={"icon"} size={"icon"}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button onClick={handleNextMonth} variant={"icon"} size={"icon"}>
            <ChevronRight className="ml-1" />
          </Button>
        </div>
        <div className="ml-4 text-2xl font-semibold text-slate-200">
          <span>{currentMonthName}</span>
          <span> {currentYear}</span>
        </div>
      </div>

      <div
        className={clsx(
          "mt-8 w-full",
          showAddWorkout ? "animate-flex-delay gap-x-8" : "",
        )}
      >
        <div
          className={clsx(
            "grid grid-cols-7 rounded-t-lg border-l-[1px] border-t-[1px] bg-dark-200 shadow-lg",
            rowAmount === 5
              ? "grid-rows-[repeat(5,_1fr)]"
              : "grid-rows-[repeat(6,_1fr)]",
            borderColor,
            showAddWorkout
              ? "h-[400px] w-[500px] transition-all duration-1000"
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
              isSelected={
                selectedDay?.date() === day.date() &&
                selectedDay.month() === day.month()
              }
              isCondensed={showAddWorkout}
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
            "fixed ml-[532px]",
            showAddWorkout ? "animate-fade-in-delay" : "hidden opacity-0",
          )}
        >
          <div className="flex rounded-lg border border-dark-400 bg-dark-200 px-7 py-5 shadow-lg">
            <CreateWorkout
              userId={userId}
              closeWorkout={handleCloseWorkout}
              selectedDay={selectedDay}
            />
          </div>
        </div>
      </div>

      {/* <CreateWorkoutModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        selectedDay={selectedDay}
        userId={userId}
      /> */}
    </div>
  );
};

export const CalendarDay: React.FC<{
  day: dayjs.Dayjs;
  emptyDays: number;
  index: number;
  selectDay: (day: dayjs.Dayjs) => void;
  isSelected: boolean;
  isCondensed: boolean;
}> = ({ day, emptyDays, index, selectDay, isSelected, isCondensed }) => {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  return (
    <div
      ref={hoverRef}
      className={clsx(
        "flex flex-col items-center border-b-[1px] border-r-[1px] p-3",
        borderColor,
        emptyDays + index === 6 ? "rounded-tr-lg" : "",
        isCondensed && "cursor-pointer text-sm hover:bg-primary-400",
        isSelected && "bg-primary-400/80",
      )}
      onClick={() => isCondensed && selectDay(day)}
    >
      <span className="font-semibold text-primary-600">
        {day.date() < 8 - emptyDays && DAYS_OF_WEEK_SHORT[day.day()]}
      </span>
      <span className="mt-1 text-slate-300">{day.date()}</span>
      {isHover && !isCondensed && (
        <div className={clsx("mt-2", isHover ? "animate-fade-in" : "")}>
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
  );
};
