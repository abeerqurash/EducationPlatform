import {type Attempt,valid,pct,ordered} from "./shared";
export function zeroScoreCount(rows:readonly Attempt[]):number{const v=valid(rows);return v.filter(r=>r.correct===0).length;}
