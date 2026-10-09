import { describe,it,expect } from "vitest";
import { weeklySummary } from "./weekly-summary";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("weeklySummary",()=>{it("calculates an interpretable metric",()=>{expect(weeklySummary([sample(2,4)])[0]).toMatchObject({week:"2026-09-28",sessions:1,accuracy:50});});it("handles no sessions",()=>{expect(()=>weeklySummary([])).not.toThrow();});});
