import {describe,it,expect} from "vitest";
import {checkBlankChoice} from "./blank-choice";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkBlankChoice",()=>{
it("accepts valid question",()=>expect(checkBlankChoice([good])).toEqual([]));
it("flags invalid question",()=>expect(checkBlankChoice([{...good,choices:["Alpha"," ","Gamma","Delta"]}])).toMatchObject([{questionId:"m01",rule:"blank-choice"}]));
it("handles empty bank",()=>expect(checkBlankChoice([])).toEqual([]));
});
