export type Attempt = Readonly<{exam:string;total:number;answered:number;correct:number;percentage:number;durationSeconds:number;createdAt:Date|string;topicBreakdown?:readonly Readonly<{topic:string;total:number;answered:number;correct:number}>[]}>;
export const byDate = (a:Attempt,b:Attempt) => new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime();
export const percent = (n:number,d:number) => d>0?Math.round(100*n/d):0;
export const dayKey = (d:Date|string) => new Date(d).toISOString().slice(0,10);
