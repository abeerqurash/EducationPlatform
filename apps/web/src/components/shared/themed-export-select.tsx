"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = { value: string; label: string };

/** Reusable dashboard listbox. A hidden input submits the selected value with native GET forms. */
export function ThemedExportSelect({ name, label, options, defaultValue, value, onValueChange }: {
  name: string;
  label: string;
  options: Option[];
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const initial = Math.max(0, options.findIndex(option => option.value === defaultValue));
  const [selected, setSelected] = useState(initial);
  const [focused, setFocused] = useState(initial);
  const [open, setOpen] = useState(false);
  const controlledIndex = value === undefined ? selected : Math.max(0, options.findIndex(option => option.value === value));
  const activeIndex = controlledIndex;
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, [open]);

  const choose = (index: number) => {
    setSelected(index);
    onValueChange?.(options[index].value);
    setFocused(index);
    setOpen(false);
    trigger.current?.focus();
  };
  const move = (index: number) => {
    setFocused(index);
    menu.current?.querySelectorAll<HTMLElement>('[role="option"]')[index]?.scrollIntoView({ block: "nearest" });
  };
  const expand = (index = activeIndex) => {
    setFocused(index);
    setOpen(true);
    requestAnimationFrame(() => menu.current?.focus());
  };

  return (
    <div ref={root} className="relative min-w-[145px]">
      <input type="hidden" name={name} value={options[activeIndex].value} />
      <span id={`${id}-label`} className="mb-1 block text-xs font-bold text-[#171912]">{label}</span>
      <button ref={trigger} type="button" aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} onClick={() => open ? setOpen(false) : expand()} onKeyDown={event => {
        if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
          event.preventDefault();
          expand((activeIndex + (event.key === "ArrowDown" ? 1 : options.length - 1)) % options.length);
        } else if (event.key === "Escape" && open) {
          event.preventDefault(); setOpen(false);
        }
      }} className="flex h-[44px] w-full items-center justify-between gap-3 rounded-full border border-[#dfe0d5] bg-white px-4 text-left text-xs font-bold text-[#171912] transition hover:border-[#171912] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">
        <span id={`${id}-value`} className="truncate">{options[activeIndex].label}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && <div ref={menu} id={`${id}-list`} role="listbox" tabIndex={0} aria-labelledby={`${id}-label`} aria-activedescendant={`${id}-option-${focused}`} onKeyDown={event => {
        if (event.key === "Escape" || event.key === "Tab") {
          if (event.key === "Escape") event.preventDefault();
          setOpen(false);
          if (event.key === "Escape") trigger.current?.focus();
        } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          move(event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (focused + (event.key === "ArrowDown" ? 1 : options.length - 1)) % options.length);
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault(); choose(focused);
        }
      }} className="absolute left-0 top-full z-[80] mt-2 max-h-56 w-full min-w-[160px] overflow-y-auto rounded-2xl border border-[#e3e4d9] bg-white p-1.5 shadow-[0_18px_50px_rgba(0,0,0,.18)] focus:outline-none">
        {options.map((option, index) => <button key={option.value} id={`${id}-option-${index}`} type="button" role="option" aria-selected={index === activeIndex} onMouseEnter={() => setFocused(index)} onClick={() => choose(index)} className={`block w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${index === activeIndex ? "bg-[#171912] !text-white" : index === focused ? "bg-[#eef0e8] text-[#171912]" : "bg-white text-[#171912] hover:bg-[#eef0e8]"}`}>{option.label}</button>)}
      </div>}
    </div>
  );
}
