import { describe,it,expect } from "vitest";
import { recentSessions } from "./recent-sessions";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("recentSessions",()=>{it("calculates an interpretable metric",()=>{expect(recentSessions([sample(1,4),sample(3,4)],1)).toHaveLength(1);});it("handles no sessions",()=>{expect(()=>recentSessions([])).not.toThrow();});});
