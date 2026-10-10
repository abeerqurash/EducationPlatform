import {describe,it,expect} from "vitest";
import {checkScienceEligibility} from "./science-eligibility";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkScienceEligibility",()=>{
it("accepts valid question",()=>expect(checkScienceEligibility([good])).toEqual([]));
it("flags invalid question",()=>expect(checkScienceEligibility([{...good,topic:"Science",exam:"Both"}])).toMatchObject([{questionId:"m01",rule:"science-eligibility"}]));
it("handles empty bank",()=>expect(checkScienceEligibility([])).toEqual([]));
});
