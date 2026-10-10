import {describe,it,expect} from "vitest";
import {distinctPracticeDays} from "./distinct-practice-days";
import type {Attempt} from "./shared";
const rows:Attempt[]=[
{exam:"SAT",total:5,answered:5,correct:2,percentage:40,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},
{exam:"SAT",total:5,answered:5,correct:5,percentage:100,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("distinctPracticeDays",()=>{
it("calculates expected value",()=>expect(distinctPracticeDays(rows)).toEqual(2));
it("handles no rows",()=>expect(()=>distinctPracticeDays([])).not.toThrow());
it("excludes malformed rows",()=>expect(distinctPracticeDays([...rows,{...rows[0],total:-1}])).toEqual(distinctPracticeDays(rows)));
});
