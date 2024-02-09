"use client";

import { useState, Fragment } from "react";
import { handleCreateWorkout, handleCreateSet } from "~/app/actions";
import type { NewWorkout } from "~/server/db/schema";

import { Input } from "~/app/components/input";
import { Combobox, Transition, Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const workouts = [
  "Bench Press",
  "Deadlift",
  "Squat",
  "Lateral Raises",
  "Hamstring Curls",
];

const timeOfDayOptions: Option[] = [
  { name: "Morning" },
  { name: "Afternoon" },
  { name: "Evening" },
  { name: "Night" },
];

export const CreateWorkout: React.FC<{ workoutData: NewWorkout }> = (props) => {
  const { workoutData } = props;

  const [name, setName] = useState<string>("");
  const [selectedWorkout, setSelectedWorkout] = useState(workouts[0]);

  const [timeOfDay, setTimeOfDay] = useState<Option | undefined>(
    timeOfDayOptions[0],
  );

  const handleSetSelected = (string: string) => {
    setSelectedWorkout(string);
  };

  const handleSetTimeOfDay = (option: Option) => {
    setTimeOfDay(option);
  };

  return (
    <div className="flex flex-col">
      <Input
        placeholder="Workout Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        className="text-black"
      />

      <Select
        options={timeOfDayOptions}
        selected={timeOfDay}
        setSelected={handleSetTimeOfDay}
      />

      <div className="mt-4 flex flex-col gap-y-1">
        <span>Select an Exercise</span>
        <ComboBox
          options={workouts}
          selected={selectedWorkout}
          setSelected={handleSetSelected}
        />
      </div>

      {/* <button onClick={() => handleCreateWorkout(workoutData)}>
        Create Workout
      </button> */}

      {/* <button>Create Set</button> */}
    </div>
  );
};

type Option = {
  name: string;
};

export const Select: React.FC<{
  options: Option[];
  selected: Option | undefined;
  setSelected: (option: Option) => void;
}> = (props) => {
  const { options, selected, setSelected } = props;

  return (
    <div className="fixed top-16 w-72">
      <Listbox value={selected} onChange={(v) => setSelected(v)}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate text-black">{selected?.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {options.map((option, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

const ComboBox: React.FC<{
  options: string[];
  selected: string | undefined;
  setSelected: (string: string) => void;
}> = (props) => {
  const { options, selected, setSelected } = props;
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <div className=" top-16 w-72">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              // displayValue={(option) => option}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
