import { describe,it,expect } from "vitest";
import { bestSession } from "./best-session";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("bestSession",()=>{it("calculates an interpretable metric",()=>{expect(bestSession([sample(1,4),sample(3,4)])?.correct).toBe(3);});it("handles no sessions",()=>{expect(()=>bestSession([])).not.toThrow();});});
