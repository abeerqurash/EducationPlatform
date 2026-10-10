import {type Attempt,valid,pct,ordered} from "./shared";
export function sessionSpanDays(rows:readonly Attempt[]):number{const v=valid(rows);return v.length<2?0:Math.floor((new Date(ordered(v).at(-1)!.createdAt).getTime()-new Date(ordered(v)[0].createdAt).getTime())/86400000);}
