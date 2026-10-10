import {describe,it,expect} from "vitest";
import {checkExamValue} from "./exam-value";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkExamValue",()=>{
it("accepts valid question",()=>expect(checkExamValue([good])).toEqual([]));
it("flags invalid question",()=>expect(checkExamValue([{...good,exam:"GRE"}])).toMatchObject([{questionId:"m01",rule:"exam-value"}]));
it("handles empty bank",()=>expect(checkExamValue([])).toEqual([]));
});
