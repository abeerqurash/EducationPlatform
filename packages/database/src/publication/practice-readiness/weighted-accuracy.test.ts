import {describe,it,expect} from "vitest";
import {weightedAccuracy} from "./weighted-accuracy";
import type {Attempt} from "./shared";
const rows:Attempt[]=[{exam:"SAT",total:5,answered:4,correct:2,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},{exam:"ACT",total:5,answered:5,correct:5,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("weightedAccuracy",()=>{
it("computes sample",()=>expect(weightedAccuracy(rows)).toBe(70));
it("supports empty history",()=>expect(Number.isFinite(weightedAccuracy([]))).toBe(true));
it("excludes invalid rows",()=>expect(weightedAccuracy([...rows,{...rows[0],total:-1}])).toBe(weightedAccuracy(rows)));
});
