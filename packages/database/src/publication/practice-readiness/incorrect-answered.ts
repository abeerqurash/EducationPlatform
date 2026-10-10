import {type Attempt,valid,pct,ordered} from "./shared";
export function incorrectAnswered(rows:readonly Attempt[]):number{const v=valid(rows);return v.reduce((s,r)=>s+r.answered-r.correct,0);}
