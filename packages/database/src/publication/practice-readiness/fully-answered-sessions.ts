import {type Attempt,valid,pct,ordered} from "./shared";
export function fullyAnsweredSessions(rows:readonly Attempt[]):number{const v=valid(rows);return v.filter(r=>r.answered===r.total).length;}
