"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { ChevronDownIcon } from "@/components/ui/icons";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  name: string;
  label: string;
  value?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  className?: string;
  hideLabel?: boolean;
  disabled?: boolean;
};

export function Select({
  name,
  label,
  value = "",
  options,
  onChange,
  className = "",
  hideLabel = false,
  disabled = false,
}: SelectProps) {
  const id = useId();

  const containerRef =
    useRef<HTMLDivElement>(null);

  const triggerRef =
    useRef<HTMLButtonElement>(null);

  const optionRefs =
    useRef<
      Array<HTMLButtonElement | null>
    >([]);

  const [open, setOpen] =
    useState(false);

  const [activeIndex, setActiveIndex] =
    useState(-1);

  const selectedIndex =
    options.findIndex(
      (option) =>
        option.value === value,
    );

  const selectedOption =
    selectedIndex >= 0
      ? options[selectedIndex]
      : options[0];

  function isAvailable(
    index: number,
  ) {
    return (
      index >= 0 &&
      index < options.length &&
      !options[index]?.disabled
    );
  }

  function findNextAvailable(
    startIndex: number,
    direction: 1 | -1,
  ) {
    if (!options.length) {
      return -1;
    }

    let index = startIndex;

    for (
      let attempts = 0;
      attempts < options.length;
      attempts += 1
    ) {
      index =
        (index +
          direction +
          options.length) %
        options.length;

      if (isAvailable(index)) {
        return index;
      }
    }

    return -1;
  }

  function findFirstAvailable() {
    return options.findIndex(
      (option) =>
        !option.disabled,
    );
  }

  function findLastAvailable() {
    for (
      let index =
        options.length - 1;
      index >= 0;
      index -= 1
    ) {
      if (
        !options[index]?.disabled
      ) {
        return index;
      }
    }

    return -1;
  }

  function openMenu() {
    if (
      disabled ||
      options.length === 0
    ) {
      return;
    }

    const initialIndex =
      isAvailable(selectedIndex)
        ? selectedIndex
        : findFirstAvailable();

    setActiveIndex(initialIndex);
    setOpen(true);
  }

  function closeMenu(
    restoreFocus = false,
  ) {
    setOpen(false);

    if (restoreFocus) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  }

  function selectOption(
    index: number,
  ) {
    const option =
      options[index];

    if (
      !option ||
      option.disabled
    ) {
      return;
    }

    onChange?.(option.value);
    closeMenu(true);
  }

  function moveActive(
    direction: 1 | -1,
  ) {
    const start =
      activeIndex >= 0
        ? activeIndex
        : selectedIndex >= 0
          ? selectedIndex
          : direction === 1
            ? -1
            : 0;

    const next =
      findNextAvailable(
        start,
        direction,
      );

    if (next >= 0) {
      setActiveIndex(next);
    }
  }

  useEffect(() => {
    if (
      !open ||
      activeIndex < 0
    ) {
      return;
    }

    optionRefs.current[
      activeIndex
    ]?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  function handleTriggerKeyDown(
    event:
      React.KeyboardEvent<HTMLButtonElement>,
  ) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        if (!open) {
          openMenu();
        } else {
          moveActive(1);
        }

        break;

      case "ArrowUp":
        event.preventDefault();

        if (!open) {
          openMenu();
        } else {
          moveActive(-1);
        }

        break;

      case "Enter":
      case " ":
        event.preventDefault();

        if (!open) {
          openMenu();
        }

        break;

      case "Home":
        if (open) {
          event.preventDefault();

          setActiveIndex(
            findFirstAvailable(),
          );
        }

        break;

      case "End":
        if (open) {
          event.preventDefault();

          setActiveIndex(
            findLastAvailable(),
          );
        }

        break;

      case "Escape":
        if (open) {
          event.preventDefault();
          closeMenu();
        }

        break;
    }
  }

  function handleOptionKeyDown(
    event:
      React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;

      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;

      case "Home":
        event.preventDefault();

        setActiveIndex(
          findFirstAvailable(),
        );

        break;

      case "End":
        event.preventDefault();

        setActiveIndex(
          findLastAvailable(),
        );

        break;

      case "Enter":
      case " ":
        event.preventDefault();
        selectOption(index);
        break;

      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;

      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div
      ref={containerRef}
      className={`custom-select ${className}`}
    >
      <label
        id={`${id}-label`}
        className={
          hideLabel
            ? "sr-only"
            : undefined
        }
      >
        {label}
      </label>

      <input
        type="hidden"
        name={name}
        value={value}
      />

      <button
        ref={triggerRef}
        type="button"
        className="custom-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-labelledby={`${id}-label ${id}-selected`}
        disabled={disabled}
        onClick={() => {
          if (open) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
        onKeyDown={
          handleTriggerKeyDown
        }
      >
        <span
          id={`${id}-selected`}
          className="custom-select__selected"
        >
          {selectedOption?.label ??
            "Select"}
        </span>

        <span
          className="custom-select__chevron"
          aria-hidden="true"
        >
          <ChevronDownIcon />
        </span>
      </button>

      <div
        className={`custom-select__menu ${
          open
            ? "custom-select__menu--open"
            : ""
        }`}
      >
        <div
          id={`${id}-listbox`}
          className="custom-select__menu-inner"
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {options.map(
            (option, index) => {
              const isSelected =
                option.value ===
                value;

              const isActive =
                index ===
                activeIndex;

              return (
                <button
                  key={
                    option.value
                  }
                  ref={(element) => {
                    optionRefs.current[
                      index
                    ] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={
                    isSelected
                  }
                  disabled={
                    option.disabled
                  }
                  tabIndex={
                    open &&
                    isActive
                      ? 0
                      : -1
                  }
                  className={`custom-select__option ${
                    isSelected
                      ? "custom-select__option--selected"
                      : ""
                  } ${
                    isActive
                      ? "custom-select__option--active"
                      : ""
                  }`}
                  onMouseEnter={() => {
                    if (
                      !option.disabled
                    ) {
                      setActiveIndex(
                        index,
                      );
                    }
                  }}
                  onClick={() =>
                    selectOption(
                      index,
                    )
                  }
                  onKeyDown={(
                    event,
                  ) =>
                    handleOptionKeyDown(
                      event,
                      index,
                    )
                  }
                >
                  <span>
                    {
                      option.label
                    }
                  </span>

                  {isSelected ? (
                    <span
                      className="custom-select__check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  ) : null}
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}