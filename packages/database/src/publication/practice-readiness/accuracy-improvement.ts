import {type Attempt,valid,pct,ordered} from "./shared";
export function accuracyImprovement(rows:readonly Attempt[]):number{const v=valid(rows);return v.length<2?0:(()=>{const a=ordered(v);return pct(a.at(-1)!.correct,a.at(-1)!.total)-pct(a[0].correct,a[0].total)})();}
