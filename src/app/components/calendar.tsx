"use client";

import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import clsx from "clsx";
import { Button } from "./basic/button";
// import { locale } from "dayjs";

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

  const borderColor = "border-dark-400";

  return (
    <div className="flex flex-col">
      <div>
        <span className="text-2xl">
          {currentMonthName} {currentYear}
        </span>
        <div className="flex gap-x-4">
          <Button onClick={handlePrevMonth}>Prev</Button>
          <Button onClick={handleNextMonth}>Next</Button>
        </div>
      </div>

      <div
        className={clsx(
          "bg-dark-200 mt-8 grid h-[750px] grid-cols-7 rounded-t-lg border-l-[1px] border-t-[1px] shadow-lg",
          `grid-rows-[repeat(${rowAmount},_1fr)]`,
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
              <span className="text-primary-600 font-semibold">
                {DAYS_OF_WEEK_SHORT[i]}
              </span>
            </div>
          ))}
        {currentDaysOfMonth.map((day, i) => (
          <div
            key={day.date()}
            className={clsx(
              "flex flex-col items-center border-b-[1px] border-r-[1px] p-3",
              borderColor,
              emptyDays + i === 6 ? "rounded-tr-lg" : "",
            )}
          >
            <span className="text-primary-600 font-semibold">
              {day.date() < 8 - emptyDays && DAYS_OF_WEEK_SHORT[day.day()]}
            </span>
            <span className="mt-2">{day.date()}</span>
          </div>
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
