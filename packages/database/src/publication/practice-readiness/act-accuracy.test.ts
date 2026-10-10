import {describe,it,expect} from "vitest";
import {actAccuracy} from "./act-accuracy";
import type {Attempt} from "./shared";
const rows:Attempt[]=[{exam:"SAT",total:5,answered:4,correct:2,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},{exam:"ACT",total:5,answered:5,correct:5,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("actAccuracy",()=>{
it("computes sample",()=>expect(actAccuracy(rows)).toBe(100));
it("supports empty history",()=>expect(Number.isFinite(actAccuracy([]))).toBe(true));
it("excludes invalid rows",()=>expect(actAccuracy([...rows,{...rows[0],total:-1}])).toBe(actAccuracy(rows)));
});
