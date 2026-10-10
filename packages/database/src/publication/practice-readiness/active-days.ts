import {type Attempt,valid,pct,ordered} from "./shared";
export function activeDays(rows:readonly Attempt[]):number{const v=valid(rows);return new Set(v.map(r=>new Date(r.createdAt).toISOString().slice(0,10))).size;}
