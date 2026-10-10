import {describe,it,expect} from "vitest";
import {practiceMinutes} from "./practice-minutes";
import type {Attempt} from "./shared";
const rows:Attempt[]=[
{exam:"SAT",total:5,answered:5,correct:2,percentage:40,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},
{exam:"SAT",total:5,answered:5,correct:5,percentage:100,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("practiceMinutes",()=>{
it("calculates expected value",()=>expect(practiceMinutes(rows)).toEqual(4));
it("handles no rows",()=>expect(()=>practiceMinutes([])).not.toThrow());
it("excludes malformed rows",()=>expect(practiceMinutes([...rows,{...rows[0],total:-1}])).toEqual(practiceMinutes(rows)));
});
