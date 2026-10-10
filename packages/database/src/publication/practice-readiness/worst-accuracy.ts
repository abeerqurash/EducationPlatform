import {type Attempt,valid,pct,ordered} from "./shared";
export function worstAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);return v.length?Math.min(...v.map(r=>pct(r.correct,r.total))):0;}
