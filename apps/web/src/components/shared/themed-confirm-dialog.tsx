"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

type Theme = "dashboard" | "public";
function ConfirmSubmit({ label }: { label: string }) { const {pending}=useFormStatus(); return <button type="submit" disabled={pending} className="rounded-full bg-[#171912] px-5 py-3 text-sm font-bold !text-white disabled:opacity-50">{pending ? "Working…" : label}</button>; }
export function ThemedConfirmDialog({ title, description, trigger, confirmLabel="Confirm", action, fields, theme="dashboard" }: { title:string;description:string;trigger:ReactNode;confirmLabel?:string;action:(data:FormData)=>void|Promise<void>;fields:Record<string,string>;theme?:Theme }) {
  const [open,setOpen]=useState(false);const cancel=useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(open)cancel.current?.focus();},[open]);
  useEffect(()=>{if(!open)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false);};document.addEventListener("keydown",onKey);return()=>document.removeEventListener("keydown",onKey);},[open]);
  return <><button type="button" onClick={()=>setOpen(true)} className="text-xs font-semibold text-rose-700 underline underline-offset-2 hover:text-rose-900">{trigger}</button>{open&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10120e]/60 p-5" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false);}}><div role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description" className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl"><div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full ${theme==="public"?"bg-[#d8ff62]":"bg-[#eff1e8]"}`} aria-hidden="true">!</div><h2 id="confirm-dialog-title" className="text-xl font-extrabold text-[#171912]">{title}</h2><p id="confirm-dialog-description" className="mt-2 text-sm leading-6 text-slate-600">{description}</p><form action={action} className="mt-7 flex flex-wrap justify-end gap-3">{Object.entries(fields).map(([name,value])=><input key={name} type="hidden" name={name} value={value}/>)}<button ref={cancel} type="button" onClick={()=>setOpen(false)} className="rounded-full border border-[#dedfd4] px-5 py-3 text-sm font-bold text-[#171912]">Cancel</button><ConfirmSubmit label={confirmLabel}/></form></div></div>}</>;
}
