import { describe,it,expect } from "vitest";
import { accuracyTrend } from "./accuracy-trend";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("accuracyTrend",()=>{it("calculates an interpretable metric",()=>{expect(accuracyTrend([sample(2,4),sample(3,4)])).toEqual([{session:1,date:"2026-10-01",accuracy:50},{session:2,date:"2026-10-01",accuracy:75}]);});it("handles no sessions",()=>{expect(()=>accuracyTrend([])).not.toThrow();});});
