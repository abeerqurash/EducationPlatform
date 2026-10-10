import {describe,it,expect} from "vitest";
import {checkChoiceCount} from "./choice-count";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkChoiceCount",()=>{
it("accepts valid question",()=>expect(checkChoiceCount([good])).toEqual([]));
it("flags invalid question",()=>expect(checkChoiceCount([{...good,choices:["A","B"]}])).toMatchObject([{questionId:"m01",rule:"choice-count"}]));
it("handles empty bank",()=>expect(checkChoiceCount([])).toEqual([]));
});
