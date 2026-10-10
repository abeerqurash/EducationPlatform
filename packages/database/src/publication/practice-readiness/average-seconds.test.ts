import {describe,it,expect} from "vitest";
import {averageSeconds} from "./average-seconds";
import type {Attempt} from "./shared";
const rows:Attempt[]=[{exam:"SAT",total:5,answered:4,correct:2,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},{exam:"ACT",total:5,answered:5,correct:5,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("averageSeconds",()=>{
it("computes sample",()=>expect(averageSeconds(rows)).toBe(120));
it("supports empty history",()=>expect(Number.isFinite(averageSeconds([]))).toBe(true));
it("excludes invalid rows",()=>expect(averageSeconds([...rows,{...rows[0],total:-1}])).toBe(averageSeconds(rows)));
});
