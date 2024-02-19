"use client";

import { useState, useEffect, useRef } from "react";
import { useHover } from "usehooks-ts";
import dayjs from "dayjs";
import clsx from "clsx";

import { Button } from "./basic/button";
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

export const Calender: React.FC = () => {
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
          "mt-8 grid h-[750px] grid-cols-7 rounded-t-lg border-l-[1px] border-t-[1px] bg-dark-200 shadow-lg",
          rowAmount === 5
            ? "grid-rows-[repeat(5,_1fr)]"
            : "grid-rows-[repeat(6,_1fr)]",
          borderColor,
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
    </div>
  );
};

export const CalendarDay: React.FC<{
  day: dayjs.Dayjs;
  emptyDays: number;
  index: number;
}> = ({ day, emptyDays, index }) => {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);
  return (
    <div
      ref={hoverRef}
      className={clsx(
        "flex flex-col items-center border-b-[1px] border-r-[1px] p-3",
        borderColor,
        emptyDays + index === 6 ? "rounded-tr-lg" : "",
      )}
    >
      <span className="font-semibold text-primary-600">
        {day.date() < 8 - emptyDays && DAYS_OF_WEEK_SHORT[day.day()]}
      </span>
      <span className="mt-1 text-slate-300">{day.date()}</span>
      {isHover && (
        <div className={clsx("mt-2", isHover ? "animate-fade-in" : "")}>
          <Button variant={"icon-secondary"} size={"icon"}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
