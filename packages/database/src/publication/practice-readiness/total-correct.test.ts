import {describe,it,expect} from "vitest";
import {totalCorrect} from "./total-correct";
import type {Attempt} from "./shared";
const rows:Attempt[]=[{exam:"SAT",total:5,answered:4,correct:2,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},{exam:"ACT",total:5,answered:5,correct:5,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("totalCorrect",()=>{
it("computes sample",()=>expect(totalCorrect(rows)).toBe(7));
it("supports empty history",()=>expect(Number.isFinite(totalCorrect([]))).toBe(true));
it("excludes invalid rows",()=>expect(totalCorrect([...rows,{...rows[0],total:-1}])).toBe(totalCorrect(rows)));
});
