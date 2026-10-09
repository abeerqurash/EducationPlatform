import { describe,it,expect } from "vitest";
import { firstLastChange } from "./first-last";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("firstLastChange",()=>{it("calculates an interpretable metric",()=>{expect(firstLastChange([sample(1,4),sample(3,4)])).toBe(50);});it("handles no sessions",()=>{expect(()=>firstLastChange([])).not.toThrow();});});
