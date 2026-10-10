import {type Attempt,valid,pct,ordered} from "./shared";
export function firstAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);return v.length?(()=>{const r=ordered(v)[0];return pct(r.correct,r.total)})():0;}
