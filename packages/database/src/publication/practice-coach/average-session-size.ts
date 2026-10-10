import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function averageSessionSize(rows:readonly Attempt[]):number{const v=valid(rows);return v.length?Math.round(v.reduce((s,r)=>s+r.total,0)/v.length*10)/10:0;}
