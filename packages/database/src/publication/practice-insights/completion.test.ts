import { describe,it,expect } from "vitest";
import { completionRate } from "./completion";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("completionRate",()=>{it("calculates an interpretable metric",()=>{expect(completionRate([sample(2,4)])).toEqual({answered:4,total:4,rate:100});});it("handles no sessions",()=>{expect(()=>completionRate([])).not.toThrow();});});
