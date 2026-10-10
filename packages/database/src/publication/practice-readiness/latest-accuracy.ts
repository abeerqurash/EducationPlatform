import {type Attempt,valid,pct,ordered} from "./shared";
export function latestAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);return v.length?(()=>{const r=ordered(v).at(-1)!;return pct(r.correct,r.total)})():0;}
