import {describe,it,expect} from "vitest";
import {checkMissingPrompt} from "./missing-prompt";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkMissingPrompt",()=>{
it("accepts valid question",()=>expect(checkMissingPrompt([good])).toEqual([]));
it("flags invalid question",()=>expect(checkMissingPrompt([{...good,prompt:" "}])).toMatchObject([{questionId:"m01",rule:"missing-prompt"}]));
it("handles empty bank",()=>expect(checkMissingPrompt([])).toEqual([]));
});
