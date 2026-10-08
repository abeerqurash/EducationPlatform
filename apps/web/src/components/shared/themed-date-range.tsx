"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Theme = "dashboard" | "public";
const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const valid = (v: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [year, month, day] = v.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
};

const monthNames = Array.from({ length: 12 }, (_, index) => new Date(Date.UTC(2024, index, 1)).toLocaleDateString("en-US", { month: "long", timeZone: "UTC" }));

function CalendarDropdown({ label, value, options, onSelect }: { label: string; value: number; options: { value: number; label: string }[]; onSelect: (value: number) => void }) {
  const optionPrefix = useId();
  const [expanded, setExpanded] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const currentIndex = Math.max(0, options.findIndex(option => option.value === value));
  const [focusedIndex, setFocusedIndex] = useState(currentIndex);
  useEffect(() => {
    if (!expanded) return;
    const onOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setExpanded(false);
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, [expanded]);
  const choose = (index: number) => {
    onSelect(options[index].value);
    setExpanded(false);
    button.current?.focus();
  };
  const openMenu = () => {
    setFocusedIndex(currentIndex);
    setExpanded(true);
    requestAnimationFrame(() => list.current?.focus());
  };
  return <div ref={container} className="relative min-w-0 flex-1">
    <span className="mb-1 block text-[11px] font-bold text-slate-600">{label}</span>
    <button ref={button} type="button" aria-haspopup="listbox" aria-expanded={expanded} aria-label={`${label} selector`} onClick={() => expanded ? setExpanded(false) : openMenu()} className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#dfe0d5] bg-[#fafaf7] px-3 py-2 text-left text-xs font-bold text-[#171912] hover:border-[#171912] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">
      <span className="truncate">{options[currentIndex].label}</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
    </button>
    {expanded && <div ref={list} role="listbox" tabIndex={0} aria-label={label} aria-activedescendant={`${optionPrefix}-option-${focusedIndex}`} onKeyDown={event => {
      if (event.key === "Escape") { event.preventDefault(); setExpanded(false); button.current?.focus(); }
      else if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (focusedIndex + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
        setFocusedIndex(next);
        document.getElementById(`${optionPrefix}-option-${next}`)?.scrollIntoView({ block: "nearest" });
      } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(focusedIndex); }
    }} className="absolute left-0 top-full z-[70] mt-1 max-h-52 w-full min-w-[125px] overflow-y-auto rounded-2xl border border-[#e3e4d9] bg-white p-1.5 shadow-[0_18px_50px_rgba(0,0,0,.18)] focus:outline-none">
      {options.map((option, index) => <button id={`${optionPrefix}-option-${index}`} key={option.value} role="option" aria-selected={value === option.value} type="button" onMouseEnter={() => setFocusedIndex(index)} onClick={() => choose(index)} className={`block w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${value === option.value ? "bg-[#171912] !text-white" : index === focusedIndex ? "bg-[#eef0e8] text-[#171912]" : "bg-white text-[#171912] hover:bg-[#eef0e8]"}`}>{option.label}</button>)}
    </div>}
  </div>;
}

