import {describe,it,expect} from "vitest";
import {perfectSessionCount} from "./perfect-session-count";
import type {Attempt} from "./shared";
const rows:Attempt[]=[{exam:"SAT",total:5,answered:4,correct:2,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},{exam:"ACT",total:5,answered:5,correct:5,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("perfectSessionCount",()=>{
it("computes sample",()=>expect(perfectSessionCount(rows)).toBe(1));
it("supports empty history",()=>expect(Number.isFinite(perfectSessionCount([]))).toBe(true));
it("excludes invalid rows",()=>expect(perfectSessionCount([...rows,{...rows[0],total:-1}])).toBe(perfectSessionCount(rows)));
});
