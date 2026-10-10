import {type Attempt,valid,pct,ordered} from "./shared";
export function actAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);return (()=>{const a=v.filter(r=>r.exam==="ACT");return pct(a.reduce((s,r)=>s+r.correct,0),a.reduce((s,r)=>s+r.total,0))})();}
