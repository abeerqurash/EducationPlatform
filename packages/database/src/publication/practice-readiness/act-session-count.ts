import {type Attempt,valid,pct,ordered} from "./shared";
export function actSessionCount(rows:readonly Attempt[]):number{const v=valid(rows);return v.filter(r=>r.exam==="ACT").length;}
