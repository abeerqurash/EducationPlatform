import {describe,it,expect} from "vitest";
import {checkExplanationLength} from "./explanation-length";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkExplanationLength",()=>{
it("accepts valid question",()=>expect(checkExplanationLength([good])).toEqual([]));
it("flags invalid question",()=>expect(checkExplanationLength([{...good,explanation:"x".repeat(5001)}])).toMatchObject([{questionId:"m01",rule:"explanation-length"}]));
it("handles empty bank",()=>expect(checkExplanationLength([])).toEqual([]));
});
