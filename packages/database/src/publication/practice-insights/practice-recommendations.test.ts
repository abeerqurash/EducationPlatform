import { describe,it,expect } from "vitest";
import { practiceRecommendations } from "./practice-recommendations";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("practiceRecommendations",()=>{it("calculates an interpretable metric",()=>{expect(practiceRecommendations([])[0]).toContain("first practice");expect(practiceRecommendations([sample(1,4)]).length).toBeGreaterThan(0);});it("handles no sessions",()=>{expect(()=>practiceRecommendations([])).not.toThrow();});});
