import { describe,it,expect } from "vitest";
import { practiceStreak } from "./streak";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("practiceStreak",()=>{it("calculates an interpretable metric",()=>{expect(practiceStreak([sample(2,4),{...sample(2,4),createdAt:"2026-10-02T00:00:00Z"}])).toEqual({longest:2,activeDays:2});});it("handles no sessions",()=>{expect(()=>practiceStreak([])).not.toThrow();});});
