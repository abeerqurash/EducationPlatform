import { describe,it,expect } from "vitest";
import { rollingAccuracy } from "./rolling-accuracy";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("rollingAccuracy",()=>{it("calculates an interpretable metric",()=>{expect(rollingAccuracy([sample(1,4),sample(3,4)],2).map(x=>x.accuracy)).toEqual([25,50]);});it("handles no sessions",()=>{expect(()=>rollingAccuracy([])).not.toThrow();});});
