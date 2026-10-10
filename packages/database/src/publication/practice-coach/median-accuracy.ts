import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function medianAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);const a=v.map(r=>pct(r.correct,r.total)).sort((a,b)=>a-b);const n=a.length;return n?(n%2?a[(n-1)/2]:Math.round((a[n/2-1]+a[n/2])/2)):0;}
