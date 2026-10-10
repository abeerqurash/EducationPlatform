import {describe,it,expect} from "vitest";
import {averageSessionDuration} from "./average-session-duration";
import type {Attempt} from "./shared";
const rows:Attempt[]=[
{exam:"SAT",total:5,answered:5,correct:2,percentage:40,durationSeconds:120,createdAt:"2026-10-01T12:00:00Z"},
{exam:"SAT",total:5,answered:5,correct:5,percentage:100,durationSeconds:120,createdAt:"2026-10-02T12:00:00Z"}];
describe("averageSessionDuration",()=>{
it("calculates expected value",()=>expect(averageSessionDuration(rows)).toEqual(120));
it("handles no rows",()=>expect(()=>averageSessionDuration([])).not.toThrow());
it("excludes malformed rows",()=>expect(averageSessionDuration([...rows,{...rows[0],total:-1}])).toEqual(averageSessionDuration(rows)));
});
