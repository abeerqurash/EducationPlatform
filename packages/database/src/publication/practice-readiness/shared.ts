export type Attempt = Readonly<{exam:string;total:number;answered:number;correct:number;durationSeconds:number;createdAt:Date|string}>;
export function valid(rows:readonly Attempt[]):Attempt[]{return rows.filter(r=>["SAT","ACT"].includes(r.exam)&&Number.isSafeInteger(r.total)&&r.total>0&&Number.isSafeInteger(r.answered)&&r.answered>=0&&r.answered<=r.total&&Number.isSafeInteger(r.correct)&&r.correct>=0&&r.correct<=r.answered&&Number.isFinite(r.durationSeconds)&&r.durationSeconds>=0&&Number.isFinite(new Date(r.createdAt).getTime()));}
export const pct=(a:number,b:number)=>b>0?Math.round(a*100/b):0;
export const ordered=(rows:readonly Attempt[])=>[...rows].sort((a,b)=>new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime());
