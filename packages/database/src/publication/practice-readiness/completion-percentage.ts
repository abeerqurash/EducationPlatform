import {type Attempt,valid,pct,ordered} from "./shared";
export function completionPercentage(rows:readonly Attempt[]):number{const v=valid(rows);return pct(v.reduce((s,r)=>s+r.answered,0),v.reduce((s,r)=>s+r.total,0));}
