import {describe,it,expect} from "vitest";
import {checkCorrectRange} from "./correct-range";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkCorrectRange",()=>{
it("accepts valid question",()=>expect(checkCorrectRange([good])).toEqual([]));
it("flags invalid question",()=>expect(checkCorrectRange([{...good,correct:8}])).toMatchObject([{questionId:"m01",rule:"correct-range"}]));
it("handles empty bank",()=>expect(checkCorrectRange([])).toEqual([]));
});
