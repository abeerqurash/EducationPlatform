import {describe,it,expect} from "vitest";
import {checkMissingExplanation} from "./missing-explanation";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkMissingExplanation",()=>{
it("accepts valid question",()=>expect(checkMissingExplanation([good])).toEqual([]));
it("flags invalid question",()=>expect(checkMissingExplanation([{...good,explanation:""}])).toMatchObject([{questionId:"m01",rule:"missing-explanation"}]));
it("handles empty bank",()=>expect(checkMissingExplanation([])).toEqual([]));
});
