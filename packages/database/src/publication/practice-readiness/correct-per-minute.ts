import {type Attempt,valid,pct,ordered} from "./shared";
export function correctPerMinute(rows:readonly Attempt[]):number{const v=valid(rows);return v.reduce((s,r)=>s+r.durationSeconds,0)>0?Math.round(v.reduce((s,r)=>s+r.correct,0)*600/v.reduce((s,r)=>s+r.durationSeconds,0))/10:0;}
