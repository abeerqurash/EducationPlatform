import {type Attempt,valid,pct,ordered} from "./shared";
export function totalCorrect(rows:readonly Attempt[]):number{const v=valid(rows);return v.reduce((s,r)=>s+r.correct,0);}
