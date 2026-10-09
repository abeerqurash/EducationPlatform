import { describe,it,expect } from "vitest";
import { practicePace } from "./pace";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("practicePace",()=>{it("calculates an interpretable metric",()=>{expect(practicePace([sample(2,4)])).toEqual({totalMinutes:2,secondsPerQuestion:30});});it("handles no sessions",()=>{expect(()=>practicePace([])).not.toThrow();});});
