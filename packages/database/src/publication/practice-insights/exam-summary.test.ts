import { describe,it,expect } from "vitest";
import { examSummary } from "./exam-summary";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("examSummary",()=>{it("calculates an interpretable metric",()=>{expect(examSummary([sample(2,4),{...sample(1,2),exam:"ACT"}])).toMatchObject([{exam:"ACT",accuracy:50},{exam:"SAT",accuracy:50}]);});it("handles no sessions",()=>{expect(()=>examSummary([])).not.toThrow();});});
