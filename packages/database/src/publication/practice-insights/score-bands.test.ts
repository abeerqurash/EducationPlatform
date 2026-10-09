import { describe,it,expect } from "vitest";
import { scoreBands } from "./score-bands";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("scoreBands",()=>{it("calculates an interpretable metric",()=>{expect(scoreBands([sample(1,4),sample(2,4),sample(3,4),sample(4,4)])).toEqual({below50:1,from50To74:1,from75To89:1,atLeast90:1});});it("handles no sessions",()=>{expect(()=>scoreBands([])).not.toThrow();});});