export function ThemedDatePicker({ label, value, onChange, theme = "dashboard" }: { label: string; value: string; onChange: (value: string) => void; theme?: Theme }) {
  const [open, setOpen] = useState(false);
  const initial = valid(value) ? new Date(`${value}T12:00:00Z`) : new Date();
  const [month, setMonth] = useState(() => new Date(initial.getUTCFullYear(), initial.getUTCMonth(), 1));
  const root = useRef<HTMLDivElement>(null);
  const headingId = "calendar-heading-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    const outside = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  const y = month.getFullYear(), m = month.getMonth();
  const offset = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const chosen = valid(value) ? value : "";
  const dark = theme === "dashboard";
  return <div ref={root} className="relative min-w-[155px] flex-1 sm:flex-none">
    <span className="mb-2 block text-xs font-bold text-slate-700">{label}</span>
    <button ref={trigger} type="button" aria-haspopup="dialog" aria-label={`Choose ${label.toLowerCase()}`} aria-expanded={open} onClick={() => { if (!open && valid(value)) { const [year, selectedMonth] = value.split("-").map(Number); setMonth(new Date(year, selectedMonth - 1, 1)); } setOpen(!open); }} className="flex w-full items-center justify-between gap-4 rounded-full border border-[#dedfd4] bg-white px-4 py-3 text-left text-xs font-semibold text-[#171912] transition hover:border-[#171912] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">
      <span>{chosen ? `${chosen.slice(5,7)}/${chosen.slice(8)}/${chosen.slice(0,4)}` : "Choose date"}</span><span aria-hidden="true">▦</span>
    </button>
    {open && <div role="dialog" aria-modal="false" aria-labelledby={headingId} aria-label={`${label} calendar`} className="absolute left-0 top-full z-50 mt-2 w-[min(310px,calc(100vw-48px))] rounded-[24px] border border-[#e3e4d9] bg-white p-4 shadow-[0_24px_70px_rgba(0,0,0,.18)]">
      <div className="mb-4 flex items-center justify-between gap-2"><button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(y,m-1,1))} className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-100">←</button><span id={headingId} className="text-sm font-extrabold text-[#171912]">{month.toLocaleDateString("en-US", {month:"long",year:"numeric"})}</span><button type="button" aria-label="Next month" onClick={() => setMonth(new Date(y,m+1,1))} className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-100">→</button></div>
      <div className="mb-3 flex gap-2"><CalendarDropdown label="Month" value={m} options={monthNames.map((name, index) => ({ value: index, label: name }))} onSelect={next => setMonth(new Date(y, next, 1))} /><CalendarDropdown label="Year" value={y} options={Array.from({ length: 201 }, (_, index) => ({ value: y - 100 + index, label: String(y - 100 + index) })).filter(option => option.value >= 1 && option.value <= 9999)} onSelect={next => setMonth(new Date(next, m, 1))} /></div>
      <div className="grid grid-cols-7 gap-1 text-center">{["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><span key={d} className="py-2 text-[11px] font-bold text-slate-500">{d}</span>)}{Array.from({length:offset},(_,i)=><span key={`e${i}`} />)}{Array.from({length:days},(_,i)=>{const date=iso(y,m,i+1);const selected=chosen===date;return <button key={date} type="button" aria-label={date} aria-pressed={selected} onClick={()=>{onChange(date);setOpen(false);trigger.current?.focus();}} className={`aspect-square rounded-full text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912] ${selected ? dark ? "bg-[#171912] text-white" : "bg-[#d8ff62] text-[#171912]" : "text-[#171912] hover:bg-[#eef0e8]"}`}>{i+1}</button>;})}</div>
      <div className="mt-4 flex justify-between border-t border-slate-100 pt-3"><button type="button" onClick={()=>{onChange("");setOpen(false);trigger.current?.focus();}} className="rounded-full px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100">Clear</button><button type="button" onClick={()=>{const now=new Date();onChange(iso(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()));setOpen(false);trigger.current?.focus();}} className="rounded-full bg-[#171912] px-4 py-2 text-xs font-bold text-white">Today</button></div>
    </div>}
  </div>;
}

export function ThemedDateRange({ exam, sort = "newest", size = 15, from, to }: { exam: string; sort?: "newest" | "oldest"; size?: number; from: string; to: string }) {
  const router = useRouter();
  const [start,setStart]=useState(from),[end,setEnd]=useState(to);
  const [error,setError]=useState("");
  const navigate=(a:string,b:string)=>{if(a&&b&&a>b){setError("The start date must not be after the end date.");return;}setError("");const p=new URLSearchParams({exam,sort,size:String(size),page:"1"});if(a)p.set("from",a);if(b)p.set("to",b);router.push(`/dashboard/test-prep?${p.toString()}`);};
  return <div className="mb-5"><div className="flex flex-wrap items-end gap-3"><ThemedDatePicker label="From (UTC)" value={start} onChange={setStart}/><ThemedDatePicker label="To (UTC)" value={end} onChange={setEnd}/><button type="button" onClick={()=>navigate(start,end)} className="min-h-[43px] rounded-full bg-[#171912] px-5 py-3 text-xs font-bold !text-white transition hover:-translate-y-0.5 hover:shadow-lg">Apply dates</button><button type="button" onClick={()=>{setStart("");setEnd("");navigate("","");}} className="min-h-[43px] rounded-full border border-[#dcded2] bg-white px-5 py-3 text-xs font-bold text-[#171912] transition hover:bg-[#eef0e8]">Clear dates</button></div>{error&&<p role="alert" className="mt-2 text-xs font-semibold text-rose-700">{error}</p>}</div>;
}
