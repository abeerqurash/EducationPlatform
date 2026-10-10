import {type Attempt,valid,pct,ordered} from "./shared";
export function bestAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);return v.length?Math.max(...v.map(r=>pct(r.correct,r.total))):0;}
