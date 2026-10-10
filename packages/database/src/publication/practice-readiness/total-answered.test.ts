import {describe,it,expect} from "vitest";
import {totalAnswered} from "./total-answered";
import type {Attempt} from "./shared";
const rows:Attempt[]=[{exam:"SAT",total:5,answered:4,correct:2,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},{exam:"ACT",total:5,answered:5,correct:5,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("totalAnswered",()=>{
it("computes sample",()=>expect(totalAnswered(rows)).toBe(9));
it("supports empty history",()=>expect(Number.isFinite(totalAnswered([]))).toBe(true));
it("excludes invalid rows",()=>expect(totalAnswered([...rows,{...rows[0],total:-1}])).toBe(totalAnswered(rows)));
});
