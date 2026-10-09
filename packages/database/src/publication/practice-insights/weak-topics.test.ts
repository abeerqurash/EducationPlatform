import { describe,it,expect } from "vitest";
import { weakTopics } from "./weak-topics";
const sample=(correct:number,total:number)=>({exam:"SAT",total,answered:total,correct,percentage:Math.round(100*correct/total),durationSeconds:120,createdAt:"2026-10-01T00:00:00Z"});
describe("weakTopics",()=>{it("calculates an interpretable metric",()=>{expect(weakTopics([{...sample(1,4),topicBreakdown:[{topic:"Math",correct:1,total:4,answered:4}]}])[0]).toMatchObject({topic:"SAT / Math",accuracy:25});});it("handles no sessions",()=>{expect(()=>weakTopics([])).not.toThrow();});});
