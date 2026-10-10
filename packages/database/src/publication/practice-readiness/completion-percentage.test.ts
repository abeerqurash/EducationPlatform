import {describe,it,expect} from "vitest";
import {completionPercentage} from "./completion-percentage";
import type {Attempt} from "./shared";
const rows:Attempt[]=[{exam:"SAT",total:5,answered:4,correct:2,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},{exam:"ACT",total:5,answered:5,correct:5,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("completionPercentage",()=>{
it("computes sample",()=>expect(completionPercentage(rows)).toBe(90));
it("supports empty history",()=>expect(Number.isFinite(completionPercentage([]))).toBe(true));
it("excludes invalid rows",()=>expect(completionPercentage([...rows,{...rows[0],total:-1}])).toBe(completionPercentage(rows)));
});
