import { describe,it,expect } from "vitest";
import { dailyActivity } from "./daily-activity";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("dailyActivity",()=>{it("calculates an interpretable metric",()=>{expect(dailyActivity([sample(2,4),sample(3,4)])).toEqual([{day:"2026-10-01",sessions:2,questions:8}]);});it("handles no sessions",()=>{expect(()=>dailyActivity([])).not.toThrow();});});
