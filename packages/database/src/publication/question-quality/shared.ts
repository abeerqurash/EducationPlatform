export type Question=Readonly<{id:string;exam:string;topic:string;prompt:string;choices:readonly string[];correct:number;explanation:string}>;
export type Finding=Readonly<{questionId:string;rule:string;message:string}>;
export const issue=(q:Question,rule:string,message:string):Finding=>({questionId:q.id,rule,message});
export const normalize=(s:string)=>s.trim().replace(/\s+/g," ").toLocaleLowerCase("en");
