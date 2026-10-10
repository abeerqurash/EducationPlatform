import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function sessionsByExam(rows:readonly Attempt[]):Record<string,number>{const v=valid(rows);const o:Record<string,number>={};for(const r of v)o[r.exam]=(o[r.exam]??0)+1;return o;}
