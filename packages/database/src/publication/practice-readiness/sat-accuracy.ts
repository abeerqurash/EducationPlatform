import {type Attempt,valid,pct,ordered} from "./shared";
export function satAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);return (()=>{const a=v.filter(r=>r.exam==="SAT");return pct(a.reduce((s,r)=>s+r.correct,0),a.reduce((s,r)=>s+r.total,0))})();}
