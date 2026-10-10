import {describe,it,expect} from "vitest";
import {checkDuplicateChoices} from "./duplicate-choices";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkDuplicateChoices",()=>{
it("accepts valid question",()=>expect(checkDuplicateChoices([good])).toEqual([]));
it("flags invalid question",()=>expect(checkDuplicateChoices([{...good,choices:["Alpha"," alpha ","Gamma","Delta"]}])).toMatchObject([{questionId:"m01",rule:"duplicate-choices"}]));
it("handles empty bank",()=>expect(checkDuplicateChoices([])).toEqual([]));
});
