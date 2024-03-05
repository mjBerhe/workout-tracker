"use client";

import { Fragment, useState } from "react";
import { cn } from "~/app/lib/utils";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import fuzzysort from "fuzzysort";

export const ComboBox: React.FC<{
  className?: string;
  placeholder?: string;
  options: string[];
  selected: string | undefined;
  setSelected: (string: string) => void;
}> = (props) => {
  const { options, selected, setSelected } = props;
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options.slice(0, 100)
      : fuzzysort.go(query, [...options], { limit: 50 }).map((x) => x.target);

  return (
    <div className="w-full">
      <Combobox value={selected} onChange={setSelected} nullable as={"div"}>
        <div className="relative">
          <div
            className={cn(
              "relative cursor-default overflow-hidden rounded-lg border-none text-left shadow-md sm:text-sm",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300",
            )}
          >
            <Combobox.Button className="w-full">
              {({ open }) => (
                <Combobox.Input
                  className="w-full border-none bg-dark-100/60 py-2 pl-3 pr-10 text-sm leading-5 text-slate-100 focus:ring-0"
                  // displayValue={(option) => option}
                  onChange={(event) => setQuery(event.target.value)}
                  onClick={(e) => {
                    if (open) e.stopPropagation();
                  }}
                  placeholder={props.placeholder}
                />
              )}
            </Combobox.Button>

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
            <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-card bg-dark-100 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option}
                    className={({ active }) =>
                      `relative cursor-default select-none px-4 py-2 ${
                        active
                          ? "bg-primary-600/50 text-white"
                          : "text-slate-200"
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
