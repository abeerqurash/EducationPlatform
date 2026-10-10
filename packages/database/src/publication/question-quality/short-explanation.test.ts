import {describe,it,expect} from "vitest";
import {checkShortExplanation} from "./short-explanation";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkShortExplanation",()=>{
it("accepts valid question",()=>expect(checkShortExplanation([good])).toEqual([]));
it("flags invalid question",()=>expect(checkShortExplanation([{...good,explanation:"Too short"}])).toMatchObject([{questionId:"m01",rule:"short-explanation"}]));
it("handles empty bank",()=>expect(checkShortExplanation([])).toEqual([]));
});
