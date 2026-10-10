import {type Attempt,valid,pct,ordered} from "./shared";
export function sessionCount(rows:readonly Attempt[]):number{const v=valid(rows);return v.length;}
