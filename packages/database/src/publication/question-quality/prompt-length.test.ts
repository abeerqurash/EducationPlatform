import {describe,it,expect} from "vitest";
import {checkPromptLength} from "./prompt-length";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkPromptLength",()=>{
it("accepts valid question",()=>expect(checkPromptLength([good])).toEqual([]));
it("flags invalid question",()=>expect(checkPromptLength([{...good,prompt:"x".repeat(3001)}])).toMatchObject([{questionId:"m01",rule:"prompt-length"}]));
it("handles empty bank",()=>expect(checkPromptLength([])).toEqual([]));
});
