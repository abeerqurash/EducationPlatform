import {type Attempt,valid,pct,ordered} from "./shared";
export function perfectSessionCount(rows:readonly Attempt[]):number{const v=valid(rows);return v.filter(r=>r.correct===r.total).length;}
