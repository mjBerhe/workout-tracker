"use client";

import { Fragment } from "react";
import { cn } from "~/app/lib/utils";
import { Combobox, Transition, Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export type Option = {
  name: string;
  id?: number;
};

export const Select: React.FC<{
  options: Option[];
  selected: Option | undefined;
  setSelected: (option: Option) => void;
}> = (props) => {
  const { options, selected, setSelected } = props;

  return (
    <div className="">
      <Listbox value={selected} onChange={(v) => setSelected(v)}>
        <div className="relative">
          <Listbox.Button
            className={cn(
              "relative w-full cursor-default rounded-lg bg-dark-100/60 px-3 py-2 text-left shadow-md",
              "sm:text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              // "focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 ",
            )}
          >
            <span className="block truncate text-slate-100">
              {selected?.name}
            </span>
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
            <Listbox.Options className="border-card absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-md border bg-dark-100 py-1 text-base text-slate-200 shadow-lg focus:outline-none sm:text-sm">
              {options.map((option, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `relative cursor-default select-none px-4 py-2 ${
                      active ? "bg-primary-600/50 text-white" : "text-slate-200"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "text-white" : "text-slate-200"
                        }`}
                      >
                        {option.name}
                      </span>
                      {/* {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null} */}
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
