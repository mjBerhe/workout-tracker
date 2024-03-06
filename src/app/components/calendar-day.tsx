"use client";

import { useRef } from "react";
import { useHover } from "usehooks-ts";
import type dayjs from "dayjs";
import clsx from "clsx";
import type { Workout } from "~/server/db/schema";

import { Button } from "~/app/components/basic/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/components/basic/tooltip";
import { Plus } from "lucide-react";

const DAYS_OF_WEEK_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const CalendarDay: React.FC<{
  day: dayjs.Dayjs;
  emptyDays: number;
  index: number;
  selectDay: (day: dayjs.Dayjs) => void;
  selectWorkout: (day: dayjs.Dayjs, workout: Workout) => void;
  isSelected: boolean;
  isCondensed: boolean;
  selectedWorkout: Workout | null;
  workouts: Workout[];
}> = ({
  day,
  emptyDays,
  index,
  selectDay,
  selectWorkout,
  isSelected,
  isCondensed,
  selectedWorkout,
  workouts,
}) => {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  return (
    <div
      className={clsx(
        "flex flex-col items-center border-b-[1px] border-r-[1px] border-card p-3",
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
          <div className="flex h-1/2 w-full items-center justify-center gap-x-2">
            {workouts.map((x) => (
              <TooltipProvider key={x.id} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={clsx(
                        "h-3 w-3 cursor-pointer rounded-full",
                        selectedWorkout?.id === x.id
                          ? "bg-red-300"
                          : "bg-primary-600",
                      )}
                      onClick={() => selectWorkout(day, x)}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent className="border-none bg-dark-100 shadow-lg">
                    <div className="px-2 py-1">
                      <span>{x.name}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
