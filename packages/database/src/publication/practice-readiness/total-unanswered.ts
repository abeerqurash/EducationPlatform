import {type Attempt,valid,pct,ordered} from "./shared";
export function totalUnanswered(rows:readonly Attempt[]):number{const v=valid(rows);return v.reduce((s,r)=>s+r.total-r.answered,0);}
