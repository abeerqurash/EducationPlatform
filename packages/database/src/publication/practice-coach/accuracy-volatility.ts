import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function accuracyVolatility(rows:readonly Attempt[]):number{const v=valid(rows);const a=v.map(r=>pct(r.correct,r.total));if(a.length<2)return 0;const mean=a.reduce((s,x)=>s+x,0)/a.length;return Math.round(Math.sqrt(a.reduce((s,x)=>s+(x-mean)**2,0)/a.length)*10)/10;}
