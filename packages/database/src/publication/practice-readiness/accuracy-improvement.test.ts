import {describe,it,expect} from "vitest";
import {accuracyImprovement} from "./accuracy-improvement";
import type {Attempt} from "./shared";
const rows:Attempt[]=[{exam:"SAT",total:5,answered:4,correct:2,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},{exam:"ACT",total:5,answered:5,correct:5,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("accuracyImprovement",()=>{
it("computes sample",()=>expect(accuracyImprovement(rows)).toBe(60));
it("supports empty history",()=>expect(Number.isFinite(accuracyImprovement([]))).toBe(true));
it("excludes invalid rows",()=>expect(accuracyImprovement([...rows,{...rows[0],total:-1}])).toBe(accuracyImprovement(rows)));
});
