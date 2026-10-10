import type { Attempt } from "../practice-insights/shared";
export type { Attempt };
export const valid=(rows:readonly Attempt[])=>rows.filter(r=>Number.isSafeInteger(r.total)&&r.total>0&&Number.isSafeInteger(r.correct)&&r.correct>=0&&r.correct<=r.total&&Number.isSafeInteger(r.answered)&&r.answered>=r.correct&&r.answered<=r.total&&Number.isFinite(r.durationSeconds)&&r.durationSeconds>=0&&Number.isFinite(new Date(r.createdAt).getTime()));
export const pct=(n:number,d:number)=>d>0?Math.round(100*n/d):0;
export const ordered=(rows:readonly Attempt[])=>[...rows].sort((a,b)=>new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime());
