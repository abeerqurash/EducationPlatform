import {describe,it,expect} from "vitest";
import {totalMissed} from "./total-missed";
import type {Attempt} from "./shared";
const rows:Attempt[]=[{exam:"SAT",total:5,answered:4,correct:2,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},{exam:"ACT",total:5,answered:5,correct:5,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("totalMissed",()=>{
it("computes sample",()=>expect(totalMissed(rows)).toBe(3));
it("supports empty history",()=>expect(Number.isFinite(totalMissed([]))).toBe(true));
it("excludes invalid rows",()=>expect(totalMissed([...rows,{...rows[0],total:-1}])).toBe(totalMissed(rows)));
});
