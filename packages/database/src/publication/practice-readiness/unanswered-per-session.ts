import {type Attempt,valid,pct,ordered} from "./shared";
export function unansweredPerSession(rows:readonly Attempt[]):number{const v=valid(rows);return v.length?Math.round(v.reduce((s,r)=>s+r.total-r.answered,0)/v.length*10)/10:0;}
